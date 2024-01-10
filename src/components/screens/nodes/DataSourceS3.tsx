import React, { type MutableRefObject, useEffect, useState, useRef, LegacyRef } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { BiLogoAws } from 'react-icons/bi'
import { NodeHeader } from '~/components/shared/NodeHeader'
import { useAtom } from 'jotai'
import { atomNodeExportedKeys } from '~/jotai/jotai'

export interface DataSourceS3NodeContent {
  nodeType: 'data-source-s3'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
  accessKey: string
  path: string
  secretKey: string
  bucketName: string
  regionName: string
  exportedKeys: Record<string, boolean>
}

export const dataSourceS3DefaultContent: DataSourceS3NodeContent = {
  nodeType: 'data-source-s3',
  fileType: 'csv',
  accessKey: '',
  path: '',
  secretKey: '',
  bucketName: '',
  regionName: '',
  exportedKeys: {},
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

  const keyInputRef = useRef<HTMLInputElement>()

  const [_, setNodeExportedKeys] = useAtom(atomNodeExportedKeys)
  React.useEffect(() => {
    setNodeExportedKeys(prev => ({ ...prev, [data.nodeId]: nodeContent.exportedKeys }))
  }, [data.nodeId, nodeContent.exportedKeys, setNodeExportedKeys])

  return (
    <div
      style={{
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '6px',
        width: 400,
      }}
      className="bg-purple-50">
      <NodeHeader Icon={BiLogoAws} title="Source: S3" color="purple" nodeId={data.nodeId} />
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">File Type</span>
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
            <span className="font-bold">Secret Key</span>
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
            <span className="font-bold">Access Key</span>
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
            <span className="font-bold">Region Name</span>
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
            <span className="font-bold">Bucket Name</span>
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
            <span className="font-bold">Path</span>
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
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-semibold">Keys</span>
          </label>
          <div className="join w-full">
            <input
              ref={keyInputRef as LegacyRef<HTMLInputElement>}
              className="input join-item input-bordered grow border-black"
              placeholder="New Key"
            />
            <button
              className="btn btn-ghost join-item border-black"
              onClick={() => {
                keyInputRef.current
                setNodeContent(prev => ({
                  ...prev,
                  exportedKeys: { ...prev.exportedKeys, [keyInputRef.current!.value]: true },
                }))
                setTimeout(() => {
                  keyInputRef.current!.value = ''
                }, 10)
              }}>
              Add
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {Object.keys(nodeContent.exportedKeys ? nodeContent.exportedKeys : {}).map(localKey => (
              <div key={localKey} className="join border">
                <span className="join-item flex grow items-center overflow-x-hidden bg-white px-3 text-black">
                  <p className="overflow-x-hidden text-ellipsis whitespace-nowrap">{localKey}</p>
                </span>
                <button
                  className="btn join-item btn-sm px-1"
                  onClick={() => {
                    setNodeContent(prev => {
                      const newExportedKeys = { ...prev.exportedKeys }
                      delete newExportedKeys[localKey]
                      return {
                        ...prev,
                        exportedKeys: newExportedKeys,
                      }
                    })
                  }}>
                  <GrFormClose className="h-6 w-6" />
                </button>
              </div>
            ))}
          </div>
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
