import React from 'react'
import { useEffect, useState } from 'react'
import { Handle, Position } from 'reactflow'
import { nodeContents, type NodeData } from './Registry'
import { AiFillApi } from 'react-icons/ai'
import { NodeHeader } from '~/components/shared/NodeHeader'
import clsx from 'clsx'

export interface DataRetrieverApiNodeContent {
  nodeType: 'data-retriever-api'
  url: string
  method: string
  headers: string
  body: string
}

export const dataRetrieverDefaultContent: DataRetrieverApiNodeContent = {
  nodeType: 'data-retriever-api',
  url: '',
  method: 'GET',
  headers: '',
  body: '',
}

export const DataRetrieverApiNode = ({ data }: { data: NodeData }) => {
  const [nodeContent, setNodeContent] = useState<DataRetrieverApiNodeContent>(
    dataRetrieverDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-retriever-api') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataRetrieverApiNodeContent = {
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
        Icon={AiFillApi}
        title="Data Retriever API"
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
            <span className="font-bold">URL</span>
          </label>
          <input
            className="input w-full border-black"
            value={nodeContent.url}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, url: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Request Method</span>
          </label>
          <input
            className="input w-full border-black"
            value={nodeContent.method}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, method: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Request Headers</span>
          </label>
          <textarea
            rows={3}
            className="textarea w-full overflow-y-scroll border-black py-2"
            value={nodeContent.headers}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, headers: newVal }))
            }}
            placeholder={`{
"Authorization": "Bearer 111111111111111111111",
}`}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Request Body</span>
          </label>
          <textarea
            rows={3}
            className="textarea w-full overflow-y-scroll border-black py-2"
            value={nodeContent.body}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, body: newVal }))
            }}
          />
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
