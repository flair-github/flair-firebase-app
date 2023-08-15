import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { NodeData, nodeContents } from './Registry'
import { HiDocumentReport } from 'react-icons/hi'

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

  return (
    <div
      style={{
        background: 'white',
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '5px',
        width: 400,
      }}>
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
      <header className="mb-4 flex items-center justify-between rounded-t-md bg-teal-200 px-5 py-3">
        <div className="fw-bold">Data Exporter : Flair Hosted</div>
        <img src="/images/powered-by-flair.png" width={133} height={24} />
      </header>
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <p className="mb-2">
            Workflow job results will be available in the <b>Results</b> page
          </p>
          {/* <a className="btn" href="#" onClick={() => {}}>
            <HiDocumentReport /> Open Results
          </a> */}
        </div>
      </section>
    </div>
  )
}
