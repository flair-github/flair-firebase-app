import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { SiPowerbi } from 'react-icons/si'
import { AiOutlineBarChart, AiOutlineLineChart, AiOutlinePieChart } from 'react-icons/ai'
import { NodeHeader } from '~/components/shared/NodeHeader'

export interface DataExporterPowerBINodeContent {
  nodeType: 'data-exporter-power-bi'
  clientId: string
  clientSecret: string
  tenantId: string
  username: string
  password: string
  // chartType: string
  // xAxis: string
  yAxis: string
}

export const dataExporterPowerBIDefaultContent: DataExporterPowerBINodeContent = {
  nodeType: 'data-exporter-power-bi',
  clientId: '',
  clientSecret: '',
  tenantId: '',
  username: '',
  password: '',
  // chartType: '',
  // xAxis: '',
  yAxis: '',
}

export const DataExporterPowerBINode = ({
  data,
  noHandle,
}: {
  data: NodeData
  noHandle?: boolean
}) => {
  const [nodeContent, setNodeContent] = useState<DataExporterPowerBINodeContent>(
    dataExporterPowerBIDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-exporter-power-bi') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataExporterPowerBINodeContent = {
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
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '6px',
        width: 400,
      }}
      className="bg-teal-50">
      <NodeHeader Icon={SiPowerbi} title="Exporter: PowerBI" color="teal" nodeId={data.nodeId} />
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Client ID</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.clientId}
            name={'clientId'}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Client Secret</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.clientSecret}
            name={'clientSecret'}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Tenant ID</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.tenantId}
            name={'tenantId'}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Username</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.username}
            name={'username'}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Password</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.password}
            name={'password'}
            onChange={handleChange}
            placeholder={''}
          />
        </div>
        {/* <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Chart Type</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            value={nodeContent.chartType}
            name={'chartType'}
            onChange={handleChange}>
            <option value={'bar'}>bar</option>
            <option value={'line'}>line</option>
            <option value={'pie'}>pie</option>
          </select>
          <div className="mb-2 flex items-center justify-between">
            <button
              className={'btn btn-outline ' + (nodeContent.chartType === 'bar' && 'btn-active')}
              onClick={() => setNodeContent(prev => ({ ...prev, chartType: 'bar' }))}>
              <AiOutlineBarChart className="h-10 w-10" />
              Bar
            </button>
            <button
              className={'btn btn-outline ' + (nodeContent.chartType === 'line' && 'btn-active')}
              onClick={() => setNodeContent(prev => ({ ...prev, chartType: 'line' }))}>
              <AiOutlineLineChart className="h-10 w-10" />
              Line
            </button>
            <button
              className={'btn btn-outline ' + (nodeContent.chartType === 'pie' && 'btn-active')}
              onClick={() => setNodeContent(prev => ({ ...prev, chartType: 'pie' }))}>
              <AiOutlinePieChart className="h-10 w-10" />
              Pie
            </button>
          </div>
        </div> */}
        {/* <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">X Axis</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.xAxis}
            name={'xAxis'}
            onChange={handleChange}
          />
        </div> */}
        {/* <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Y Axis</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.yAxis}
            name={'yAxis'}
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
