import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { BiLogoGoogle } from 'react-icons/bi'
import { NodeHeader } from '~/components/shared/NodeHeader'

export interface DataExporterGCPNodeContent {
  nodeType: 'data-exporter-gcp'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
  accountKey: string
  bucketName: string
  path: string
}

export const dataExporterGCPDefaultContent: DataExporterGCPNodeContent = {
  nodeType: 'data-exporter-gcp',
  fileType: 'csv',
  accountKey: '',
  bucketName: '',
  path: '',
}

export const DataExporterGCPNode = ({ data, noHandle }: { data: NodeData; noHandle?: boolean }) => {
  const [nodeContent, setNodeContent] = useState<DataExporterGCPNodeContent>(
    dataExporterGCPDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-exporter-gcp') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataExporterGCPNodeContent = {
      ...nodeContent,
    }

    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId, nodeContent])

  return (
    <div
      style={{
        background: 'white',
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '6px',
        width: 400,
      }}>
      <NodeHeader Icon={BiLogoGoogle} title="Exporter: Google Cloud Storage" color="teal" />
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">File Type</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataExporterGCPNodeContent['fileType']
              setNodeContent(prev => ({ ...prev, fileType: newVal }))
            }}
            value={nodeContent.fileType}>
            <option value={'txt' satisfies DataExporterGCPNodeContent['fileType']}>txt</option>
            <option value={'csv' satisfies DataExporterGCPNodeContent['fileType']}>csv</option>
            <option value={'mp3' satisfies DataExporterGCPNodeContent['fileType']}>mp3</option>
            <option value={'pdf' satisfies DataExporterGCPNodeContent['fileType']}>pdf</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Service Account Key</span>
          </label>
          <textarea
            rows={6}
            className="max-w-xs textarea w-full overflow-y-scroll border-black py-2"
            value={nodeContent.accountKey}
            onChange={e => {
              const newVal = e.target.value
              setNodeContent(prev => ({ ...prev, accountKey: newVal }))
            }}
            placeholder={`{
              "type": "service_account",
              "project_id": "yourProjectId",
              "private_key_id": "yourPrivateKeyId",
              "private_key": "-----BEGIN PRIVATE KEY-----
            11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111=
            -----END PRIVATE KEY-----
            ",
              "client_email": "google-adminsdk-pxixy@somethinggooglerelated.iam.gserviceaccount.com",
              "client_id": "111111111111111111111",
              "auth_uri": "https://accounts.google.com/o/oauth2/auth",
              "token_uri": "https://oauth2.googleapis.com/token",
              "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
              "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/google-adminsdk-pxixy%40somethinggooglerelated.iam.gserviceaccount.com"
            }`}
          />
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Bucket Name</span>
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
            <span className="label-text">Path</span>
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
