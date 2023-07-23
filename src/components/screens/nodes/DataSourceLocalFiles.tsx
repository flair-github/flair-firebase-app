import React from 'react'
import { useEffect, useState } from 'react'
import { Handle, Position } from 'reactflow'
import { nodeContents, type NodeData } from './Registry'
import { FaCloudUploadAlt } from 'react-icons/fa'

export interface DataSourceLocalFilesNodeContent {
  nodeType: 'data-source-local-files'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
}

export const dataSourceLocalFilesDefaultContent: DataSourceLocalFilesNodeContent = {
  nodeType: 'data-source-local-files',
  fileType: 'csv',
}

export const DataSourceLocalFilesNode = ({
  data,
  noHandle,
}: {
  data: NodeData
  noHandle?: boolean
}) => {
  const [nodeContent, setNodeContent] = useState<DataSourceLocalFilesNodeContent>(
    dataSourceLocalFilesDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-source-local-files') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataSourceLocalFilesNodeContent = {
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
        borderRadius: '5px',
        padding: '20px',
        width: 400,
      }}>
      <div>
        <div className="fw-bold mb-2">Data Source: Local Files</div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">File Type</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataSourceLocalFilesNodeContent['fileType']
              setNodeContent(prev => ({ ...prev, fileType: newVal }))
            }}
            value={nodeContent.fileType}>
            <option value={'txt' satisfies DataSourceLocalFilesNodeContent['fileType']}>txt</option>
            <option value={'csv' satisfies DataSourceLocalFilesNodeContent['fileType']}>csv</option>
            <option value={'mp3' satisfies DataSourceLocalFilesNodeContent['fileType']}>mp3</option>
            <option value={'pdf' satisfies DataSourceLocalFilesNodeContent['fileType']}>pdf</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Files</span>
          </label>
          <a className="btn" href="#" onClick={() => {}}>
            <FaCloudUploadAlt /> Upload
          </a>
        </div>
      </div>
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
