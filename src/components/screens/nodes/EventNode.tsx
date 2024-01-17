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
import { FaEllipsisH } from 'react-icons/fa'

export interface EventNodeContent {
  nodeType: 'event-node'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
  accessKey: string
  path: string
  secretKey: string
  bucketName: string
  regionName: string
  importedKeys: Record<string, boolean>
}

export const eventNodeDefaultContent: EventNodeContent = {
  nodeType: 'event-node',
  fileType: 'csv',
  accessKey: '',
  path: '',
  secretKey: '',
  bucketName: '',
  regionName: '',
  importedKeys: {},
}

export const EventNode = ({ data, noHandle }: { data: NodeData; noHandle?: boolean }) => {
  const [nodeContent, setNodeContent] = useState<EventNodeContent>(eventNodeDefaultContent)

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'event-node') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: EventNodeContent = {
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
        width: 400,
      }}
      className="rounded-md border border-slate-300 bg-white p-3 shadow-md">
      <div className="flex items-center gap-4">
        <img src="/images/data-sources/s3.svg" width={45} height={45} />
        <div>
          <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Event
          </span>
          <div className="text-lg font-medium">New CSV Row in S3</div>
        </div>
        <div className="flex-1" />
        <FaEllipsisH />
      </div>
      {!noHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            bottom: -8,
            width: 14,
            height: 14,
            background: 'rgb(148 163 184)',
          }}
          id="in"
        />
      )}
      {!noHandle && (
        <Handle
          type="target"
          position={Position.Top}
          style={{
            top: -7,
            width: 14,
            height: 14,
            background: 'rgb(148 163 184)',
          }}
          id="out"
        />
      )}
    </div>
  )
}
