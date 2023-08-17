import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { AiFillApi } from 'react-icons/ai'

export interface DataExporterAPINodeContent {
  nodeType: 'data-exporter-api'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
  url: string
  method: string
  headers: string
  body: string
}

export const dataExporterAPIDefaultContent: DataExporterAPINodeContent = {
  nodeType: 'data-exporter-api',
  fileType: 'csv',
  url: '',
  method: 'GET',
  headers: '',
  body: '',
}

export const DataExporterAPINode = ({ data, noHandle }: { data: NodeData; noHandle?: boolean }) => {
  const [nodeContent, setNodeContent] = useState<DataExporterAPINodeContent>(
    dataExporterAPIDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-exporter-api') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataExporterAPINodeContent = {
      ...nodeContent,
    }

    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId, nodeContent])

  return (
    <div
      style={{
        background: 'white',
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '6px',
        width: 400,
      }}>
      <header className="fw-bold mb-2 flex items-center rounded-t-md bg-teal-200 px-5 py-3">
        <AiFillApi className="h-7 w-7" />
        <h4 className="ml-3 grow">Data Exporter: API</h4>
      </header>
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">File Type</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataExporterAPINodeContent['fileType']
              setNodeContent(prev => ({ ...prev, fileType: newVal }))
            }}
            value={nodeContent.fileType}>
            <option value={'txt' satisfies DataExporterAPINodeContent['fileType']}>txt</option>
            <option value={'csv' satisfies DataExporterAPINodeContent['fileType']}>csv</option>
            <option value={'mp3' satisfies DataExporterAPINodeContent['fileType']}>mp3</option>
            <option value={'pdf' satisfies DataExporterAPINodeContent['fileType']}>pdf</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">URL</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.url}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, url: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Request Method</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.method}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, method: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Request Headers</span>
          </label>
          <textarea
            rows={3}
            className="max-w-xs textarea w-full overflow-y-scroll border-black py-2"
            value={nodeContent.headers}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, headers: newVal }))
            }}
            placeholder={`{
"Authorization": "Bearer 111111111111111111111",
}`}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Request Body</span>
          </label>
          <textarea
            rows={3}
            className="max-w-xs textarea w-full overflow-y-scroll border-black py-2"
            value={nodeContent.body}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, body: newVal }))
            }}
          />
        </div>
      </section>
      {!noHandle && (
        <Handle
          type="target"
          position={Position.Left}
          id="in"
          style={{
            width: 16,
            height: 16,
            left: -8,
          }}
        />
      )}
    </div>
  )
}
