import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'

export interface ConditionalLogicNodeContent {
  nodeType: 'conditional-logic'
  formula: string
}

export const ConditionalLogicNode = ({ data }: { data: NodeData }) => {
  const [formula, setFormula] = useState<string>('')

  // Initial data
  useEffect(() => {
    if ('formula' in data.initialContents) {
      setFormula(data.initialContents.formula)
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: ConditionalLogicNodeContent = {
      nodeType: 'conditional-logic',
      formula,
    }

    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId, formula])

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
      <header className="mb-4 flex items-center justify-between rounded-t-md bg-rose-200 px-5 py-3 font-bold">
        <div className="fw-bold">Conditional Logic</div>
        <img src="/images/powered-by-flair.png" width={133} height={24} />
      </header>
      <section className="px-5 pb-5">
        <div className="mb-4 flex">
          <div className="flex-1">
            <div className="mb-2">Props</div>
          </div>
          <div className="flex-1 text-right">
            <div className="mb-2">true</div>
            <div className="mb-2">false</div>
          </div>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Formula</span>
          </label>
          <textarea
            rows={6}
            className="max-w-xs textarea w-full overflow-y-scroll border-black py-2"
            value={formula}
            onChange={e => {
              const newVal = e.target.value
              setFormula(newVal)
            }}
            placeholder={`if(if(if(Props("Tags") == "Work", true, false),
            dateBetween(Props("Due"), 
                Props("Today"), "days") <= 14, 
                true),
Props("Hours Allotted") > 2, true)
            `}
          />
        </div>
      </section>
      <Handle
        type="source"
        position={Position.Right}
        id="out-true"
        style={{
          top: 82,
          width: 16,
          height: 16,
          right: -8,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out-false"
        style={{
          top: 115,
          width: 16,
          height: 16,
          right: -8,
        }}
      />
    </div>
  )
}
