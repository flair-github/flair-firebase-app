import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { NodeHeader } from '~/components/shared/NodeHeader'

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
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '5px',
        width: 400,
      }}
      className="bg-rose-50">
      <NodeHeader title="Conditional Logic" color="rose" withFlair nodeId={data.nodeId} />
      <section className="px-5 pb-5">
        <div className="mb-2 flex">
          <div className="flex-1">
            <div className="mb-2">props</div>
          </div>
          <div className="flex-1 text-right">
            <div className="mb-2">true</div>
            <div className="mb-2">false</div>
          </div>
        </div>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="font-semibold">Formula</span>
          </label>
          <textarea
            rows={6}
            className="max-w-xs textarea w-full overflow-y-scroll border-black py-2"
            value={formula}
            onChange={e => {
              const newVal = e.target.value
              setFormula(newVal)
            }}
            placeholder={`if(if(if(props("Tags") == "Work", true, false),
            dateBetween(props("Due"), 
                props("Today"), "days") <= 14, 
                true),
props("Hours Allotted") > 2, true)
            `}
          />
        </div>
      </section>
      <Handle
        type="target"
        position={Position.Left}
        id="in-ai-data"
        style={{
          top: 95,
          width: 16,
          height: 16,
          left: -8,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out-true"
        style={{
          top: 95,
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
          top: 127,
          width: 16,
          height: 16,
          right: -8,
        }}
      />
    </div>
  )
}
