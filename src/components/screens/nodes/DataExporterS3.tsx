import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { BiLogoAws } from 'react-icons/bi'
import { NodeHeader } from '~/components/shared/NodeHeader'
import { useAtomValue } from 'jotai'
import { atomNodeExportedKeys } from '~/jotai/jotai'
import { edgesAtom } from '../FlowEditor'
import clsx from 'clsx'

export interface DataExporterS3NodeContent {
  nodeType: 'data-exporter-s3'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
  accessKey: string
  path: string
  secretKey: string
  bucketName: string
  regionName: string
  importedKeys: Record<string, boolean>
}

export const dataExporterS3DefaultContent: DataExporterS3NodeContent = {
  nodeType: 'data-exporter-s3',
  fileType: 'csv',
  accessKey: '',
  path: '',
  secretKey: '',
  bucketName: '',
  regionName: '',
  importedKeys: {},
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

  const nodeExportedKeys = useAtomValue(atomNodeExportedKeys)
  const edges = useAtomValue(edgesAtom)

  const keyOptions = React.useMemo(() => {
    let newKeys: Record<string, boolean> = {}

    const recursiveAssign = (nodeId: string) => {
      const keyEdges = edges.filter(({ target }) => target === nodeId)
      keyEdges.forEach(kE => {
        newKeys = Object.assign(newKeys, nodeExportedKeys[kE.source] ?? {})
        recursiveAssign(kE.source) // Recursive call
      })
    }

    recursiveAssign(data.nodeId) // Start recursion from the initial nodeId

    return newKeys
  }, [edges, data.nodeId, nodeExportedKeys])

  useEffect(() => {
    setNodeContent(prev => ({ ...prev, importedKeys: keyOptions }))
  }, [keyOptions])

  const [isCollapsed, setIsCollapse] = useState(true)

  return (
    <div
      style={{
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '6px',
        width: 400,
      }}
      className="bg-teal-50">
      <NodeHeader
        Icon={BiLogoAws}
        title="Exporter: S3"
        color="teal"
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
        <div className="mb-4 mt-1">
          <label className="label">
            <span className="font-semibold">Keys</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(keyOptions ? keyOptions : {}).map(localKey => (
              <div key={localKey} className="join border">
                <span className="join-item flex grow items-center overflow-x-hidden bg-white px-3 text-black">
                  <p className="overflow-x-hidden text-ellipsis whitespace-nowrap">{localKey}</p>
                </span>
                <input
                  type="checkbox"
                  className="checkbox join-item px-1"
                  checked={(nodeContent.importedKeys ?? {})[localKey]}
                  onChange={() => {
                    setNodeContent(prev => {
                      const newImportedKeys = { ...prev.importedKeys }
                      if (newImportedKeys[localKey]) {
                        newImportedKeys[localKey] = false
                      } else {
                        newImportedKeys[localKey] = true
                      }
                      return { ...prev, importedKeys: newImportedKeys }
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
