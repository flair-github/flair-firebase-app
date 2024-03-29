import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { BiLogoGmail } from 'react-icons/bi'
import { NodeHeader } from '~/components/shared/NodeHeader'
import clsx from 'clsx'

export interface DataExporterGmailNodeContent {
  nodeType: 'data-exporter-gmail'
  to: string
  subject: string
  from: string
  prompt: string
  mailServer: string
  port: string
  username: string
  password: string
}

export const dataExporterGmailDefaultContent: DataExporterGmailNodeContent = {
  nodeType: 'data-exporter-gmail',
  to: '',
  subject: '',
  from: '',
  prompt: '',
  mailServer: '',
  port: '',
  username: '',
  password: '',
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
        width: 800,
      }}
      className="bg-teal-50">
      <NodeHeader
        Icon={BiLogoGmail}
        title="Exporter: Gmail"
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
            <span className="font-bold">Subject</span>
          </label>
          <input
            className="input w-full border-black"
            name={'subject'}
            value={nodeContent.subject}
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
            <span className="font-bold">Prompt</span>
          </label>
          <textarea
            rows={10}
            className="textarea w-full overflow-y-scroll border-black py-2"
            name={'prompt'}
            value={nodeContent.prompt}
            onChange={handleChange}
            placeholder={''}
          />
        </div>
        <div className="text-center">
          <button type="button" className="btn btn-primary min-w-40 normal-case">
            Connect Account
          </button>
        </div>
        {/* <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">SMTP Mail Server</span>
          </label>
          <input
            className="input w-full border-black"
            name={'mailServer'}
            value={nodeContent.mailServer}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">SMTP Port</span>
          </label>
          <input
            className="input w-full border-black"
            name={'port'}
            value={nodeContent.port}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">User Name</span>
          </label>
          <input
            className="input w-full border-black"
            name={'username'}
            value={nodeContent.username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Password</span>
          </label>
          <input
            className="input w-full border-black"
            name={'password'}
            value={nodeContent.password}
            onChange={handleChange}
          />
        </div> */}
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
