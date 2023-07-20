import React, { useState } from 'react'
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
import { LLMProcessorNode, llmProcessorNodeContents } from './nodes/LLMProcessorNode'
import { DataExporterFlairNode } from './nodes/DataExporterFlair'

function TemplateWizard() {
  const userData = useAtomValue(atomUserData)
  const navigate = useNavigate()

  useEffect(() => {
    if (!userData?.userId) {
      return
    }

    return () => {}
  }, [userData?.userId])

  const [page, setPage] = useState(1)

  const createNewFlow = async (frontendConfig: string) => {
    const titleInput = window.document.getElementById('flow-title-field') as HTMLInputElement
    const title = titleInput?.value || 'New Flow'

    if (titleInput) {
      titleInput.value = ''
    }

    if (!userData?.userId) {
      return
    }

    const ref = db.collection('workflows').doc()
    const newFlowData: DocWorkflow = {
      createdTimestamp: serverTimestamp() as Timestamp,
      updatedTimestamp: serverTimestamp() as Timestamp,
      lastSaveTimestamp: serverTimestamp() as Timestamp,
      docExists: true,
      workflowId: ref.id,
      frontendConfig,
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
          <div className="rounded-box mb-1 flex space-x-3 overflow-x-auto py-2">
            <div className="shrink-0 rounded-md border border-blue-600 bg-slate-50 px-5 py-3">
              <img src="/images/data-sources/local-files.svg" width={75} height={75} />
              <div className="text-center font-bold">Local Files</div>
            </div>
            <div className="shrink-0 rounded-md border px-5 py-3">
              <img src="/images/data-sources/s3.svg" width={75} height={75} />
              <div className="text-center">S3</div>
            </div>
            <div className="shrink-0 rounded-md border px-5 py-3">
              <img src="/images/data-sources/gcp.svg" width={75} height={75} />
              <div className="text-center">GCP</div>
            </div>
            <div className="shrink-0 rounded-md border px-5 py-3">
              <img src="/images/data-sources/azure.svg" width={75} height={75} />
              <div className="text-center">Azure</div>
            </div>
            <div className="shrink-0 rounded-md border px-5 py-3">
              <img src="/images/data-sources/salesforce.svg" width={75} height={75} />
              <div className="text-center">Salesforce</div>
            </div>
            <div className="shrink-0 rounded-md border px-5 py-3">
              <img src="/images/data-sources/zendesk.svg" width={75} height={75} />
              <div className="text-center">Zendesk</div>
            </div>
            <div className="shrink-0 rounded-md border px-5 py-3">
              <img src="/images/data-sources/api.svg" width={75} height={75} />
              <div className="text-center">API</div>
            </div>
          </div>
          <div className="mb-5 flex flex-col items-center justify-center space-y-4 rounded-md border bg-slate-100 p-10 py-20">
            <DataSourceLocalFilesNode
              data={{
                initialContents: dataSourceLocalFilesDefaultContent,
                nodeId: 'data-source-local-files' + '-' + v4(),
              }}
              noHandle={true}
            />
          </div>
          <div className="flex justify-center space-x-2">
            <button
              className="btn-primary btn"
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
                initialContents: { nodeType: 'init' },
                nodeId: 'llm-processor' + '-' + v4(),
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
              className="btn-primary btn"
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
          <div className="rounded-box mb-1 flex space-x-3 overflow-x-auto py-2">
            <div className="shrink-0 rounded-md border border-blue-600 bg-slate-50 px-5 py-3">
              <img src="/images/flair-logo.svg" width={75} height={75} className="p-1" />
              <div className="text-center font-bold">Flair</div>
            </div>
            <div className="shrink-0 rounded-md border px-5 py-3">
              <img src="/images/data-sources/s3.svg" width={75} height={75} />
              <div className="text-center">S3</div>
            </div>
            <div className="shrink-0 rounded-md border px-5 py-3">
              <img src="/images/data-sources/gcp.svg" width={75} height={75} />
              <div className="text-center">GCP</div>
            </div>
            <div className="shrink-0 rounded-md border px-5 py-3">
              <img src="/images/data-sources/azure.svg" width={75} height={75} />
              <div className="text-center">Azure</div>
            </div>
            <div className="shrink-0 rounded-md border px-5 py-3">
              <img src="/images/data-sources/api.svg" width={75} height={75} />
              <div className="text-center">API</div>
            </div>
          </div>
          <div className="mb-5 flex items-center justify-center rounded-md border bg-slate-100 p-10 py-20">
            <DataExporterFlairNode
              data={{
                initialContents: { nodeType: 'init' },
                nodeId: 'data-exporter-flair-' + '-' + v4(),
              }}
              noHandle={true}
            />
          </div>
          <div className="flex justify-center space-x-2">
            <button
              className="btn"
              onClick={() => {
                setPage(2)
              }}>
              <FiArrowLeft size={18} /> Previous
            </button>
            <button
              className="btn-primary btn"
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
              className="input-bordered input w-full"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  setShowNewFlowModal(false)
                  createNewFlow(basicData)
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
              className="btn-primary btn"
              onClick={() => {
                setShowNewFlowModal(false)
                createNewFlow(basicData)
              }}>
              Create
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}

export default TemplateWizard

const basicData = `
{
  "nodes": [
    {
      "id": "data-source-local-files-4f90967d-8227-4ae5-baa3-9bf9c205bcc9",
      "type": "DataSourceLocalFilesNode",
      "data": {
        "nodeId": "data-source-local-files-4f90967d-8227-4ae5-baa3-9bf9c205bcc9",
        "initialContents": {
          "nodeType": "data-source-local-files",
          "fileType": "mp3"
        }
      },
      "position": {
        "x": 178.31151480939184,
        "y": 46.39311308810596
      },
      "width": 400,
      "height": 258,
      "selected": true,
      "positionAbsolute": {
        "x": 178.31151480939184,
        "y": 46.39311308810596
      },
      "dragging": false
    },
    {
      "id": "llm-processor-1689608674366",
      "type": "LLMProcessorNode",
      "data": {
        "nodeId": "llm-processor-1689608674366",
        "initialContents": {
          "nodeType": "llm-processor",
          "columns": [
            {
              "columnId": "853742ba-54e9-45b4-b654-4cf063afe855",
              "type": "text",
              "promptStrategy": "default",
              "model": "gpt-3.5-turbo",
              "instruction": "",
              "name": "",
              "prompt": ""
            },
            {
              "columnId": "cd9b9211-eff9-49a6-b0c6-894b2b63d55c",
              "type": "text",
              "promptStrategy": "default",
              "model": "gpt-3.5-turbo",
              "instruction": "",
              "name": "",
              "prompt": ""
            },
            {
              "columnId": "a63f6a85-7406-4c7f-86a4-9fae2ec1dee5",
              "type": "text",
              "promptStrategy": "default",
              "model": "gpt-3.5-turbo",
              "instruction": "",
              "name": "",
              "prompt": ""
            }
          ]
        }
      },
      "position": {
        "x": 635.7765576865063,
        "y": 19.164929944612766
      },
      "width": 800,
      "height": 314,
      "selected": false,
      "positionAbsolute": {
        "x": 635.7765576865063,
        "y": 19.164929944612766
      },
      "dragging": false
    },
    {
      "id": "data-exporter-flair-453348be-effb-4c12-b4ee-8ffa743eeaf8",
      "type": "DataExporterFlairNode",
      "data": {
        "nodeId": "data-exporter-flair-453348be-effb-4c12-b4ee-8ffa743eeaf8",
        "initialContents": {
          "nodeType": "data-exporter-flair"
        }
      },
      "position": {
        "x": 1486.8547183729236,
        "y": 83.11311250149566
      },
      "width": 400,
      "height": 186,
      "selected": false,
      "positionAbsolute": {
        "x": 1486.8547183729236,
        "y": 83.11311250149566
      },
      "dragging": false
    }
  ],
  "edges": [
    {
      "source": "data-source-local-files-4f90967d-8227-4ae5-baa3-9bf9c205bcc9",
      "sourceHandle": "out",
      "target": "llm-processor-1689608674366",
      "targetHandle": "in",
      "id": "reactflow__edge-data-source-local-files-4f90967d-8227-4ae5-baa3-9bf9c205bcc9out-llm-processor-1689608674366in"
    },
    {
      "source": "llm-processor-1689608674366",
      "sourceHandle": "out",
      "target": "data-exporter-flair-453348be-effb-4c12-b4ee-8ffa743eeaf8",
      "targetHandle": "in",
      "id": "reactflow__edge-llm-processor-1689608674366out-data-exporter-flair-453348be-effb-4c12-b4ee-8ffa743eeaf8in"
    }
  ]
}
`
