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
  salesforceObject: string
  statement: string
}

export const dataExporterSalesforceDefaultContent: DataExporterSalesforceNodeContent = {
  nodeType: 'data-exporter-salesforce',
  username: '',
  password: '',
  securityToken: '',
  salesforceObject: 'leads',
  statement: '',
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
            name={'username'}
            value={nodeContent.username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            name={'password'}
            value={nodeContent.password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Security Token</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            name={'securityToken'}
            value={nodeContent.securityToken}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Salesforce Object</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            name={'salesforceObject'}
            value={nodeContent.salesforceObject}
            onChange={handleChange}>
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
            name={'statement'}
            value={nodeContent.statement}
            onChange={handleChange}
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
