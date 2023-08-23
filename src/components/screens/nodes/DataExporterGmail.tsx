import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { BiLogoGmail } from 'react-icons/bi'

export interface DataExporterGmailNodeContent {
  nodeType: 'data-exporter-gmail'
  to: string
  subject: string
  from: string
  prompt: string
  clientId: string
  clientSecret: string
  refreshToken: string
  accessToken: string
}

export const dataExporterGmailDefaultContent: DataExporterGmailNodeContent = {
  nodeType: 'data-exporter-gmail',
  to: '',
  subject: '',
  from: '',
  prompt: '',
  clientId: '',
  clientSecret: '',
  refreshToken: '',
  accessToken: '',
}

export const DataExporterGmailNode = ({
  data,
  noHandle,
}: {
  data: NodeData
  noHandle?: boolean
}) => {
  const [nodeContent, setNodeContent] = useState<DataExporterGmailNodeContent>(
    dataExporterGmailDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-exporter-gmail') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataExporterGmailNodeContent = {
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
      <header className="fw-bold mb-2 flex items-center rounded-t-md bg-teal-200 px-5 py-3 font-bold">
        <BiLogoGmail className="h-7 w-7" />
        <h4 className="ml-3 grow">Gmail</h4>
      </header>
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">To</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.to}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, to: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Subject</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.subject}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, subject: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">From</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.from}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, from: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Prompt</span>
          </label>
          <textarea
            rows={6}
            className="max-w-xs textarea w-full overflow-y-scroll border-black py-2"
            value={nodeContent.prompt}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, prompt: newVal }))
            }}
            placeholder={''}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">SMTP Mail Server</span>
          </label>
          <input className="max-w-xs input w-full border-black" onChange={e => {}} />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">User Name</span>
          </label>
          <input className="max-w-xs input w-full border-black" onChange={e => {}} />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input className="max-w-xs input w-full border-black" onChange={e => {}} />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">SMTP Port</span>
          </label>
          <input className="max-w-xs input w-full border-black" onChange={e => {}} />
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
