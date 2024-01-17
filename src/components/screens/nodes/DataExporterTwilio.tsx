import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { SiTwilio } from 'react-icons/si'
import { NodeHeader } from '~/components/shared/NodeHeader'
import clsx from 'clsx'

export interface DataExporterTwilioNodeContent {
  nodeType: 'data-exporter-twilio'
  account_sid: string
  auth_token: string
  from: string
  to: string
  body: string
  type: string
}

export const dataExporterTwilioDefaultContent: DataExporterTwilioNodeContent = {
  nodeType: 'data-exporter-twilio',
  account_sid: '',
  auth_token: '',
  from: '',
  to: '',
  body: '',
  type: 'SMS',
}

export const DataExporterTwilioNode = ({
  data,
  noHandle,
}: {
  data: NodeData
  noHandle?: boolean
}) => {
  const [nodeContent, setNodeContent] = useState<DataExporterTwilioNodeContent>(
    dataExporterTwilioDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-exporter-twilio') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataExporterTwilioNodeContent = {
      ...nodeContent,
    }

    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId, nodeContent])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setNodeContent(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const [isCollapsed, setIsCollapse] = useState(true)

  return (
    <div
      style={{
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '6px',
        width: 1000,
      }}
      className="bg-teal-50">
      <NodeHeader
        Icon={SiTwilio}
        title="Exporter: Twilio"
        color="teal"
        nodeId={data.nodeId}
        isCollapsed={isCollapsed}
        toggleCollapse={() => {
          setIsCollapse(x => !x)
        }}
      />
      <section className={clsx(isCollapsed && 'hidden', 'px-5 pb-5')}>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">TWILIO_ACCOUNT_SID</span>
          </label>
          <input
            className="input w-full border-black"
            name={'account_sid'}
            value={nodeContent.account_sid}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">TWILIO_AUTH_TOKEN</span>
          </label>
          <input
            className="input w-full border-black"
            name={'auth_token'}
            value={nodeContent.auth_token}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">From</span>
          </label>
          <input
            className="input w-full border-black"
            name={'from'}
            value={nodeContent.from}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">To</span>
          </label>
          <input
            className="input w-full border-black"
            name={'to'}
            value={nodeContent.to}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Body</span>
          </label>
          <textarea
            rows={15}
            className="textarea w-full overflow-y-scroll border-black py-2"
            name={'body'}
            value={nodeContent.body}
            onChange={handleChange}
            placeholder={''}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Type</span>
          </label>
          <input
            className="input w-full border-black"
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
