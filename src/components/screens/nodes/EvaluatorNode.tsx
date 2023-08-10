import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'

export interface EvaluatorNodeContent {
  nodeType: 'evaluator'
  strategy: string
}

export const EvaluatorNode = ({ data }: { data: NodeData }) => {
  const [strategy, setStrategy] = useState<string>('hallucination')

  // Initial data
  useEffect(() => {
    if ('strategy' in data.initialContents) {
      setStrategy(data.initialContents.strategy)
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: EvaluatorNodeContent = {
      nodeType: 'evaluator',
      strategy,
    }

    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId, strategy])

  return (
    <div
      style={{
        background: 'white',
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '5px',
        width: 400,
      }}>
      <Handle
        type="target"
        position={Position.Left}
        id="in-ai-data"
        style={{
          top: 82,
          width: 16,
          height: 16,
          left: -8,
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="in-truth-data"
        style={{
          top: 115,
          width: 16,
          height: 16,
          left: -8,
        }}
      />
      <header className="mb-4 flex justify-between items-center bg-pink-200 px-5 py-3 rounded-t-md">
        <div className="fw-bold">Evaluator</div>
        <img src="/images/powered-by-flair.png" width={133} height={24} />
      </header>
      <section className="px-5 pb-5">
        <div className="mb-4 flex">
          <div className="flex-1">
            <div className="mb-2">LLM Generated Data</div>
            <div className="mb-2">Truth Data</div>
          </div>
          <div className="flex-1 text-right">
            <div className="mb-2">Result</div>
          </div>
        </div>
        <div className="my-1">
          <label className="label">
            <span className="label-text">Strategy</span>
          </label>
          <select
            className="max-w-xs select w-full border-black"
            onChange={e => {
              setStrategy(e.target.value)
            }}
            value={strategy}>
            <option value="statistical-measures">Statistical Measures</option>
            <option value="accuracy">Accuracy</option>
            <option value="confusion-matrix">Confusion Matrix</option>
            <option value="rmse">RMSE</option>
            <option value="roc-and-auc">ROC and AUC</option>
            <option value="similarity-measures">Similarity Measures</option>
          </select>
        </div>
      </section>
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{
          top: 82,
          width: 16,
          height: 16,
          right: -8,
        }}
      />
    </div>
  )
}
