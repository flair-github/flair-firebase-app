import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { AiFillApi } from 'react-icons/ai'
import { NodeHeader } from '~/components/shared/NodeHeader'
import clsx from 'clsx'

export interface DataSourceAPINodeContent {
  nodeType: 'data-source-api'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
  url: string
  method: string
  headers: string
  body: string
}

export const dataSourceAPIDefaultContent: DataSourceAPINodeContent = {
  nodeType: 'data-source-api',
  fileType: 'csv',
  url: '',
  method: 'GET',
  headers: '',
  body: '',
}

export const DataSourceAPINode = ({ data, noHandle }: { data: NodeData; noHandle?: boolean }) => {
  const [nodeContent, setNodeContent] = useState<DataSourceAPINodeContent>(
    dataSourceAPIDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-source-api') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataSourceAPINodeContent = {
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
        borderRadius: '6px',
        width: 400,
      }}
      className="bg-purple-50">
      <NodeHeader
        Icon={AiFillApi}
        title="Source: API"
        color="purple"
        nodeId={data.nodeId}
        isCollapsed={isCollapsed}
        toggleCollapse={() => {
          setIsCollapse(x => !x)
        }}
      />
      <section className={clsx(isCollapsed && 'hidden', 'px-5 pb-5')}>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">File Type</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataSourceAPINodeContent['fileType']
              setNodeContent(prev => ({ ...prev, fileType: newVal }))
            }}
            value={nodeContent.fileType}>
            <option value={'txt' satisfies DataSourceAPINodeContent['fileType']}>txt</option>
            <option value={'csv' satisfies DataSourceAPINodeContent['fileType']}>csv</option>
            <option value={'mp3' satisfies DataSourceAPINodeContent['fileType']}>mp3</option>
            <option value={'pdf' satisfies DataSourceAPINodeContent['fileType']}>pdf</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">URL</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
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
            className="max-w-xs input w-full border-black"
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
            className="max-w-xs textarea w-full overflow-y-scroll border-black py-2"
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
            className="max-w-xs textarea w-full overflow-y-scroll border-black py-2"
            value={nodeContent.body}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, body: newVal }))
            }}
          />
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
