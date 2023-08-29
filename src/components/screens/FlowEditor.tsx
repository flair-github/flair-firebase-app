import axios from 'axios'
import React, { LegacyRef, useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  SelectionMode,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from 'reactflow'

import 'reactflow/dist/style.css'
// import '@manifoldco/react-select-zero/assets/react-select-zero.css'
// import './style/override.css'
import { DocWorkflow, DocWorkflowRequest } from 'Types/firebaseStructure'
import { Timestamp, serverTimestamp } from 'firebase/firestore'
import { atom, useAtom, useAtomValue } from 'jotai'
import { useLocation, useNavigate } from 'react-router-dom'
import { FLOW_SAMPLE_2 } from '~/constants/flowSamples'
import { atomUserData } from '~/jotai/jotai'
import { db } from '~/lib/firebase'
import { AUTH_TOKEN, CORE_API_URL } from '../../constants'
import { Edges, NodeContent, Nodes, jotaiAllowInteraction, nodeContents } from './nodes/Registry'
import { dataIndexerDefaultContent } from './nodes/DataIndexer'
import { dataRetrieverDefaultContent } from './nodes/DataRetriever'
import { v4 } from 'uuid'
import { BiSave } from 'react-icons/bi'

import { DataExtractorNode, DataExtractorNodeContent } from './nodes/DataExtractorNode'
import { DataSourceNode, DataSourceNodeContent } from './nodes/DataSourceNode'
import { EvaluatorNode, EvaluatorNodeContent } from './nodes/EvaluatorNode'
import { LLMProcessorNode, LLMProcessorNodeContent } from './nodes/LLMProcessorNode'
import { Edge, type Node } from 'reactflow'
import { DataIndexerNode, DataIndexerNodeContent } from './nodes/DataIndexer'
import { DataRetrieverNode, DataRetrieverNodeContent } from './nodes/DataRetriever'
import {
  DataSourceLocalFilesNode,
  DataSourceLocalFilesNodeContent,
} from './nodes/DataSourceLocalFiles'
import { DataExporterFlairNode, DataExporterFlairNodeContent } from './nodes/DataExporterFlair'
import { DataSourceS3Node } from './nodes/DataSourceS3'
import { DataSourceGCPNode } from './nodes/DataSourceGCP'
import { DataSourceAPINode } from './nodes/DataSourceAPI'
import { DataSourceAzureNode } from './nodes/DataSourceAzure'
import { DataExporterS3Node } from './nodes/DataExporterS3'
import { DataExporterGCPNode } from './nodes/DataExporterGCP'
import { DataExporterAzureNode } from './nodes/DataExporterAzure'
import { DataExporterAPINode } from './nodes/DataExporterAPI'
import { DataExporterPowerBINode } from './nodes/DataExporterPowerBI'
import { ImCheckmark2, ImSpinner9, ImWarning } from 'react-icons/im'
import { DataExporterSalesforceNode } from './nodes/DataExporterSalesforce'
import { DataExporterZendeskNode } from './nodes/DataExporterZendesk'
import { DataExporterGmailNode } from './nodes/DataExporterGmail'
import { DataRetrieverApiNode } from './nodes/DataRetrieverAPI'
import { ConditionalLogicNode } from './nodes/ConditionalLogicNode'
import { DataExtractorAggregatorNode } from './nodes/DataExtractorAggregatorNode'
import ExecuteModal from './overlays/ExecuteModal'
import JSONImporterModal from './overlays/JSONImporterModal'
import JSONConfigModal from './overlays/JSONConfigModal'
import DeploymentToast from './overlays/DeploymentToast'

export const nodeTypes = {
  DataSourceNode,
  DataSourceS3Node,
  DataSourceGCPNode,
  DataSourceAPINode,
  DataSourceAzureNode,
  DataExtractorNode,
  DataExporterS3Node,
  DataExporterGCPNode,
  DataExporterAzureNode,
  DataExporterAPINode,
  DataExporterPowerBINode,
  EvaluatorNode,
  LLMProcessorNode,
  DataIndexerNode,
  DataRetrieverNode,
  DataSourceLocalFilesNode,
  DataExporterFlairNode,
  DataExporterSalesforceNode,
  DataExporterZendeskNode,
  DataExporterGmailNode,
  DataRetrieverApiNode,
  ConditionalLogicNode,
  DataExtractorAggregatorNode,
}

const classificationColor2colorClasses = (classificationColor: string): string => {
  let colorClasses = ''
  switch (classificationColor) {
    case 'purple':
      colorClasses = ' bg-purple-200 hover:bg-purple-300 '
      break
    case 'green':
      colorClasses = ' bg-green-200 hover:bg-green-300 '
      break
    case 'orange':
      colorClasses = ' bg-orange-200 hover:bg-orange-300 '
      break
    case 'blue':
      colorClasses = ' bg-blue-200 hover:bg-blue-300 '
      break
    case 'teal':
      colorClasses = ' bg-teal-200 hover:bg-teal-300 '
      break
    case 'rose':
      colorClasses = ' bg-rose-200 hover:bg-rose-300 '
      break
    case 'pink':
      colorClasses = ' bg-pink-200 hover:bg-pink-300 '
      break
    default:
      colorClasses = ' bg-green-200 hover:bg-green-300 '
      break
  }
  return colorClasses
}

const randPos = (viewport: { x: number; y: number; zoom: number }) => {
  console.log(viewport)
  const minValue = 20
  const maxValue = 40

  const randomX = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
  const randomY = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue

  return {
    x: -viewport.x * (1 / viewport.zoom) + randomX,
    y: -viewport.y * (1 / viewport.zoom) + randomY,
  }
}

export const nodesAtom = atom<Nodes>([])
export const edgesAtom = atom<Edges>([])

export const FlowEditor: React.FC<{
  viewerOnly?: boolean
  initialNodes?: Nodes
  initialEdges?: Edges
  initialTitle?: string
}> = ({ viewerOnly }) => {
  const userData = useAtomValue(atomUserData)

  const [nodes, setNodes] = useAtom(nodesAtom)
  const [edges, setEdges] = useAtom(edgesAtom)
  const [title, setTitle] = useState<string>('')

  const navigate = useNavigate()
  const { state } = useLocation()
  const { workflowId } = state || {} // Read values passed on state

  // Load initial
  useEffect(() => {
    ;(async () => {
      if (typeof workflowId !== 'string') {
        return
      }

      const snap = await db.collection('workflows').doc(workflowId).get()
      const data = snap.data() as DocWorkflow
      setTitle(data.workflowTitle)

      const { nodes: newNodes, edges: newEdges } = JSON.parse(data.frontendConfig)
      setNodes(newNodes)
      setEdges(newEdges)
    })()
  }, [workflowId, setEdges, setNodes])

  // const [rflow, setRflow] = useState<ReactFlowInstance>()

  // const onInit = useCallback((reactflowInstance: ReactFlowInstance) => {
  //   console.log('rflow', rflow, reactflowInstance)
  //   setRflow(reactflowInstance);
  //   console.log('rflow', rflow)
  // }, [rflow])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(nds => applyNodeChanges(changes, nds))
    },
    [setNodes],
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      console.log(changes)
      setEdges(eds => applyEdgeChanges(changes, eds))
    },
    [setEdges],
  )

  // const connectablesMap: Record<string, string[]> = {
  //   // TODO: Add "NodeType:handle"
  //   'SourceNode:out': [
  //     'DataExtractionNode:in',
  //   ],
  //   'DataExtractionNode:out': [
  //     'MergerNode:in-data',
  //     'MergerNode:in-context',
  //     'MergerNode:in-input',

  //     'PublishAPINode:in',
  //     'AWSUploaderNode:in',
  //   ],
  //   'MergerNode:out': [
  //     'PublishAPINode:in',
  //     'WebhookNode:in',
  //     'AWSUploaderNode:in',
  //   ],
  // }

  const onConnect = useCallback(
    (connection: Connection) => {
      console.log('connection', connection)
      const sourceNode = nodes.find(n => n.id === connection.source)
      const targetNode = nodes.find(n => n.id === connection.target)
      const lookupSourceKey = `${sourceNode?.type ?? ''}:${connection.sourceHandle ?? ''}`
      const lookupTargetKey = `${targetNode?.type ?? ''}:${connection.targetHandle ?? ''}`
      console.log(lookupSourceKey, lookupTargetKey)

      // TODO: restrict connections based on node type
      // if (lookupSourceKey in connectablesMap && connectablesMap[lookupSourceKey].includes(lookupTargetKey)) {
      //   setEdges((eds) => addEdge(connection, eds))
      // }

      // But for now, allow all connections
      setEdges(eds => addEdge(connection, eds))
    },
    [nodes, setEdges],
  )

  // useref of { x, y}
  const viewport = useRef({ x: 0, y: 0, zoom: 1 })

  const [isJsonModalShown, setIsJsonModalShown] = useState(false)
  const [jsonConfig, setJsonConfig] = useState('')

  const [isJsonImportModalShown, setIsJsonImportModalShown] = useState(false)
  const [jsonConfigImport, setJsonConfigImport] = useState('')

  const getFrontendConfig = () => {
    const obj = { nodes, edges }

    nodes.forEach(el => {
      el.data.initialContents = nodeContents.current[el.id]
    })

    return obj
  }

  const saveFlow = async () => {
    if (typeof workflowId !== 'string') {
      return
    }

    const obj = getFrontendConfig()

    const docUpdate: Partial<DocWorkflow> = {
      lastSaveTimestamp: serverTimestamp() as Timestamp,
      frontendConfig: JSON.stringify(obj),
    }
    await db.collection('workflows').doc(workflowId).update(docUpdate)

    return obj
  }

  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<['success' | 'error', string]>()

  async function executeFlow() {
    if (!userData?.userId) {
      return
    }

    if (typeof workflowId !== 'string') {
      return
    }
    try {
      setIsDeploying(true)
      const flowData = await saveFlow()
      const ref = db.collection('workflow_requests').doc()
      const newWorkflowRequest: DocWorkflowRequest = {
        createdTimestamp: serverTimestamp() as Timestamp,
        requestTimestamp: serverTimestamp() as Timestamp,
        updatedTimestamp: serverTimestamp() as Timestamp,
        executorUserId: userData.userId,
        docExists: true,
        workflowId,
        frontendConfig: JSON.stringify(flowData),
        workflowRequestId: ref.id,
        generatedConfig: '',
        status: 'requested',
      }
      await ref.set(newWorkflowRequest)
      console.log('workflow_request_id = ' + ref.id)
      const URL = `${CORE_API_URL}/api/flair-studio/flair-chain-runner`
      await axios.post(
        URL,
        { workflow_request_id: ref.id },
        { headers: { Authorization: AUTH_TOKEN } },
      )
      setDeploymentStatus(['success', 'Your workflow has been deployed!'])
    } catch (error) {
      console.log(error)
      setDeploymentStatus(['error', 'Sorry, something went wrong.'])
    } finally {
      setIsDeploying(false)
      setTimeout(() => {
        setDeploymentStatus(undefined)
      }, 3000)
    }
  }

  const addNode = (
    nodeTypeDash: NodeContent['nodeType'],
    nodeTypePascal: keyof typeof nodeTypes,
  ) => {
    setNodes(prev => {
      const nodeId = nodeTypeDash + '-' + v4()

      return [
        ...prev,
        {
          id: nodeId,
          type: nodeTypePascal,
          data: { nodeId, initialContents: { nodeType: 'init' } },
          position: randPos(viewport.current),
        },
      ]
    })
  }

  const executeModalRef: LegacyRef<HTMLDialogElement> = useRef(null)

  const allowInteraction = useAtomValue(jotaiAllowInteraction)

  const ReactFlowComp = (
    <ReactFlow
      elementsSelectable={allowInteraction}
      nodesConnectable={allowInteraction}
      nodesDraggable={allowInteraction}
      zoomOnScroll={allowInteraction}
      panOnScroll={allowInteraction}
      zoomOnDoubleClick={allowInteraction}
      panOnDrag={allowInteraction}
      selectionOnDrag={allowInteraction}
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      selectionMode={SelectionMode.Partial}
      onMove={(_, newViewport) => {
        viewport.current = newViewport
      }}>
      <Background />
      <Controls position="bottom-right" />
    </ReactFlow>
  )

  const nodeClassifications = [
    {
      title: 'Data Source',
      subtitle: 'Origin of raw datasets.',
      color: 'purple',
      members: [
        {
          title: 'AWS S3',
          handleOnClick: () => {
            addNode('data-source-s3', 'DataSourceS3Node')
          },
        },
        {
          title: 'Google Cloud Storage',
          handleOnClick: () => {
            addNode('data-source-gcp', 'DataSourceGCPNode')
          },
        },
        {
          title: 'Azure Blob Storage',
          handleOnClick: () => {
            addNode('data-source-azure', 'DataSourceAzureNode')
          },
        },
        {
          title: 'Local Files',
          handleOnClick: () => {
            addNode('data-source-local-files', 'DataSourceLocalFilesNode')
          },
        },
        {
          title: 'API',
          handleOnClick: () => {
            addNode('data-source-api', 'DataSourceAPINode')
          },
        },
        {
          title: 'Salesforce',
          handleOnClick: () => {},
          disabled: true,
        },
        {
          title: 'Zendesk',
          handleOnClick: () => {},
          disabled: true,
        },
        {
          title: 'Slack',
          handleOnClick: () => {},
          disabled: true,
        },
      ],
    },
    {
      title: 'Data Indexer',
      subtitle: 'Organizes and categorizes data for quick retrieval.',
      color: 'green',
      members: [
        {
          title: 'Data Indexer',
          handleOnClick: () => {
            addNode('data-indexer', 'DataIndexerNode')
          },
        },
      ],
    },
    {
      title: 'Data Retriever',
      subtitle: 'Fetches specific data subsets from the source or index.',
      color: 'orange',
      members: [
        {
          title: 'Data Retriever',
          handleOnClick: () => {
            addNode('data-retriever', 'DataRetrieverNode')
          },
        },
        {
          title: 'Data Retriever API',
          handleOnClick: () => {
            addNode('data-retriever-api', 'DataRetrieverApiNode')
          },
        },
      ],
    },
    {
      title: 'Data Extractor',
      subtitle: 'Extracts or transforms specific data elements..',
      color: 'blue',
      members: [
        {
          title: 'LLM Processor',
          handleOnClick: () => {
            addNode('llm-processor', 'LLMProcessorNode')
          },
        },
        {
          title: 'Aggregator',
          handleOnClick: () => {
            addNode('data-extractor-aggregator', 'DataExtractorAggregatorNode')
          },
        },
      ],
    },
    {
      title: 'Data Exporter',
      subtitle: 'Sends processed data to specified destinations.',
      color: 'teal',
      members: [
        {
          title: 'AWS S3',
          handleOnClick: () => {
            addNode('data-exporter-s3', 'DataExporterS3Node')
          },
        },
        {
          title: 'Google Cloud Storage',
          handleOnClick: () => {
            addNode('data-exporter-gcp', 'DataExporterGCPNode')
          },
        },
        {
          title: 'Azure Blob Storage',
          handleOnClick: () => {
            addNode('data-exporter-azure', 'DataExporterAzureNode')
          },
        },
        {
          title: 'Zendesk',
          handleOnClick: () => {
            addNode('data-exporter-zendesk', 'DataExporterZendeskNode')
          },
        },
        {
          title: 'Gmail',
          handleOnClick: () => {
            addNode('data-exporter-gmail', 'DataExporterGmailNode')
          },
        },
        {
          title: 'Salesforce',
          handleOnClick: () => {
            addNode('data-exporter-salesforce', 'DataExporterSalesforceNode')
          },
        },
        {
          title: 'Power BI',
          handleOnClick: () => {
            addNode('data-exporter-power-bi', 'DataExporterPowerBINode')
          },
        },
        {
          title: 'Flair',
          handleOnClick: () => {
            addNode('data-exporter-flair', 'DataExporterFlairNode')
          },
        },
        {
          title: 'API',
          handleOnClick: () => {
            addNode('data-exporter-api', 'DataExporterAPINode')
          },
        },
      ],
    },
    {
      title: 'Router',
      subtitle: 'Control flow and logical branching.',
      color: 'rose',
      members: [
        {
          title: 'Conditional Logic',
          handleOnClick: () => {
            addNode('conditional-logic', 'ConditionalLogicNode')
          },
        },
      ],
    },
    {
      title: 'Evaluation',
      subtitle: 'Assesses data quality and accuracy.',
      color: 'pink',
      members: [
        {
          title: 'Evaluator',
          handleOnClick: () => {
            addNode('evaluator', 'EvaluatorNode')
          },
        },
      ],
    },
  ]

  return viewerOnly ? (
    ReactFlowComp
  ) : (
    <>
      <main className="h-[calc(100vh-4rem)]">
        <header className="border-grayscaleDivider mx-3 flex h-[3rem] border-b">
          <button className="btn btn-primary m-1 h-[2.5rem] min-h-[2.5rem]" onClick={saveFlow}>
            Save
          </button>
          <button
            className="btn m-1 h-[2.5rem] min-h-[2.5rem]"
            onClick={() => {
              setNodes([])
              setEdges([])
            }}>
            Clear
          </button>
          <button
            className="btn m-1 h-[2.5rem] min-h-[2.5rem]"
            onClick={() => {
              const { nodes: newNodes, edges: newEdges } = JSON.parse(FLOW_SAMPLE_2)

              setNodes(newNodes)
              setEdges(newEdges)
            }}>
            Sample
          </button>
          <div className="relative my-1 h-[2.5rem] grow px-4">
            <input
              type="text"
              placeholder="Workflow Title"
              value={title}
              onChange={event => {
                setTitle(event.target.value)
              }}
              className="input input-ghost h-full w-full"
            />
            <button
              className="btn btn-circle btn-sm absolute right-6 top-1"
              onClick={async () => {
                if (typeof workflowId !== 'string') {
                  return
                }

                const docUpdate: Partial<DocWorkflow> = {
                  lastSaveTimestamp: serverTimestamp() as Timestamp,
                  workflowTitle: title,
                }
                await db.collection('workflows').doc(workflowId).update(docUpdate)
              }}>
              <BiSave />
            </button>
          </div>

          <button
            className="btn m-1 h-[2.5rem] min-h-[2.5rem]"
            onClick={async () => {
              // await executeFlow()
              executeModalRef.current?.showModal()
            }}>
            Deploy
          </button>
          <button
            className="btn m-1 h-[2.5rem] min-h-[2.5rem]"
            onClick={async () => {
              setJsonConfig(JSON.stringify(getFrontendConfig(), null, 2))
              setIsJsonModalShown(true)
            }}>
            Show Config
          </button>
        </header>
        <section className="flex h-[calc(100vh-4rem-3rem)]">
          <aside
            style={{ width: 400 }}
            className="border-r-grayscaleDivider flex flex-col overflow-y-auto border-r p-3">
            {/* Data Connectors */}
            <div className="join join-vertical my-3 w-full">
              {nodeClassifications.map(classification => {
                const colorClasses = classificationColor2colorClasses(classification.color)
                return (
                  <div
                    key={classification.title}
                    className={'collapse-arrow collapse' + ' join-item border border-base-300'}>
                    <input type="radio" name="my-accordion-4" />
                    <div className="collapse-title text-xl font-medium">
                      {classification.title} <br />
                      <div className="mt-1 text-sm font-normal text-gray-500">
                        {classification.subtitle}
                      </div>
                    </div>
                    <div className="collapse-content">
                      {classification.members.map(member => {
                        return (
                          <button
                            key={member.title}
                            disabled={member.disabled}
                            className={
                              'btn m-2' + (member.disabled ? ' gap-1 btn-disabled ' : colorClasses)
                            }
                            onClick={member.handleOnClick}>
                            <p>{member.title}</p>
                            {member.disabled && <div className="text-xs">(soon)</div>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </aside>
          <div className="flex-1">{ReactFlowComp}</div>
        </section>
      </main>

      <ExecuteModal executeFlow={executeFlow} isDeploying={isDeploying} ref={executeModalRef} />
      <JSONImporterModal
        isJsonImportModalShown={isJsonImportModalShown}
        setIsJsonImportModalShown={setIsJsonImportModalShown}
        jsonConfigImport={jsonConfigImport}
        setJsonConfigImport={setJsonConfigImport}
      />
      <JSONConfigModal
        isJsonModalShown={isJsonModalShown}
        setIsJsonModalShown={setIsJsonModalShown}
        jsonConfig={jsonConfig}
      />
      <DeploymentToast deploymentStatus={deploymentStatus} />
    </>
  )
}

const sample1 = `
{
  "nodes": [
    {
      "id": "input-001",
      "type": "InputNode",
      "data": {
        "nodeId": "input-001",
        "initialContents": {
          "keyValPairs": {
            "x": "hello",
            "y": "world"
          }
        }
      },
      "position": {
        "x": 0,
        "y": 200
      },
      "width": 400,
      "height": 196
    },
    {
      "id": "prompt-template-002",
      "type": "PromptTemplateNode",
      "data": {
        "nodeId": "prompt-template-002",
        "initialContents": {
          "promptTemplate": "Check {x} in {y}"
        }
      },
      "position": {
        "x": 500,
        "y": 200
      },
      "width": 400,
      "height": 280
    },
    {
      "id": "model-003",
      "type": "ModelNode",
      "data": {
        "nodeId": "model-003",
        "initialContents": {
          "model": "gpt-4",
          "temperature": "1"
        }
      },
      "position": {
        "x": 1000,
        "y": 200
      },
      "width": 400,
      "height": 222
    },
    {
      "id": "output-004",
      "type": "OutputNode",
      "data": {
        "nodeId": "output-004",
        "initialContents": {}
      },
      "position": {
        "x": 1500,
        "y": 200
      },
      "width": 400,
      "height": 74
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "input-001",
      "target": "prompt-template-002",
      "sourceHandle": "outbound",
      "targetHandle": "inbound"
    },
    {
      "id": "edge-2",
      "source": "prompt-template-002",
      "target": "model-003",
      "sourceHandle": "outbound",
      "targetHandle": "inbound"
    },
    {
      "id": "edge-3",
      "source": "model-003",
      "target": "output-004",
      "sourceHandle": "outbound",
      "targetHandle": "inbound"
    }
  ]
}
`

export default FlowEditor
