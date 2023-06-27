import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from '../FlowEditor'

export interface DataSourceNodeContent {
  source: string
  dataType: string
  apiKey: string
  path: string
  secretApiKey: string
  bucketName: string
  regionName: string
}

export const DataSourceNode = ({ data }: { data: NodeData }) => {
  const [source, setSource] = useState<string>('aws')
  const [dataType, setDataType] = useState<string>('txt')
  const [apiKey, setApiKey] = useState<string>('')
  const [secretApiKey, setSecretApiKey] = useState<string>('')
  const [bucketName, setBucketName] = useState<string>('')
  const [regionName, setRegionName] = useState<string>('')
  const [path, setPath] = useState<string>('')

  // Initial data
  useEffect(() => {
    if ('source' in data.initialContents) {
      setSource(data.initialContents.source)
    }
    if ('dataType' in data.initialContents) {
      setDataType(data.initialContents.dataType)
    }
    if ('apiKey' in data.initialContents) {
      setApiKey(data.initialContents.apiKey)
    }
    if ('path' in data.initialContents) {
      setPath(data.initialContents.path)
    }
    if ('secretApiKey' in data.initialContents) {
      setSecretApiKey(data.initialContents.secretApiKey)
    }
    if ('bucketName' in data.initialContents) {
      setBucketName(data.initialContents.bucketName)
    }
    if ('regionName' in data.initialContents) {
      setRegionName(data.initialContents.regionName)
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    nodeContents.current[data.nodeId] = {
      source,
      dataType,
      apiKey,
      secretApiKey,
      bucketName,
      regionName,
      path,
    }
  }, [data.nodeId, source, dataType, apiKey, secretApiKey, bucketName, regionName, path])

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
      <div>
        <div className="fw-bold mb-2">Data Source</div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Source</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {
              setSource(e.target.value)
            }}
            value={source}>
            <option value="aws">AWS</option>
            <option value="zendesk">Zendesk</option>
            <option value="gcp-cloud-storage">GCP Cloud Stoarge</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Data Type</span>
          </label>
          <select
            className="max-w-xs select w-full border-black"
            onChange={e => {
              setDataType(e.target.value)
            }}
            value={dataType}>
            <option value="txt">txt</option>
            <option value="csv">csv</option>
            <option value="mp3">mp3</option>
            <option value="pdf">pdf</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">API Key</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={apiKey}
            onChange={e => {
              const newApiKey = e.target.value
              setApiKey(newApiKey)
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Secret Key</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={secretApiKey}
            onChange={e => {
              const newSecretKey = e.target.value
              setSecretApiKey(newSecretKey)
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Bucket Name</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={bucketName}
            onChange={e => {
              const newBucketName = e.target.value
              setBucketName(newBucketName)
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Region Name</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={regionName}
            onChange={e => {
              const newRegionName = e.target.value
              setRegionName(newRegionName)
            }}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Path</span>
          </label>
          <input
            className="max-w-xs input w-full border-black"
            value={path}
            onChange={e => {
              const newPath = e.target.value
              setPath(newPath)
            }}
          />
        </div>
      </div>
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
    </div>
  )
}
