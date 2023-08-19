import { Dialog } from '@headlessui/react'
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
import { atom, useAtomValue } from 'jotai'
import { CodeBlock } from 'react-code-blocks'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom'
import { FLOW_SAMPLE_2 } from '~/constants/flowSamples'
import { atomUserData } from '~/jotai/jotai'
import { db } from '~/lib/firebase'
import { AUTH_TOKEN, CORE_API_URL } from '../../constants'
import Modal from '../ui/modal'
import { Edges, NodeContent, Nodes, jotaiAllowInteraction, nodeContents } from './nodes/Registry'
import { dataIndexerDefaultContent } from './nodes/DataIndexer'
import { dataRetrieverDefaultContent } from './nodes/DataRetriever'
import { v4 } from 'uuid'

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
import { ImCheckmark2, ImSpinner9, ImWarning } from 'react-icons/im'
import { DataExporterSalesforceNode } from './nodes/DataExporterSalesforce'
import { DataExporterZendeskNode } from './nodes/DataExporterZendesk'
import { DataExporterGmailNode } from './nodes/DataExporterGmail'

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
  EvaluatorNode,
  LLMProcessorNode,
  DataIndexerNode,
  DataRetrieverNode,
  DataSourceLocalFilesNode,
  DataExporterFlairNode,
  DataExporterSalesforceNode,
  DataExporterZendeskNode,
  DataExporterGmailNode,
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

export const FlowEditor: React.FC<{
  viewerOnly?: boolean
  initialNodes?: Nodes
  initialEdges?: Edges
}> = ({ viewerOnly, initialNodes, initialEdges }) => {
  const userData = useAtomValue(atomUserData)

  const [nodes, setNodes] = useState<Nodes>(initialNodes || [])
  const [edges, setEdges] = useState<Edges>(initialEdges || [])

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

      const { nodes: newNodes, edges: newEdges } = JSON.parse(data.frontendConfig)

      setNodes(newNodes)
      setEdges(newEdges)
    })()
  }, [workflowId])

  // const [rflow, setRflow] = useState<ReactFlowInstance>()

  // const onInit = useCallback((reactflowInstance: ReactFlowInstance) => {
  //   console.log('rflow', rflow, reactflowInstance)
  //   setRflow(reactflowInstance);
  //   console.log('rflow', rflow)
  // }, [rflow])

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(nds => applyNodeChanges(changes, nds))
  }, [])
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    console.log(changes)
    setEdges(eds => applyEdgeChanges(changes, eds))
  }, [])

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
    [nodes],
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
      // onInit={onInit}
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      // panOnScroll
      // selectionOnDrag
      selectionMode={SelectionMode.Partial}
      onMove={(_, newViewport) => {
        viewport.current = newViewport
      }}>
      <Background />
      <Controls />
    </ReactFlow>
  )

  if (viewerOnly) {
    return ReactFlowComp
  }

  return (
    <>
      <div className="h-[calc(100vh-4rem)]">
        <div className="border-grayscaleDivider flex h-[3rem] border-b">
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
          <div className="flex-1" />

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
        </div>
        <div className="flex h-[calc(100vh-4rem-3rem)]">
          <div
            style={{ width: 400 }}
            className="border-r-grayscaleDivider flex flex-col overflow-y-auto border-r p-3">
            {/* Data Connectors */}
            <div className="mb-3">
              <div className="my-2" />
              <div className="join join-vertical w-full">
                <div className="collapse-arrow collapse join-item border border-base-300">
                  <input type="radio" name="my-accordion-4" />
                  <div className="collapse-title text-xl font-medium">
                    Data Source
                    <br />
                    <div className="mt-1 text-sm font-normal text-gray-500">
                      Origin of raw datasets.
                    </div>
                  </div>
                  <div className="collapse-content">
                    <button
                      className="btn m-2 bg-purple-200 hover:bg-purple-300"
                      onClick={() => {
                        addNode('data-source-s3', 'DataSourceS3Node')
                      }}>
                      AWS S3
                    </button>
                    <button
                      className="btn m-2 bg-purple-200 hover:bg-purple-300"
                      onClick={() => {
                        addNode('data-source-gcp', 'DataSourceGCPNode')
                      }}>
                      Google Cloud Storage
                    </button>
                    <button
                      className="btn m-2 bg-purple-200 hover:bg-purple-300"
                      onClick={() => {
                        addNode('data-source-azure', 'DataSourceAzureNode')
                      }}>
                      Azure Blob Storage
                    </button>
                    <button
                      className="btn m-2 bg-purple-200 hover:bg-purple-300"
                      onClick={() => {
                        addNode('data-source-local-files', 'DataSourceLocalFilesNode')
                      }}>
                      Local Files
                    </button>
                    <button
                      className="btn m-2 bg-purple-200 hover:bg-purple-300"
                      onClick={() => {
                        addNode('data-source-api', 'DataSourceAPINode')
                      }}>
                      API
                    </button>
                    <button className="btn btn-disabled m-2 gap-1" onClick={() => {}} disabled>
                      <div>Salesforce</div>
                      <div className="text-xs">(soon)</div>
                    </button>
                    <button className="btn btn-disabled m-2 gap-1" onClick={() => {}} disabled>
                      <div>Zendesk</div>
                      <div className="text-xs">(soon)</div>
                    </button>
                    <button className="btn btn-disabled m-2 gap-1" onClick={() => {}} disabled>
                      <div>Slack</div>
                      <div className="text-xs">(soon)</div>
                    </button>
                  </div>
                </div>
                <div className="collapse-arrow collapse join-item border border-base-300">
                  <input type="radio" name="my-accordion-4" />
                  <div className="collapse-title text-xl font-medium">
                    Data Indexer <br />
                    <div className="mt-1 text-sm font-normal text-gray-500">
                      Organizes and categorizes data for quick retrieval.
                    </div>
                  </div>
                  <div className="collapse-content">
                    <button
                      className="btn m-2 bg-green-200 hover:bg-green-300"
                      onClick={() => {
                        setNodes(prev => {
                          const nodeId = 'data-indexer-' + String(Date.now())
                          return [
                            ...prev,
                            {
                              id: nodeId,
                              type: 'DataIndexerNode',
                              data: { nodeId, initialContents: dataIndexerDefaultContent },
                              position: randPos(viewport.current),
                            },
                          ]
                        })
                      }}>
                      Data Indexer
                    </button>
                  </div>
                </div>
                <div className="collapse-arrow collapse join-item border border-base-300">
                  <input type="radio" name="my-accordion-4" />
                  <div className="collapse-title text-xl font-medium">
                    Data Retriever <br />
                    <div className="mt-1 text-sm font-normal text-gray-500">
                      Fetches specific data subsets from the source or index.
                    </div>
                  </div>
                  <div className="collapse-content">
                    <button
                      className="btn m-2 bg-orange-200 hover:bg-orange-300"
                      onClick={() => {
                        setNodes(prev => {
                          const nodeId = 'data-retriever-' + String(Date.now())
                          return [
                            ...prev,
                            {
                              id: nodeId,
                              type: 'DataRetrieverNode',
                              data: { nodeId, initialContents: dataRetrieverDefaultContent },
                              position: randPos(viewport.current),
                            },
                          ]
                        })
                      }}>
                      Data Retriever
                    </button>
                  </div>
                </div>
                <div className="collapse-arrow collapse join-item border border-base-300">
                  <input type="radio" name="my-accordion-4" />
                  <div className="collapse-title text-xl font-medium">
                    Data Extractor <br />
                    <div className="mt-1 text-sm font-normal text-gray-500">
                      Extracts or transforms specific data elements.
                    </div>
                  </div>
                  <div className="collapse-content">
                    <button
                      className="btn m-2 hidden"
                      onClick={() => {
                        setNodes(prev => {
                          const nodeId = 'data-extractor-' + String(Date.now())
                          return [
                            ...prev,
                            {
                              id: nodeId,
                              type: 'DataExtractorNode',
                              data: { nodeId, initialContents: { nodeType: 'init' } },
                              position: randPos(viewport.current),
                            },
                          ]
                        })
                      }}>
                      Data Extractor
                    </button>
                    <button
                      className="btn m-2 bg-blue-200 hover:bg-blue-300"
                      onClick={() => {
                        setNodes(prev => {
                          const nodeId = 'llm-processor-' + String(Date.now())
                          return [
                            ...prev,
                            {
                              id: nodeId,
                              type: 'LLMProcessorNode',
                              data: { nodeId, initialContents: { nodeType: 'init' } },
                              position: randPos(viewport.current),
                            },
                          ]
                        })
                      }}>
                      LLM Processor
                    </button>
                  </div>
                </div>
                <div className="collapse-arrow collapse join-item border border-base-300">
                  <input type="radio" name="my-accordion-4" />
                  <div className="collapse-title text-xl font-medium">
                    Data Exporter <br />
                    <div className="mt-1 text-sm font-normal text-gray-500">
                      Sends processed data to specified destinations.
                    </div>
                  </div>
                  <div className="collapse-content">
                    <button
                      className="btn m-2 bg-teal-200 hover:bg-teal-300"
                      onClick={() => {
                        addNode('data-exporter-s3', 'DataExporterS3Node')
                        // setNodes(prev => {
                        //   const nodeId = 'aws-uploader-' + String(Date.now())
                        //   return [
                        //     ...prev,
                        //     {
                        //       id: nodeId,
                        //       type: 'AwsUploaderNode',
                        //       data: { nodeId, initialContents: { nodeType: 'init' } },
                        //       position: randPos(viewport.current),
                        //     },
                        //   ]
                        // })
                      }}>
                      AWS S3
                    </button>
                    <button
                      className="btn m-2 bg-teal-200 hover:bg-teal-300"
                      onClick={() => {
                        addNode('data-exporter-gcp', 'DataExporterGCPNode')
                      }}>
                      Google Cloud Storage
                    </button>
                    <button
                      className="btn m-2 bg-teal-200 hover:bg-teal-300"
                      onClick={() => {
                        addNode('data-exporter-azure', 'DataExporterAzureNode')
                      }}>
                      Azure Blob Storage
                    </button>
                    <button
                      className="btn m-2 bg-teal-200 hover:bg-teal-300"
                      onClick={() => {
                        addNode('data-exporter-zendesk', 'DataExporterZendeskNode')
                      }}>
                      Zendesk
                    </button>
                    <button
                      className="btn m-2 bg-teal-200 hover:bg-teal-300"
                      onClick={() => {
                        addNode('data-exporter-gmail', 'DataExporterGmailNode')
                      }}>
                      Gmail
                    </button>
                    <button
                      className="btn m-2 bg-teal-200 hover:bg-teal-300"
                      onClick={() => {
                        addNode('data-exporter-salesforce', 'DataExporterSalesforceNode')
                      }}>
                      Salesforce
                    </button>
                    <button
                      className="btn m-2 bg-teal-200 hover:bg-teal-300"
                      onClick={() => {
                        addNode('data-exporter-flair', 'DataExporterFlairNode')
                      }}>
                      Flair
                    </button>
                    <button
                      className="btn m-2 bg-teal-200 hover:bg-teal-300"
                      onClick={() => {
                        addNode('data-exporter-api', 'DataExporterAPINode')
                      }}>
                      API
                    </button>
                  </div>
                </div>
                <div className="collapse-arrow collapse join-item border border-base-300">
                  <input type="radio" name="my-accordion-4" />
                  <div className="collapse-title text-xl font-medium">
                    Evaluation <br />
                    <div className="mt-1 text-sm font-normal text-gray-500">
                      Assesses data quality and accuracy.
                    </div>
                  </div>
                  <div className="collapse-content">
                    <button
                      className="btn m-2 bg-pink-200 hover:bg-pink-300"
                      onClick={() => {
                        setNodes(prev => {
                          const nodeId = 'evaluator-' + String(Date.now())
                          return [
                            ...prev,
                            {
                              id: nodeId,
                              type: 'EvaluatorNode',
                              data: { nodeId, initialContents: { nodeType: 'init' } },
                              position: randPos(viewport.current),
                            },
                          ]
                        })
                      }}>
                      Evaluator
                    </button>
                  </div>
                </div>
                {/* <div className="collapse-arrow collapse join-item border border-base-300">
                  <input type="radio" name="my-accordion-4" />
                  <div className="collapse-title text-xl font-medium">Custom Fine-Tuning</div>
                  <div className="collapse-content">
                    <button
                      className="btn m-2 bg-yellow-200 hover:bg-yellow-300"
                      onClick={() => {}}>
                      Fine-Tuning
                    </button>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="flex-1" />
          </div>
          <div className="flex-1">{ReactFlowComp}</div>
        </div>
      </div>

      {/* Execute modal */}
      <dialog ref={executeModalRef} className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="mb-5 text-center text-lg font-bold">Deployment Options</h3>
          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
          <div className="mb-2 mt-1">
            <label className="label">
              <span className="label-text">Frequency</span>
            </label>
            <select className="max-w-xs select mb-3 w-full border-black">
              <option value={'one-time'}>One time</option>
              <option value={'1d'}>1d</option>
              <option value={'7d'}>7d</option>
              <option value={'30d'}>30d</option>
            </select>
            <button
              className="btn btn-primary mx-auto block w-36"
              onClick={async event => {
                event.preventDefault()
                await executeFlow()
                executeModalRef.current?.close()
              }}>
              {isDeploying ? (
                <ImSpinner9 className="animate mx-auto h-5 w-5 animate-spin" />
              ) : (
                'Deploy'
              )}
            </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* JSON Importer */}
      <Modal
        isOpen={isJsonImportModalShown}
        onClose={() => {
          setIsJsonImportModalShown(false)
        }}>
        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
          Import JSON Configuration File
        </Dialog.Title>

        <div>
          {/* <Form.Control
            as="textarea"
            rows={8}
            value={jsonConfigImport}
            onChange={e => {
              const text = e.target.value
              setJsonConfigImport(text)
            }}
            style={{ borderColor: 'black' }}
          /> */}
        </div>

        <div className="mt-4 flex">
          <button
            type="button"
            className="t-border inline-flex justify-center rounded-md border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
            onClick={() => {
              setJsonConfigImport('')
              setIsJsonImportModalShown(false)
            }}>
            Close
          </button>
          <div className="flex-1" />
          <button
            type="button"
            className="t-border mr-1 inline-flex justify-center rounded-md border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
            onClick={() => {
              const { nodes: newNodes, edges: newEdges } = JSON.parse(jsonConfigImport)

              setNodes(newNodes)
              setEdges(newEdges)

              setJsonConfigImport('')
              setIsJsonImportModalShown(false)
            }}>
            Import
          </button>
        </div>
      </Modal>

      {/* Show JSON Config */}
      <Modal
        isOpen={isJsonModalShown}
        onClose={() => {
          setIsJsonModalShown(false)
        }}>
        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
          JSON Configuration File
        </Dialog.Title>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Here is the config file based on the current flow.
          </p>
        </div>
        <div className="t-border mt-2 h-96 overflow-y-auto font-mono">
          <CodeBlock text={jsonConfig} language="json" showLineNumbers={true} wrapLines />
        </div>

        <div className="mt-4 flex">
          <button
            type="button"
            className="t-border inline-flex justify-center rounded-md border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
            onClick={() => {
              setIsJsonModalShown(false)
            }}>
            Close
          </button>
          <div className="flex-1" />
        </div>
      </Modal>

      {/* Toast -> User Interaction Feedback */}
      {deploymentStatus && (
        <div className="toast">
          <div
            className={`alert ${
              deploymentStatus[0] === 'success' ? 'alert-success' : 'alert-error'
            }`}>
            {deploymentStatus[0] === 'success' ? (
              <ImCheckmark2 className="h-6 w-6" />
            ) : (
              <ImWarning className="h-6 w-6" />
            )}
            <span>{deploymentStatus[1]}</span>
          </div>
        </div>
      )}
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
