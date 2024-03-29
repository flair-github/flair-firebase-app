import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { GrAggregate } from 'react-icons/gr'
import { NodeHeader } from '~/components/shared/NodeHeader'
import clsx from 'clsx'

export interface DataExtractorAggregatorNodeContent {
  nodeType: 'data-extractor-aggregator'
  column: string
  // method: string
  // model: string
}

export const dataExporterSalesforceDefaultContent: DataExtractorAggregatorNodeContent = {
  nodeType: 'data-extractor-aggregator',
  column: '',
  // method: '',
  // model: '',
}

export const DataExtractorAggregatorNode = ({
  data,
  noHandle,
}: {
  data: NodeData
  noHandle?: boolean
}) => {
  const [nodeContent, setNodeContent] = useState<DataExtractorAggregatorNodeContent>(
    dataExporterSalesforceDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-extractor-aggregator') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataExtractorAggregatorNodeContent = {
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
      className="bg-blue-50">
      <NodeHeader
        Icon={GrAggregate}
        title="Aggregator"
        color="blue"
        nodeId={data.nodeId}
        isCollapsed={isCollapsed}
        toggleCollapse={() => {
          setIsCollapse(x => !x)
        }}
      />
      <section className={clsx(isCollapsed && 'hidden', 'px-5 pb-5')}>
        <div className="mb-2 flex">
          <div className="flex-1">
            <div className="mb-2 font-bold">input</div>
          </div>
          <div className="flex-1 text-right">
            <div className="mb-2 font-bold">description</div>
            <div className="mb-2 font-bold">data</div>
          </div>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Column</span>
          </label>
          <input
            className="input w-full border-black"
            name={'column'}
            value={nodeContent.column}
            onChange={handleChange}
          />
        </div>
        {/* <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Method</span>
          </label>
          <select
            className="select w-full border-black "
            name={'method'}
            value={nodeContent.method}
            onChange={handleChange}>
            <option value={'Top K'}>Top K</option>
            <option value={'Embedding Model'}>Embedding Model</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Model</span>
          </label>
          <select
            className="select w-full border-black "
            name={'model'}
            value={nodeContent.model}
            onChange={handleChange}>
            <option value={'gpt-3.5-turbo'}>gpt-3.5-turbo</option>
            <option value={'gpt-4'}>gpt-4</option>
            <option value={'falcon-40b'}>falcon-40b</option>
            <option value={'vicuna-13'}>vicuna-13</option>
            <option value={'claude'}>Claude</option>
            <option value={'bard'}>Bard</option>
          </select>
        </div> */}
      </section>
      {!noHandle && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            id="in"
            style={{
              top: isCollapsed ? 50 : 110,
              width: 16,
              height: 16,
              left: -8,
            }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="out-description"
            style={{
              top: isCollapsed ? 35 : 110,
              width: 16,
              height: 16,
              right: -8,
            }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="out-data"
            style={{
              top: isCollapsed ? 65 : 140,
              width: 16,
              height: 16,
              right: -8,
            }}
          />
        </>
      )}
    </div>
  )
}
