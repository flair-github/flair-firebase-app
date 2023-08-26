import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { BiLogoAws } from 'react-icons/bi'
import { NodeHeader } from '~/components/shared/NodeHeader'

export interface DataSourceS3NodeContent {
  nodeType: 'data-source-s3'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
  accessKey: string
  path: string
  secretKey: string
  bucketName: string
  regionName: string
}

export const dataSourceS3DefaultContent: DataSourceS3NodeContent = {
  nodeType: 'data-source-s3',
  fileType: 'csv',
  accessKey: '',
  path: '',
  secretKey: '',
  bucketName: '',
  regionName: '',
}

export const DataSourceS3Node = ({ data, noHandle }: { data: NodeData; noHandle?: boolean }) => {
  const [nodeContent, setNodeContent] = useState<DataSourceS3NodeContent>(
    dataSourceS3DefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-source-s3') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataSourceS3NodeContent = {
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
      <NodeHeader Icon={BiLogoAws} title="Source: S3" color="purple" />
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">File Type</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataSourceS3NodeContent['fileType']
              setNodeContent(prev => ({ ...prev, fileType: newVal }))
            }}
            value={nodeContent.fileType}>
            <option value={'txt' satisfies DataSourceS3NodeContent['fileType']}>txt</option>
            <option value={'csv' satisfies DataSourceS3NodeContent['fileType']}>csv</option>
            <option value={'mp3' satisfies DataSourceS3NodeContent['fileType']}>mp3</option>
            <option value={'pdf' satisfies DataSourceS3NodeContent['fileType']}>pdf</option>
          </select>
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
            <span className="label-text">Access Key</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={nodeContent.accessKey}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, accessKey: newVal }))
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
