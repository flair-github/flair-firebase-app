import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { NodeHeader } from '~/components/shared/NodeHeader'
import clsx from 'clsx'

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

  const [isCollapsed, setIsCollapse] = useState(true)

  return (
    <div
      style={{
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '5px',
        width: 400,
      }}
      className="bg-pink-50">
      <NodeHeader
        title="Evaluator"
        color="pink"
        withFlair
        nodeId={data.nodeId}
        isCollapsed={isCollapsed}
        toggleCollapse={() => {
          setIsCollapse(x => !x)
        }}
      />
      <section className={clsx(isCollapsed && 'hidden', 'px-5 pb-5')}>
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
            <span className="font-bold">Strategy</span>
          </label>
          <select
            className="select w-full border-black"
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
        type="target"
        position={Position.Left}
        id="in-ai-data"
        style={{
          top: 94,
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
          top: 126,
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
          top: 94,
          width: 16,
          height: 16,
          right: -8,
        }}
      />
    </div>
  )
}
