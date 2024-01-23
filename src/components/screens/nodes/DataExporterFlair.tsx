import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { NodeData, nodeContents } from './Registry'
import { HiDocumentReport } from 'react-icons/hi'
import { NodeHeader } from '~/components/shared/NodeHeader'
import clsx from 'clsx'

export interface DataExporterFlairNodeContent {
  nodeType: 'data-exporter-flair'
}

export const dataExporterFlairDefaultContent: DataExporterFlairNodeContent = {
  nodeType: 'data-exporter-flair',
}

export const DataExporterFlairNode = ({
  data,
  noHandle,
}: {
  data: NodeData
  noHandle?: boolean
}) => {
  // Initial data
  useEffect(() => {}, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataExporterFlairNodeContent = {
      nodeType: 'data-exporter-flair',
    }

    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId])

  const [isCollapsed, setIsCollapse] = useState(true)

  return (
    <div
      style={{
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '5px',
        width: 400,
      }}
      className="bg-teal-50">
      <NodeHeader
        title="Flair Hosted"
        color="teal"
        nodeId={data.nodeId}
        withFlair
        isCollapsed={isCollapsed}
        toggleCollapse={() => {
          setIsCollapse(x => !x)
        }}
      />
      <section className={clsx(isCollapsed && 'hidden', 'px-5 pb-5')}>
        <div className="mb-2 mt-1">
          <p className="mb-2">
            Pipeline job results will be available in the <b>Results</b> page
          </p>
          {/* <a className="btn" href="#" onClick={() => {}}>
            <HiDocumentReport /> Open Results
          </a> */}
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
