import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { BiLogoMicrosoft } from 'react-icons/bi'

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
        background: 'white',
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '6px',
        width: 400,
      }}>
      <header className="fw-bold mb-2 flex items-center rounded-t-md bg-purple-200 px-5 py-3">
        <BiLogoMicrosoft className="h-7 w-7" />
        <h4 className="ml-3 grow">Data Source: Azure Blob Storage</h4>
      </header>
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">File Type</span>
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
            <span className="label-text">Account Name</span>
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
            <span className="label-text">Account Key</span>
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
            <span className="label-text">Container Name</span>
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
            <span className="label-text">Path</span>
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
