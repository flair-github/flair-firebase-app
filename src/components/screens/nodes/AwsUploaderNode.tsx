import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from '../FlowEditor'

export interface AwsUploaderNodeContent {
  apiKey: string
  path: string
  period: string
}

export const AwsUploaderNode = ({ data }: { data: NodeData }) => {
  const [apiKey, setApiKey] = useState<string>('')
  const [path, setPath] = useState<string>('')
  const [period, setPeriod] = useState<string>('daily')

  // Initial data
  useEffect(() => {
    if ('apiKey' in data.initialContents) {
      setApiKey(data.initialContents.apiKey)
    }
    if ('path' in data.initialContents) {
      setPath(data.initialContents.path)
    }
    if ('period' in data.initialContents) {
      setPeriod(data.initialContents.period)
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    nodeContents.current[data.nodeId] = {
      path,
      period,
      apiKey,
    }
  }, [data.nodeId, path, period, apiKey])

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

      <div>
        <div className="fw-bold mb-2">AWS Uploader</div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">API Key</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            type="text"
            value={apiKey}
            onChange={e => {
              const newApiKey = e.target.value
              setApiKey(newApiKey)
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Path</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            type="text"
            value={path}
            onChange={e => {
              const newPath = e.target.value
              setPath(newPath)
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Period</span>
          </label>

          <select
            className="max-w-xs select w-full border-black"
            value={period}
            onChange={e => {
              setPeriod(e.target.value)
            }}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>
    </div>
  )
}