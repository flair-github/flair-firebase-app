import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { FaSalesforce } from 'react-icons/fa'
import { NodeHeader } from '~/components/shared/NodeHeader'
import clsx from 'clsx'

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

  const [isCollapsed, setIsCollapse] = useState(true)

  return (
    <div
      style={{
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '6px',
        width: 400,
      }}
      className="bg-teal-50">
      <NodeHeader
        Icon={FaSalesforce}
        title="Exporter: Salesforce"
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
            <span className="font-bold">Username</span>
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
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Security Token</span>
          </label>
          <input
            className="input w-full border-black"
            name={'securityToken'}
            value={nodeContent.securityToken}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Salesforce Object</span>
          </label>
          <select
            className="select w-full border-black "
            name={'salesforceObject'}
            value={nodeContent.salesforceObject}
            onChange={handleChange}>
            <option value={'leads'}>leads</option>
            <option value={'accounts'}>accounts</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Insert Statement</span>
          </label>
          <textarea
            rows={3}
            className="textarea w-full overflow-y-scroll border-black py-2"
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
