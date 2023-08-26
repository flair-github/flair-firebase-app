import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { BiLogoMicrosoft } from 'react-icons/bi'
import { NodeHeader } from '~/components/shared/NodeHeader'

export interface DataExporterAzureNodeContent {
  nodeType: 'data-exporter-azure'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
  accountName: string
  accountKey: string
  containerName: string
  path: string
}

export const dataExporterAzureDefaultContent: DataExporterAzureNodeContent = {
  nodeType: 'data-exporter-azure',
  fileType: 'csv',
  accountName: '',
  accountKey: '',
  containerName: '',
  path: '',
}

export const DataExporterAzureNode = ({
  data,
  noHandle,
}: {
  data: NodeData
  noHandle?: boolean
}) => {
  const [nodeContent, setNodeContent] = useState<DataExporterAzureNodeContent>(
    dataExporterAzureDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-exporter-azure') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataExporterAzureNodeContent = {
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
      }}
      className="bg-teal-50">
      <NodeHeader
        Icon={BiLogoMicrosoft}
        title="Exporter: Azure Blob Storage"
        color="teal"
        nodeId={data.nodeId}
      />
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-semibold">File Type</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataExporterAzureNodeContent['fileType']
              setNodeContent(prev => ({ ...prev, fileType: newVal }))
            }}
            value={nodeContent.fileType}>
            <option value={'txt' satisfies DataExporterAzureNodeContent['fileType']}>txt</option>
            <option value={'csv' satisfies DataExporterAzureNodeContent['fileType']}>csv</option>
            <option value={'mp3' satisfies DataExporterAzureNodeContent['fileType']}>mp3</option>
            <option value={'pdf' satisfies DataExporterAzureNodeContent['fileType']}>pdf</option>
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
