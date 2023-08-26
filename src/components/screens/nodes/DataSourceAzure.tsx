import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { BiLogoMicrosoft } from 'react-icons/bi'
import { NodeHeader } from '~/components/shared/NodeHeader'

export interface DataSourceAzureNodeContent {
  nodeType: 'data-source-azure'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
  accountName: string
  accountKey: string
  containerName: string
  path: string
}

export const dataSourceAzureDefaultContent: DataSourceAzureNodeContent = {
  nodeType: 'data-source-azure',
  fileType: 'csv',
  accountName: '',
  accountKey: '',
  containerName: '',
  path: '',
}

export const DataSourceAzureNode = ({ data, noHandle }: { data: NodeData; noHandle?: boolean }) => {
  const [nodeContent, setNodeContent] = useState<DataSourceAzureNodeContent>(
    dataSourceAzureDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-source-azure') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataSourceAzureNodeContent = {
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
      <NodeHeader Icon={BiLogoMicrosoft} title="Source: Azure Blob Storage" color="purple" />
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-semibold">File Type</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataSourceAzureNodeContent['fileType']
              setNodeContent(prev => ({ ...prev, fileType: newVal }))
            }}
            value={nodeContent.fileType}>
            <option value={'txt' satisfies DataSourceAzureNodeContent['fileType']}>txt</option>
            <option value={'csv' satisfies DataSourceAzureNodeContent['fileType']}>csv</option>
            <option value={'mp3' satisfies DataSourceAzureNodeContent['fileType']}>mp3</option>
            <option value={'pdf' satisfies DataSourceAzureNodeContent['fileType']}>pdf</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-semibold">Account Name</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.accountName}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, accountName: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-semibold">Account Key</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.accountKey}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, accountKey: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-semibold">Container Name</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.containerName}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, containerName: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-semibold">Path</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.path}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, path: newVal }))
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
