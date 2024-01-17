import React from 'react'
import { useEffect, useState } from 'react'
import { Handle, Position } from 'reactflow'
import { nodeContents, type NodeData } from './Registry'
import { GiConvergenceTarget } from 'react-icons/gi'
import { NodeHeader } from '~/components/shared/NodeHeader'
import clsx from 'clsx'

export interface DataRetrieverNodeContent {
  nodeType: 'data-retriever'
  embeddingType: 'bert' | 'cohere' | 'gpt'
  retrieveStrategy: 'default' | 'top_5' | 'top_10'
}

export const dataRetrieverDefaultContent: DataRetrieverNodeContent = {
  nodeType: 'data-retriever',
  embeddingType: 'gpt',
  retrieveStrategy: 'default',
}

export const DataRetrieverNode = ({ data }: { data: NodeData }) => {
  const [nodeContent, setNodeContent] = useState<DataRetrieverNodeContent>(
    dataRetrieverDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-retriever') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataRetrieverNodeContent = {
      ...nodeContent,
    }

    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId, nodeContent])

  const [isCollapsed, setIsCollapse] = useState(true)

  return (
    <div
      style={{
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '5px',
        width: 400,
      }}
      className="bg-orange-50">
      <NodeHeader
        Icon={GiConvergenceTarget}
        title="Data Retriever"
        color="orange"
        nodeId={data.nodeId}
        isCollapsed={isCollapsed}
        toggleCollapse={() => {
          setIsCollapse(x => !x)
        }}
      />
      <section className={clsx(isCollapsed && 'hidden', 'px-5 pb-5')}>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Embedding Type</span>
          </label>
          <select
            className="select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataRetrieverNodeContent['embeddingType']
              setNodeContent(prev => ({ ...prev, embeddingType: newVal }))
            }}
            value={nodeContent.embeddingType}>
            <option value={'bert' satisfies DataRetrieverNodeContent['embeddingType']}>bert</option>
            <option value={'cohere' satisfies DataRetrieverNodeContent['embeddingType']}>
              cohere
            </option>
            <option value={'gpt' satisfies DataRetrieverNodeContent['embeddingType']}>gpt</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Retrieve Strategy</span>
          </label>
          <select
            className="select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataRetrieverNodeContent['retrieveStrategy']
              setNodeContent(prev => ({ ...prev, retrieveStrategy: newVal }))
            }}
            value={nodeContent.retrieveStrategy}>
            <option value={'default' satisfies DataRetrieverNodeContent['retrieveStrategy']}>
              default
            </option>
            <option value={'top_5' satisfies DataRetrieverNodeContent['retrieveStrategy']}>
              Top 5
            </option>
            <option value={'top_10' satisfies DataRetrieverNodeContent['retrieveStrategy']}>
              Top 10
            </option>
          </select>
        </div>
      </section>
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
    </div>
  )
}
