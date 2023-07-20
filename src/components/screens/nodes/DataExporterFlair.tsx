import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { NodeData, nodeContents } from './Registry'
import { HiDocumentReport } from 'react-icons/hi'

export interface DataExporterFlairNodeContent {
  nodeType: 'data-exporter-flair'
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
        padding: '20px',
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

      <div>
        <div className="fw-bold mb-2">Data Exporter: Flair Hosted</div>
        <div className="mb-2 mt-1">
          <p className="mb-2">
            Workflow job results will be available in the <b>Results</b> page
          </p>
          <a className="btn" href="#" onClick={() => {}}>
            <HiDocumentReport /> Open Results
          </a>
        </div>
      </div>
    </div>
  )
}
