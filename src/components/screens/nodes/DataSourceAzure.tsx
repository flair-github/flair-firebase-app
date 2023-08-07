import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { BiLogoMicrosoft, BiX } from 'react-icons/bi'

export interface DataSourceAzureNodeContent {
  nodeType: 'data-source-azure'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
  apiKey: string
  path: string
  secretKey: string
  bucketName: string
  regionName: string
}

export const dataSourceAzureDefaultContent: DataSourceAzureNodeContent = {
  nodeType: 'data-source-azure',
  fileType: 'csv',
  apiKey: '',
  path: '',
  secretKey: '',
  bucketName: '',
  regionName: '',
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
      <header className="fw-bold mb-2 flex items-center bg-primary-content px-5 py-3 rounded-t-md">
        <BiLogoMicrosoft className="w-7 h-7" />
        <h4 className="grow ml-3">Data Source: Azure Blob Storage</h4>
        <BiX className="w-6 h-6 cursor-pointer" onClick={() => {}} />
      </header>{' '}
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
            <span className="label-text">API Key</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.apiKey}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, apiKey: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Secret Key</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.secretKey}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, secretKey: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Bucket Name</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.bucketName}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, bucketName: newVal }))
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Region Name</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.regionName}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, regionName: newVal }))
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
            padding: '0px 20px 20px 20px;',
          }}
        />
      )}
    </div>
  )
}
