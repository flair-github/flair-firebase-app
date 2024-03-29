import React from 'react'
import { useEffect, useState } from 'react'
import { Handle, Position } from 'reactflow'
import { nodeContents, type NodeData } from './Registry'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { useDropzone } from 'react-dropzone'
import { NodeHeader } from '~/components/shared/NodeHeader'
import clsx from 'clsx'

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
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

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
        Icon={FaCloudUploadAlt}
        title="Source: Local Files"
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
            className="select w-full border-black "
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
            <span className="font-bold">Files</span>
          </label>
          <section className="container">
            <div {...getRootProps()} className="mb-2 border-2 border-dashed bg-slate-100 p-4">
              <input {...getInputProps()} />
              <p>Drag and drop files here, or click to select files</p>
            </div>
            {acceptedFiles.length > 0 && (
              <div className="max-h-28 overflow-y-auto border p-2">
                <ul>
                  {acceptedFiles.map(file => (
                    <li key={file.name}>
                      <div className="flex space-x-2">
                        <div className="flex-1 truncate font-bold">{file.name}</div>
                        <div>{Math.ceil(file.size / 1000) / 1000} MB</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* <a className="btn" href="#" onClick={() => {}}>
            <FaCloudUploadAlt /> Upload
          </a> */}
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
