import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { BiLogoAws } from 'react-icons/bi'
import { NodeHeader } from '~/components/shared/NodeHeader'
import { useAtomValue } from 'jotai'
import { atomNodeKeys } from '~/jotai/jotai'
import { edgesAtom } from '../FlowEditor'

export interface DataExporterS3NodeContent {
  nodeType: 'data-exporter-s3'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
  accessKey: string
  path: string
  secretKey: string
  bucketName: string
  regionName: string
  keys: string[]
}

export const dataExporterS3DefaultContent: DataExporterS3NodeContent = {
  nodeType: 'data-exporter-s3',
  fileType: 'csv',
  accessKey: '',
  path: '',
  secretKey: '',
  bucketName: '',
  regionName: '',
  keys: [],
}

export const DataExporterS3Node = ({ data, noHandle }: { data: NodeData; noHandle?: boolean }) => {
  const [nodeContent, setNodeContent] = useState<DataExporterS3NodeContent>(
    dataExporterS3DefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-exporter-s3') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataExporterS3NodeContent = {
      ...nodeContent,
    }

    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId, nodeContent])

  const nodeKeys = useAtomValue(atomNodeKeys)
  const edges = useAtomValue(edgesAtom)

  const keyOptions = React.useMemo(() => {
    const keyEdges = edges.filter(({ target }) => target === data.nodeId)
    let newKeys: string[] = []
    keyEdges.forEach(kE => {
      newKeys = newKeys.concat(nodeKeys[kE.source] ?? [])
    })
    return newKeys
  }, [edges, data.nodeId, nodeKeys])

  return (
    <div
      style={{
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '6px',
        width: 400,
      }}
      className="bg-teal-50">
      <NodeHeader Icon={BiLogoAws} title="Exporter: S3" color="teal" nodeId={data.nodeId} />
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-semibold">File Type</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataExporterS3NodeContent['fileType']
              setNodeContent(prev => ({ ...prev, fileType: newVal }))
            }}
            value={nodeContent.fileType}>
            <option value={'txt' satisfies DataExporterS3NodeContent['fileType']}>txt</option>
            <option value={'csv' satisfies DataExporterS3NodeContent['fileType']}>csv</option>
            <option value={'mp3' satisfies DataExporterS3NodeContent['fileType']}>mp3</option>
            <option value={'pdf' satisfies DataExporterS3NodeContent['fileType']}>pdf</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-semibold">Secret Key</span>
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
            <span className="font-semibold">Access Key</span>
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
            <span className="font-semibold">Region Name</span>
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
            <span className="font-semibold">Bucket Name</span>
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
        <div className="mb-4 mt-1">
          <label className="label">
            <span className="font-semibold">Keys</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {keyOptions.map(localKey => (
              <div key={localKey} className="join border">
                <span className="join-item flex grow items-center overflow-x-hidden bg-white px-3 text-black">
                  <p className="overflow-x-hidden text-ellipsis whitespace-nowrap">{localKey}</p>
                </span>
                <input
                  type="checkbox"
                  checked={nodeContent.keys?.includes(localKey)}
                  className="checkbox join-item px-1"
                  onChange={() => {
                    setNodeContent(prev => {
                      if (!prev.keys) {
                        return { ...prev, keys: [localKey] }
                      }
                      return prev.keys.includes(localKey)
                        ? { ...prev, keys: prev.keys.filter(key => key !== localKey) }
                        : { ...prev, keys: [...prev.keys, localKey] }
                    })
                  }}
                />
              </div>
            ))}
          </div>
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
