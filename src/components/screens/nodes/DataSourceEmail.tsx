import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { AiFillApi } from 'react-icons/ai'
import { NodeHeader } from '~/components/shared/NodeHeader'
import { MdEmail } from 'react-icons/md'

export interface DataSourceEmailNodeContent {
  nodeType: 'data-source-email'
  protocol: 'imap' | 'pop3'
  hostname: string
  port: string
  username: string
  password: string
  tls: boolean
}

export const dataSourceEmailDefaultContent: DataSourceEmailNodeContent = {
  nodeType: 'data-source-email',
  protocol: 'imap',
  hostname: '',
  port: '',
  username: '',
  password: '',
  tls: true,
}

export const DataSourceEmailNode = ({ data, noHandle }: { data: NodeData; noHandle?: boolean }) => {
  const [nodeContent, setNodeContent] = useState<DataSourceEmailNodeContent>(
    dataSourceEmailDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-source-email') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataSourceEmailNodeContent = {
      ...nodeContent,
    }

    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId, nodeContent])

  return (
    <div
      style={{
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '6px',
        width: 400,
      }}
      className="bg-purple-50">
      <NodeHeader Icon={MdEmail} title="Source: Email" color="purple" nodeId={data.nodeId} />
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Protocol</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataSourceEmailNodeContent['protocol']
              setNodeContent(prev => ({ ...prev, protocol: newVal }))
            }}
            value={nodeContent.protocol}>
            <option value={'imap' satisfies DataSourceEmailNodeContent['protocol']}>IMAP</option>
            <option value={'pop3' satisfies DataSourceEmailNodeContent['protocol']}>POP3</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Hostname</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.hostname}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, hostname: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Port</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.port}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, port: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Username</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.username}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, username: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Password</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.password}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, password: newVal }))
            }}
          />
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="font-bold">Use TLS</span>
            <input
              onChange={e => {
                const newVal = e.target.checked
                setNodeContent(prev => ({ ...prev, tls: newVal }))
              }}
              type="checkbox"
              className="toggle"
              checked={nodeContent.tls}
            />
          </label>
        </div>
      </section>
      {!noHandle && (
        <Handle
          type="source"
          position={Position.Right}
          id="out"
          style={{
            width: 16,
            height: 16,
            right: -8,
          }}
        />
      )}
    </div>
  )
}
