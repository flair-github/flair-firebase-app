import React, { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { atomUserData } from '~/jotai/jotai'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { db } from '~/lib/firebase'
import { DocWorkflow } from 'Types/firebaseStructure'
import { Timestamp, serverTimestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import {
  DataSourceLocalFilesNode,
  dataSourceLocalFilesDefaultContent,
} from './nodes/DataSourceLocalFiles'
import { v4 } from 'uuid'
import { LLMProcessorNode, llmProcessorNodeDefaultContent } from './nodes/LLMProcessorNode'
import { DataExporterFlairNode, dataExporterFlairDefaultContent } from './nodes/DataExporterFlair'
import { NodeContent, nodeContents } from './nodes/Registry'
import { DataSourceS3Node, dataSourceS3DefaultContent } from './nodes/DataSourceS3'
import { nodeTypes } from './FlowEditor'

function TemplateWizard() {
  const userData = useAtomValue(atomUserData)
  const navigate = useNavigate()

  const [dataSourceLocalFilesNodeId] = useState('data-source-local-files' + '-' + v4())
  const [dataSourceS3NodeId] = useState('data-source-s3' + '-' + v4())
  const [llmProcessorNodeId] = useState('llm-processor' + '-' + v4())
  const [dataExporterFlairNodeId] = useState('data-exporter-flair-' + '-' + v4())

  const [page, setPage] = useState(1)

  const [step1NodeType, setStep1NodeType] =
    useState<NodeContent['nodeType']>('data-source-local-files')
  const [step2NodeType, setStep2NodeType] = useState<NodeContent['nodeType']>('llm-processor')
  const [step3NodeType, setStep3NodeType] = useState<NodeContent['nodeType']>('data-exporter-flair')

  type StepNodeData = {
    id: string
    type: keyof typeof nodeTypes
  }

  const step1Node: StepNodeData = useMemo(() => {
    if (step1NodeType === 'data-source-local-files') {
      return {
        id: dataSourceLocalFilesNodeId,
        type: 'DataSourceLocalFilesNode',
      }
    }

    if (step1NodeType === 'data-source-s3') {
      return {
        id: dataSourceS3NodeId,
        type: 'DataSourceS3Node',
      }
    }

    throw new Error('Failed executing step1Node')
  }, [step1NodeType, dataSourceLocalFilesNodeId, dataSourceS3NodeId])

  const step2Node: StepNodeData = useMemo(() => {
    if (step2NodeType === 'llm-processor') {
      return {
        id: llmProcessorNodeId,
        type: 'LLMProcessorNode',
      }
    }

    throw new Error('Failed executing step2Node')
  }, [step2NodeType, llmProcessorNodeId])

  const step3Node: StepNodeData = useMemo(() => {
    if (step3NodeType === 'data-exporter-flair') {
      return {
        id: dataExporterFlairNodeId,
        type: 'DataExporterFlairNode',
      }
    }

    throw new Error('Failed executing step3Node')
  }, [step3NodeType, dataExporterFlairNodeId])

  useEffect(() => {
    if (!userData?.userId) {
      return
    }

    return () => {}
  }, [userData?.userId])

  const createNewFlow = async () => {
    const titleInput = window.document.getElementById('flow-title-field') as HTMLInputElement
    const title = titleInput?.value || 'New Flow'

    if (titleInput) {
      titleInput.value = ''
    }

    if (!userData?.userId) {
      return
    }

    const flowData = {
      nodes: [
        {
          id: step1Node.id,
          type: step1Node.type,
          data: {
            nodeId: step1Node.id,
            initialContents: nodeContents.current[step1Node.id],
          },
          position: {
            x: 0,
            y: 0,
          },
          width: 400,
          height: 258,
          selected: true,
          positionAbsolute: {
            x: 0,
            y: 0,
          },
          dragging: false,
        },
        {
          id: step2Node.id,
          type: step2Node.type,
          data: {
            nodeId: step2Node.id,
            initialContents: nodeContents.current[step2Node.id],
          },
          position: {
            x: 600,
            y: 0,
          },
          width: 800,
          height: 314,
          selected: false,
          positionAbsolute: {
            x: 600,
            y: 0,
          },
          dragging: false,
        },
        {
          id: step3Node.id,
          type: step3Node.type,
          data: {
            nodeId: step3Node.id,
            initialContents: nodeContents.current[step3Node.id],
          },
          position: {
            x: 1600,
            y: 0,
          },
          width: 400,
          height: 186,
          selected: false,
          positionAbsolute: {
            x: 1600,
            y: 0,
          },
          dragging: false,
        },
      ],
      edges: [
        {
          source: step1Node.id,
          sourceHandle: 'out',
          target: step2Node.id,
          targetHandle: 'in',
          id: `reactflow__edge-${step1Node.id}out-${step2Node.id}in`,
        },
        {
          source: step2Node.id,
          sourceHandle: 'out',
          target: step3Node.id,
          targetHandle: 'in',
          id: `reactflow__edge-${step2Node.id}out-${step3Node.id}in`,
        },
      ],
    }

    console.log(flowData)

    const ref = db.collection('workflows').doc()
    const newFlowData: DocWorkflow = {
      createdTimestamp: serverTimestamp() as Timestamp,
      updatedTimestamp: serverTimestamp() as Timestamp,
      lastSaveTimestamp: serverTimestamp() as Timestamp,
      docExists: true,
      workflowId: ref.id,
      frontendConfig: JSON.stringify(flowData),
      workflowTitle: title || 'New Flow',
      ownerUserId: userData.userId,
    }

    await ref.set(newFlowData)

    navigate('/editor', { state: { workflowId: ref.id } })
  }

  const [showNewFlowModal, setShowNewFlowModal] = useState(false)
  return (
    <div className="container mx-auto p-10">
      <div className="mb-3 text-2xl font-bold">Basic Prompting</div>
      <ol className="flex w-full items-center space-x-2 rounded-lg border border-gray-200 bg-white p-3 text-center text-sm font-medium text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:space-x-4 sm:p-4 sm:text-base">
        <li
          className={[
            'flex items-center',
            page >= 1 ? 'text-blue-600 dark:text-blue-500' : '',
          ].join(' ')}>
          <span
            className={[
              'mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs',
              page >= 1
                ? 'border-blue-600 dark:border-blue-500'
                : 'border-gray-500 dark:border-gray-400',
            ].join(' ')}>
            1
          </span>
          Data Source
          <FiArrowRight size={18} className="ml-3" />
        </li>
        <li
          className={[
            'flex items-center',
            page >= 2 ? 'text-blue-600 dark:text-blue-500' : '',
          ].join(' ')}>
          <span
            className={[
              'mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs',
              page >= 2
                ? 'border-blue-600 dark:border-blue-500'
                : 'border-gray-500 dark:border-gray-400',
            ].join(' ')}>
            2
          </span>
          LLM Prompts
          <FiArrowRight size={18} className="ml-3" />
        </li>
        <li
          className={[
            'flex items-center',
            page >= 3 ? 'text-blue-600 dark:text-blue-500' : '',
          ].join(' ')}>
          <span
            className={[
              'mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs',
              page >= 3
                ? 'border-blue-600 dark:border-blue-500'
                : 'border-gray-500 dark:border-gray-400',
            ].join(' ')}>
            3
          </span>
          Exporter
        </li>
      </ol>

      {/* Contents */}
      {page === 1 && (
        <>
          <DataSourcePage
            dataSourceLocalFilesNodeId={dataSourceLocalFilesNodeId}
            dataSourceS3NodeId={dataSourceS3NodeId}
            selectedNodeType={step1NodeType}
            setSelectedNodeType={setStep1NodeType}
          />
          <div className="flex justify-center space-x-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                setPage(2)
              }}>
              Next <FiArrowRight size={18} />
            </button>
          </div>
        </>
      )}

      {page === 2 && (
        <>
          <div className="my-5 flex items-center justify-center rounded-md border bg-slate-100 p-10 py-20">
            <LLMProcessorNode
              data={{
                initialContents:
                  nodeContents.current[llmProcessorNodeId] || llmProcessorNodeDefaultContent,
                nodeId: llmProcessorNodeId,
              }}
              noHandle={true}
            />
          </div>
          <div className="flex justify-center space-x-2">
            <button
              className="btn"
              onClick={() => {
                setPage(1)
              }}>
              <FiArrowLeft size={18} /> Previous
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setPage(3)
              }}>
              Next <FiArrowRight size={18} />
            </button>
          </div>
        </>
      )}

      {page === 3 && (
        <>
          <DataExporterPage
            dataExporterFlairNodeId={dataExporterFlairNodeId}
            selectedNodeType={step3NodeType}
            setSelectedNodeType={setStep3NodeType}
          />
          <div className="flex justify-center space-x-2">
            <button
              className="btn"
              onClick={() => {
                setPage(2)
              }}>
              <FiArrowLeft size={18} /> Previous
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowNewFlowModal(true)
              }}>
              Create Flow <FiArrowRight size={18} />
            </button>
          </div>
        </>
      )}

      <dialog className={['modal', showNewFlowModal ? 'modal-open' : ''].join(' ')}>
        <form method="dialog" className="modal-box">
          <h3 className="text-lg font-bold">Create New Flow</h3>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Flow Title</span>
            </label>
            <input
              type="text"
              placeholder="Flow Title"
              id="flow-title-field"
              className="input input-bordered w-full"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  setShowNewFlowModal(false)
                  createNewFlow()
                }
              }}
            />
          </div>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => {
                setShowNewFlowModal(false)
              }}>
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowNewFlowModal(false)
                createNewFlow()
              }}>
              Create
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}

export const DataSourcePage: React.FC<{
  dataSourceLocalFilesNodeId: string
  dataSourceS3NodeId: string
  selectedNodeType: NodeContent['nodeType']
  setSelectedNodeType: React.Dispatch<React.SetStateAction<NodeContent['nodeType']>>
}> = ({
  dataSourceLocalFilesNodeId,
  dataSourceS3NodeId,
  selectedNodeType,
  setSelectedNodeType,
}) => {
  return (
    <>
      <div className="rounded-box mb-1 flex space-x-3 overflow-x-auto py-2">
        <div
          onClick={() => {
            setSelectedNodeType('data-source-local-files')
          }}
          className={[
            'flex shrink-0 flex-col items-center rounded-md border px-5 py-3 w-32',
            selectedNodeType === 'data-source-local-files' ? 'border-blue-600 bg-slate-50' : '',
          ].join(' ')}>
          <img src="/images/data-sources/local-files.svg" width={75} height={75} />
          <div
            className={
              selectedNodeType === 'data-source-local-files'
                ? 'text-center font-bold'
                : 'text-center'
            }>
            Local Files
          </div>
        </div>
        <div
          onClick={() => {
            setSelectedNodeType('data-source-s3')
          }}
          className={[
            'flex shrink-0 flex-col items-center rounded-md border px-5 py-3 w-32',
            selectedNodeType === 'data-source-s3' ? 'border-blue-600 bg-slate-50' : '',
          ].join(' ')}>
          <img src="/images/data-sources/s3.svg" width={75} height={75} />
          <div
            className={
              selectedNodeType === 'data-source-s3' ? 'text-center font-bold' : 'text-center'
            }>
            S3
          </div>
        </div>
        <div className="flex w-32 shrink-0 flex-col items-center rounded-md border px-5 py-3">
          <img src="/images/data-sources/gcp.svg" width={75} height={75} />
          <div className="text-center">GCP</div>
        </div>
        <div className="flex w-32 shrink-0 flex-col items-center rounded-md border px-5 py-3">
          <img src="/images/data-sources/azure.svg" width={75} height={75} />
          <div className="text-center">Azure</div>
        </div>
        <div className="flex w-32 shrink-0 flex-col items-center rounded-md border px-5 py-3">
          <img src="/images/data-sources/api.svg" width={75} height={75} />
          <div className="text-center">API</div>
        </div>
        <div className="flex w-32 shrink-0 flex-col items-center rounded-md border bg-slate-200 px-5 py-3 opacity-50">
          <img src="/images/data-sources/salesforce.svg" width={75} height={75} />
          <div className="text-center">Salesforce</div>
        </div>
        <div className="flex w-32 shrink-0 flex-col items-center rounded-md border bg-slate-200 px-5 py-3 opacity-50">
          <img src="/images/data-sources/zendesk.svg" width={75} height={75} />
          <div className="text-center">Zendesk</div>
        </div>
      </div>
      <div className="mb-5 flex flex-col items-center justify-center space-y-4 rounded-md border bg-slate-100 p-10 py-20">
        {selectedNodeType === 'data-source-local-files' && (
          <DataSourceLocalFilesNode
            data={{
              initialContents:
                nodeContents.current[dataSourceLocalFilesNodeId] ||
                dataSourceLocalFilesDefaultContent,
              nodeId: dataSourceLocalFilesNodeId,
            }}
            noHandle={true}
          />
        )}
        {selectedNodeType === 'data-source-s3' && (
          <DataSourceS3Node
            data={{
              initialContents:
                nodeContents.current[dataSourceS3NodeId] || dataSourceS3DefaultContent,
              nodeId: dataSourceS3NodeId,
            }}
            noHandle={true}
          />
        )}
      </div>
    </>
  )
}

export const DataExporterPage: React.FC<{
  dataExporterFlairNodeId: string
  selectedNodeType: NodeContent['nodeType']
  setSelectedNodeType: React.Dispatch<React.SetStateAction<NodeContent['nodeType']>>
}> = ({ dataExporterFlairNodeId, selectedNodeType, setSelectedNodeType }) => {
  return (
    <>
      <div className="rounded-box mb-1 flex space-x-3 overflow-x-auto py-2">
        <div className="flex shrink-0 flex-col items-center rounded-md border border-blue-600 bg-slate-50 px-5 py-3">
          <img src="/images/flair-logo.svg" width={75} height={75} className="p-1" />
          <div className="text-center font-bold">Flair</div>
        </div>
        <div className="flex shrink-0 flex-col items-center rounded-md border px-5 py-3">
          <img src="/images/data-sources/s3.svg" width={75} height={75} />
          <div className="text-center">S3</div>
        </div>
        <div className="flex shrink-0 flex-col items-center rounded-md border px-5 py-3">
          <img src="/images/data-sources/gcp.svg" width={75} height={75} />
          <div className="text-center">GCP</div>
        </div>
        <div className="flex shrink-0 flex-col items-center rounded-md border px-5 py-3">
          <img src="/images/data-sources/azure.svg" width={75} height={75} />
          <div className="text-center">Azure</div>
        </div>
        <div className="flex shrink-0 flex-col items-center rounded-md border px-5 py-3">
          <img src="/images/data-sources/api.svg" width={75} height={75} />
          <div className="text-center">API</div>
        </div>
        {/* <div className="flex shrink-0 flex-col items-center rounded-md border px-5 py-3">
          <img src="/images/data-sources/database.svg" width={75} height={75} />
          <div className="text-center">Database</div>
        </div>
        <div className="flex shrink-0 flex-col items-center rounded-md border px-5 py-3">
          <img src="/images/data-sources/google-drive.svg" width={75} height={75} />
          <div className="text-center">Google Drive</div>
        </div> */}
      </div>
      <div className="mb-5 flex items-center justify-center rounded-md border bg-slate-100 p-10 py-20">
        {selectedNodeType === 'data-exporter-flair' && (
          <DataExporterFlairNode
            data={{
              initialContents:
                nodeContents.current[dataExporterFlairNodeId] || dataExporterFlairDefaultContent,
              nodeId: dataExporterFlairNodeId,
            }}
            noHandle={true}
          />
        )}
      </div>
    </>
  )
}

export default TemplateWizard
