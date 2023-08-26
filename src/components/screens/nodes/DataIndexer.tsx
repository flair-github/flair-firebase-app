import React from 'react'
import { useEffect, useState } from 'react'
import { Handle, Position } from 'reactflow'
import { nodeContents, type NodeData } from './Registry'
import { AiOutlineNodeIndex } from 'react-icons/ai'
import { NodeHeader } from '~/components/shared/NodeHeader'

export interface DataIndexerNodeContent {
  nodeType: 'data-indexer'
  embeddingType: 'bert' | 'cohere' | 'gpt'
  indexStrategy: 'default' | 'HyDE'
  vectorStore: 'pinecone' | 'faiss' | 'local'
}

export const dataIndexerDefaultContent: DataIndexerNodeContent = {
  nodeType: 'data-indexer',
  embeddingType: 'gpt',
  indexStrategy: 'default',
  vectorStore: 'pinecone',
}

export const DataIndexerNode = ({ data }: { data: NodeData }) => {
  const [nodeContent, setNodeContent] = useState<DataIndexerNodeContent>(dataIndexerDefaultContent)

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-indexer') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: DataIndexerNodeContent = {
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
        borderRadius: '5px',
        width: 400,
      }}>
      <NodeHeader Icon={AiOutlineNodeIndex} title="Data Indexer" color="green" />
      <section className="px-5 pb-5">
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Embedding Type</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataIndexerNodeContent['embeddingType']
              setNodeContent(prev => ({ ...prev, embeddingType: newVal }))
            }}
            value={nodeContent.embeddingType}>
            <option value={'bert' satisfies DataIndexerNodeContent['embeddingType']}>bert</option>
            <option value={'cohere' satisfies DataIndexerNodeContent['embeddingType']}>
              cohere
            </option>
            <option value={'gpt' satisfies DataIndexerNodeContent['embeddingType']}>gpt</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Index Strategy</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataIndexerNodeContent['indexStrategy']
              setNodeContent(prev => ({ ...prev, indexStrategy: newVal }))
            }}
            value={nodeContent.indexStrategy}>
            <option value={'default' satisfies DataIndexerNodeContent['indexStrategy']}>
              default
            </option>
            <option value={'HyDE' satisfies DataIndexerNodeContent['indexStrategy']}>HyDE</option>
          </select>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Vector Store</span>
          </label>
          <select
            className="max-w-xs select w-full border-black "
            onChange={e => {
              const newVal = e.target.value as DataIndexerNodeContent['vectorStore']
              setNodeContent(prev => ({ ...prev, vectorStore: newVal }))
            }}
            value={nodeContent.vectorStore}>
            <option value={'pinecone' satisfies DataIndexerNodeContent['vectorStore']}>
              pinecone
            </option>
            <option value={'faiss' satisfies DataIndexerNodeContent['vectorStore']}>faiss</option>
            <option value={'local' satisfies DataIndexerNodeContent['vectorStore']}>local</option>
          </select>
        </div>
      </section>
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
