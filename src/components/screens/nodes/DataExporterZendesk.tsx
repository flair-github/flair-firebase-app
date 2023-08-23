import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { SiZendesk } from 'react-icons/si'

export interface DataExporterZendeskNodeContent {
  nodeType: 'data-exporter-zendesk'
  subdomain: string
  email: string
  apiToken: string
  endpoint: string
  headers: string
}

export const dataExporterZendeskDefaultContent: DataExporterZendeskNodeContent = {
  nodeType: 'data-exporter-zendesk',
  subdomain: '',
  email: '',
  apiToken: '',
  endpoint: '',
  headers: '',
}

export const DataExporterZendeskNode = ({
  data,
  noHandle,
}: {
  data: NodeData
  noHandle?: boolean
}) => {
  const [nodeContent, setNodeContent] = useState<DataExporterZendeskNodeContent>(
    dataExporterZendeskDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-exporter-zendesk') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataExporterZendeskNodeContent = {
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
        <SiZendesk className="h-7 w-7" />
        <h4 className="ml-3 grow">Zendesk</h4>
      </header>
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Subdomain</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.subdomain}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, subdomain: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.email}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, email: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">API Token</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.apiToken}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, apiToken: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input className="max-w-xs input w-full border-black" value={''} onChange={e => {}} />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Comment</span>
          </label>
          <textarea
            rows={3}
            className="max-w-xs textarea w-full overflow-y-scroll border-black py-2"
            value={''}
            onChange={e => {}}
            placeholder={''}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Priority</span>
          </label>
          <input className="max-w-xs input w-full border-black" value={''} onChange={e => {}} />
        </div>

        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Type</span>
          </label>
          <input className="max-w-xs input w-full border-black" value={''} onChange={e => {}} />
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
