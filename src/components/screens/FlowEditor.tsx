import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  Fragment,
  type MutableRefObject,
} from 'react'
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
  Handle,
  Position,
  SelectionMode,
  type XYPosition,
} from 'reactflow'
import axios from 'axios'
import { GrFormClose } from 'react-icons/gr'
import { IoIosCloudDone } from 'react-icons/io'
import { Dialog, Transition } from '@headlessui/react'

import 'reactflow/dist/style.css'
// import '@manifoldco/react-select-zero/assets/react-select-zero.css'
// import './style/override.css'
import { CodeBlock, nord } from 'react-code-blocks'
import Modal from '../ui/modal'
import { GridLoader } from 'react-spinners'
import { DataSourceNode, type DataSourceNodeContent } from './nodes/DataSourceNode'
import { DataExtractorNode, type DataExtractorNodeContent } from './nodes/DataExtractorNode'
import { AwsUploaderNode, type AwsUploaderNodeContent } from './nodes/AwsUploaderNode'
import { EvaluatorNode, type EvaluatorNodeContent } from './nodes/EvaluatorNode'
import { db } from '~/lib/firebase'
import { useLocation } from 'react-router-dom'
import { DocFlowData } from 'Types/firebaseStructure'
import { Timestamp, serverTimestamp } from 'firebase/firestore'

const nodeTypes = {
  DataSourceNode,
  DataExtractorNode,
  AwsUploaderNode,
  EvaluatorNode,
}

export type NodeContent =
  | {}
  | DataSourceNodeContent
  | DataExtractorNodeContent
  | AwsUploaderNodeContent
  | EvaluatorNodeContent

export const nodeContents: MutableRefObject<{ [nodeId: string]: NodeContent }> = {
  current: {},
}

export interface NodeData {
  nodeId: string
  initialContents: NodeContent
}

export const initialNodes: Array<Node<NodeData>> = []
export const initialEdges: Edge[] = []

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

// export type FlowJsonFormat = Array<{
//   nodeId: string
//   nodeType: string | undefined
//   pos: XYPosition
//   inboundEdges: string[]
//   outboundEdges: string[]
//   contents: NodeContent
// }>

// const nodesToJson = (nodes: typeof initialNodes, edges: typeof initialEdges) => {
//   console.log('nodes', nodes)
//   console.log('edges', edges)

//   const res: FlowJsonFormat = []

//   nodes.forEach(el => {
//     res.push({
//       nodeId: el.id,
//       nodeType: el.type,
//       pos: el.position,
//       inboundEdges: [],
//       outboundEdges: [],
//       contents: nodeContents.current[el.id],
//     })
//   })

//   edges.forEach(edge => {
//     const {
//       source: sourceNodeId,
//       sourceHandle,
//       target: targetNodeId,
//       targetHandle,
//     } = edge

//     if (sourceHandle === 'outbound' && targetHandle === 'inbound') {
//       const sourceNode = res.find(el => el.nodeId === sourceNodeId)
//       const targetNode = res.find(el => el.nodeId === targetNodeId)

//       if (sourceNode && targetNode) {
//         sourceNode.outboundEdges.push(targetNodeId)
//         targetNode.inboundEdges.push(sourceNodeId)
//       }
//     }
//   })

//   console.log(res)

//   return res
// }

export const FlowEditor = () => {
  const [nodes, setNodes] = useState<typeof initialNodes>([])
  const [edges, setEdges] = useState<typeof initialEdges>([])

  const { state } = useLocation()
  const { flowDataId } = state || {} // Read values passed on state

  // Load initial
  useEffect(() => {
    ;(async () => {
      if (typeof flowDataId !== 'string') {
        return
      }

      const snap = await db.collection('flow_data').doc(flowDataId).get()
      const data = snap.data() as DocFlowData

      const { nodes: newNodes, edges: newEdges } = JSON.parse(data.flowDataJson)

      setNodes(newNodes)
      setEdges(newEdges)
    })()
  }, [flowDataId])

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

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* <Teleporter.Source>
        <CreatableSelect
          styles={{
            control: (baseStyles, state) => ({ ...baseStyles, position: 'absolute', maxWidth: '200px', minWidth: '200px', zIndex: 100, pointerEvents: 'auto' }),
          }}
          // onChange={(v) => { setSelectedOptions(v); return false }}
          autoFocus={false}
          isDisabled={false}
          isMulti={true}
          isClearable={true}
          isSearchable={true}
          options={options}
          // defaultValue={selectedOptions}
        />
      </Teleporter.Source> */}
        <div
          style={{ width: 400 }}
          className="border-r-grayscaleDivider flex flex-col border-r p-6">
          <div className="mb-3">
            <button
              className="btn-primary btn m-2"
              onClick={() => {
                if (typeof flowDataId !== 'string') {
                  return
                }

                const obj = { nodes, edges }

                nodes.forEach(el => {
                  el.data.initialContents = nodeContents.current[el.id]
                })

                const docUpdate: Partial<DocFlowData> = {
                  lastSaveTimestamp: serverTimestamp() as Timestamp,
                  flowDataJson: JSON.stringify(obj),
                }
                db.collection('flow_data').doc(flowDataId).update(docUpdate)
              }}>
              Save
            </button>
            <button
              className="btn m-2"
              onClick={() => {
                setNodes([])
                setEdges([])
              }}>
              Clear
            </button>
            <button
              className="btn m-2"
              onClick={() => {
                const { nodes: newNodes, edges: newEdges } = JSON.parse(sample2)

                setNodes(newNodes)
                setEdges(newEdges)
              }}>
              Sample
            </button>
          </div>

          {/* Data Connectors */}
          <div className="mb-3">
            <div className="text-16 mb-1 font-bold">Nodes</div>
            <div className="my-2" />
            <button
              className="btn m-2"
              onClick={() => {
                setNodes(prev => {
                  const nodeId = 'data-source-' + String(Date.now())
                  return [
                    ...prev,
                    {
                      id: nodeId,
                      type: 'DataSourceNode',
                      data: { nodeId, initialContents: {} },
                      position: randPos(viewport.current),
                    },
                  ]
                })
              }}>
              Data Source
            </button>
            <button
              className="btn m-2"
              onClick={() => {
                setNodes(prev => {
                  const nodeId = 'data-extractor-' + String(Date.now())
                  return [
                    ...prev,
                    {
                      id: nodeId,
                      type: 'DataExtractorNode',
                      data: { nodeId, initialContents: {} },
                      position: randPos(viewport.current),
                    },
                  ]
                })
              }}>
              Data Extractor
            </button>
            <button
              className="btn m-2"
              onClick={() => {
                setNodes(prev => {
                  const nodeId = 'aws-uploader-' + String(Date.now())
                  return [
                    ...prev,
                    {
                      id: nodeId,
                      type: 'AwsUploaderNode',
                      data: { nodeId, initialContents: {} },
                      position: randPos(viewport.current),
                    },
                  ]
                })
              }}>
              AWS Uploader
            </button>
            <button
              className="btn m-2"
              onClick={() => {
                setNodes(prev => {
                  const nodeId = 'evaluator-' + String(Date.now())
                  return [
                    ...prev,
                    {
                      id: nodeId,
                      type: 'EvaluatorNode',
                      data: { nodeId, initialContents: {} },
                      position: randPos(viewport.current),
                    },
                  ]
                })
              }}>
              Evaluator
            </button>
          </div>

          <div className="flex-1" />

          <div className="flex">
            <button
              className="btn m-2"
              onClick={() => {
                // TODO: Implement Execute Here
              }}>
              Execute
            </button>
          </div>
        </div>
        <div className="flex-1">
          <ReactFlow
            // onInit={onInit}
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            panOnScroll
            selectionOnDrag
            selectionMode={SelectionMode.Partial}
            onMove={(_, newViewport) => {
              viewport.current = newViewport
            }}>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>

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

const sample2 = `
{
  "nodes": [
    {
      "id": "evaluator-1686634553146",
      "type": "EvaluatorNode",
      "data": {
        "nodeId": "evaluator-1686634553146",
        "initialContents": {
          "strategy": "rmse"
        }
      },
      "position": {
        "x": 1039.8001389451329,
        "y": 164.80000385958704
      },
      "width": 400,
      "height": 252,
      "selected": false,
      "positionAbsolute": {
        "x": 1039.8001389451329,
        "y": 164.80000385958704
      },
      "dragging": false
    },
    {
      "id": "data-extractor-1686634553855",
      "type": "DataExtractorNode",
      "data": {
        "nodeId": "data-extractor-1686634553855",
        "initialContents": {
          "keyPromptPairs": {
            "Intents": "What was the customer's main intention or goal during the conversation?",
            "Frustations": "What are some customer frustrations found within the conversation?",
            "Sentiment": "Based on the tone and content of the conversation, what was the overall sentiment expressed by the customer?",
            "Summaries": "Can you provide a brief summary of the key points and resolutions from the conversation?",
            "Score (1-5)": "Based on the customer's satisfaction and the effectiveness of the interaction, how would you rate this conversation on a scale from 1 to 5, where 1 is unsatisfactory and 5 is excellent?"
          }
        }
      },
      "position": {
        "x": 68.03385966000883,
        "y": -199.93998601800106
      },
      "width": 800,
      "height": 486,
      "selected": false,
      "positionAbsolute": {
        "x": 68.03385966000883,
        "y": -199.93998601800106
      },
      "dragging": false
    },
    {
      "id": "data-source-1686634560481",
      "type": "DataSourceNode",
      "data": {
        "nodeId": "data-source-1686634560481",
        "initialContents": {
          "source": "aws",
          "dataType": "mp3",
          "apiKey": "wxyz",
          "path": "/data/truth"
        }
      },
      "position": {
        "x": 462.5010595093245,
        "y": 347.46727350740326
      },
      "width": 400,
      "height": 386,
      "selected": false,
      "positionAbsolute": {
        "x": 462.5010595093245,
        "y": 347.46727350740326
      },
      "dragging": false
    },
    {
      "id": "data-source-1686634584985",
      "type": "DataSourceNode",
      "data": {
        "nodeId": "data-source-1686634584985",
        "initialContents": {
          "source": "aws",
          "dataType": "mp3",
          "apiKey": "xyz",
          "path": "/data/source"
        }
      },
      "position": {
        "x": -482.731803935862,
        "y": 13.460064156630281
      },
      "width": 400,
      "height": 386,
      "selected": false,
      "positionAbsolute": {
        "x": -482.731803935862,
        "y": 13.460064156630281
      },
      "dragging": false
    },
    {
      "id": "aws-uploader-1686634614620",
      "type": "AwsUploaderNode",
      "data": {
        "nodeId": "aws-uploader-1686634614620",
        "initialContents": {
          "path": "/data/result",
          "period": "daily",
          "apiKey": "abcd"
        }
      },
      "position": {
        "x": 1034.4344483321534,
        "y": -377.79998456165185
      },
      "width": 400,
      "height": 308,
      "selected": false,
      "positionAbsolute": {
        "x": 1034.4344483321534,
        "y": -377.79998456165185
      },
      "dragging": false
    },
    {
      "id": "aws-uploader-1686634628985",
      "type": "AwsUploaderNode",
      "data": {
        "nodeId": "aws-uploader-1686634628985",
        "initialContents": {
          "path": "/data/evaluator-result",
          "period": "daily",
          "apiKey": "abcd"
        }
      },
      "position": {
        "x": 1597.8344599109146,
        "y": 89.5998070206488
      },
      "width": 400,
      "height": 308,
      "selected": false,
      "positionAbsolute": {
        "x": 1597.8344599109146,
        "y": 89.5998070206488
      },
      "dragging": false
    }
  ],
  "edges": [
    {
      "source": "data-extractor-1686634553855",
      "sourceHandle": "out",
      "target": "evaluator-1686634553146",
      "targetHandle": "in-ai-data",
      "id": "reactflow__edge-data-extractor-1686634553855out-evaluator-1686634553146in-ai-data"
    },
    {
      "source": "data-source-1686634560481",
      "sourceHandle": "out",
      "target": "evaluator-1686634553146",
      "targetHandle": "in-truth-data",
      "id": "reactflow__edge-data-source-1686634560481out-evaluator-1686634553146in-truth-data"
    },
    {
      "source": "data-source-1686634584985",
      "sourceHandle": "out",
      "target": "data-extractor-1686634553855",
      "targetHandle": "in",
      "id": "reactflow__edge-data-source-1686634584985out-data-extractor-1686634553855in"
    },
    {
      "source": "data-extractor-1686634553855",
      "sourceHandle": "out",
      "target": "aws-uploader-1686634614620",
      "targetHandle": "in",
      "id": "reactflow__edge-data-extractor-1686634553855out-aws-uploader-1686634614620in"
    },
    {
      "source": "evaluator-1686634553146",
      "sourceHandle": "out",
      "target": "aws-uploader-1686634628985",
      "targetHandle": "in",
      "id": "reactflow__edge-evaluator-1686634553146out-aws-uploader-1686634628985in"
    }
  ]
}
`

export default FlowEditor
