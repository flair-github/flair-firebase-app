import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { BiLogoPostgresql } from 'react-icons/bi'
import { NodeHeader } from '~/components/shared/NodeHeader'

export interface DataExporterPostgresNodeContent {
  nodeType: 'data-exporter-postgres'
  tableName: string
  connectionString: string
  columnMapping: string
}

export const dataExporterPostgresDefaultContent: DataExporterPostgresNodeContent = {
  nodeType: 'data-exporter-postgres',
  tableName: '',
  connectionString: '',
  columnMapping: '',
}

export const DataExporterPostgresNode = ({
  data,
  noHandle,
}: {
  data: NodeData
  noHandle?: boolean
}) => {
  const [nodeContent, setNodeContent] = useState<DataExporterPostgresNodeContent>(
    dataExporterPostgresDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-exporter-postgres') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataExporterPostgresNodeContent = {
      ...nodeContent,
    }

    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId, nodeContent])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setNodeContent(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  return (
    <div
      style={{
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '6px',
        width: 600,
      }}
      className="bg-teal-50">
      <NodeHeader
        Icon={BiLogoPostgresql}
        title="Exporter: Postgres"
        color="teal"
        nodeId={data.nodeId}
      />
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Connection String</span>
          </label>
          <textarea
            rows={2}
            className="max-w-xs textarea w-full overflow-y-scroll border-black py-2"
            name={'connectionString'}
            value={nodeContent.connectionString}
            onChange={handleChange}
            placeholder={'postgres://your_username:your_password@your_host:your_port/your_database'}
          />
        </div>

        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-bold">Table Name</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            name={'tableName'}
            value={nodeContent.tableName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2 mt-1 text-center">
          <label className="label">
            <span className="font-bold">Column Mapping</span>
          </label>
          <button type="button" className="min-w-30 btn btn-primary m-2 normal-case">
            Auto-map
          </button>
          <button type="button" className="min-w-30 btn btn-primary m-3 normal-case">
            Manual
          </button>
          {/* <textarea
            rows={4}
            className="max-w-xs textarea w-full overflow-y-scroll border-black py-2"
            name={'columnMapping'}
            value={nodeContent.columnMapping}
            onChange={handleChange}
            placeholder={`{
  "table_row_name": "output_header_name",
  "table_row_name": "output_header_name",
}`}
          /> */}
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
