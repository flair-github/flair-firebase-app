import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { FaSalesforce } from 'react-icons/fa'

export interface DataExporterSalesforceNodeContent {
  nodeType: 'data-exporter-salesforce'
  username: string
  password: string
  securityToken: string
  loginUrl: string
  salesforceObject: string
}

export const dataExporterSalesforceDefaultContent: DataExporterSalesforceNodeContent = {
  nodeType: 'data-exporter-salesforce',
  username: '',
  password: '',
  securityToken: '',
  loginUrl: '',
  salesforceObject: '',
}

export const DataExporterSalesforceNode = ({
  data,
  noHandle,
}: {
  data: NodeData
  noHandle?: boolean
}) => {
  const [nodeContent, setNodeContent] = useState<DataExporterSalesforceNodeContent>(
    dataExporterSalesforceDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-exporter-salesforce') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataExporterSalesforceNodeContent = {
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
        <FaSalesforce className="h-7 w-7" />
        <h4 className="ml-3 grow">Salesforce</h4>
      </header>
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Username</span>
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
            <span className="label-text">Password</span>
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
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Security Token</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.securityToken}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, securityToken: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Salesforce Object</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {}}
            value={'leads'}>
            <option value={'leads'}>leads</option>
            <option value={'accounts'}>accounts</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Insert Statement</span>
          </label>
          <textarea
            rows={3}
            className="max-w-xs textarea w-full overflow-y-scroll border-black py-2"
            value={''}
            onChange={e => {}}
            placeholder={''}
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
