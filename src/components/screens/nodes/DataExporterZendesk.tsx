import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { SiZendesk } from 'react-icons/si'
import { NodeHeader } from '~/components/shared/NodeHeader'

export interface DataExporterZendeskNodeContent {
  nodeType: 'data-exporter-zendesk'
  subdomain: string
  email: string
  apiToken: string
  title: string
  comment: string
  priority: string
  type: string
}

export const dataExporterZendeskDefaultContent: DataExporterZendeskNodeContent = {
  nodeType: 'data-exporter-zendesk',
  subdomain: '',
  email: '',
  apiToken: '',
  title: '',
  comment: '',
  priority: '',
  type: '',
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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setNodeContent(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  return (
    <div
      style={{
        background: 'white',
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '6px',
        width: 400,
      }}>
      <NodeHeader Icon={SiZendesk} title="Exporter: Zendesk" color="teal" />
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Subdomain</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            name={'subdomain'}
            value={nodeContent.subdomain}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            name={'email'}
            value={nodeContent.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">API Token</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            name={'apiToken'}
            value={nodeContent.apiToken}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            name={'title'}
            value={nodeContent.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Comment</span>
          </label>
          <textarea
            rows={3}
            className="max-w-xs textarea w-full overflow-y-scroll border-black py-2"
            name={'comment'}
            value={nodeContent.comment}
            onChange={handleChange}
            placeholder={''}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Priority</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            name={'priority'}
            value={nodeContent.priority}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Type</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            name={'type'}
            value={nodeContent.type}
            onChange={handleChange}
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
