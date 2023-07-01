import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from '../FlowEditor'
import { v4 } from 'uuid'

type ColumnContent =
  | {
      columnId: string
      name: string
      type: 'text'
      promptStrategy: string
      instruction: string
      prompt: string
    }
  | {
      columnId: string
      name: string
      type: 'list'
      promptStrategy: string
      instruction: string
      prompt: string
    }
  | {
      columnId: string
      name: string
      type: 'category'
      /** comma seperated */
      options: string
      promptStrategy: string
      instruction: string
      prompt: string
    }
  | {
      name: string
      columnId: string
      type: 'number'
      min: number
      max: number
      promptStrategy: string
      instruction: string
      prompt: string
    }

export interface LLMProcessorNodeContent {
  nodeType: 'llm-processor'
  columns: Array<ColumnContent>
}

export const llmProcessorNodeContents: MutableRefObject<{ [id: string]: LLMProcessorNodeContent }> =
  {
    current: {},
  }

export const LLMProcessorNode = ({ data }: { data: NodeData }) => {
  const [columns, setColumns] = useState<LLMProcessorNodeContent['columns']>([])

  // Initial data
  useEffect(() => {
    if (data.initialContents?.nodeType !== 'llm-processor') {
      return
    }

    setColumns(JSON.parse(JSON.stringify(data.initialContents.columns)))
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: LLMProcessorNodeContent = {
      nodeType: 'llm-processor',
      columns: columns,
    }

    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId, columns])

  return (
    <div
      style={{
        background: 'white',
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '5px',
        padding: '20px',
        width: 800,
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
        <div className="mb-4 flex justify-between">
          <div className="fw-bold">LLM Processor</div>
          <img src="/images/powered-by-flair.png" width={133} height={24} />
        </div>
        <div className="mb-1 flex">
          {/* Col */}
          <div className="mr-2 flex w-14 items-center" />

          {/* Name */}
          <div className="mr-2 flex-1 font-semibold">Column Name</div>

          {/* Edit Prompt */}
          <div className="mr-2 flex w-32 items-center" />

          <div className="ml-2 flex w-10 items-center justify-center" />
        </div>
        {columns.map((el, index) => (
          <div key={el.columnId} className="mb-1 flex">
            {/* Col */}
            <div className="mr-2 flex w-14 items-center font-semibold">
              <div>Col {index + 1}</div>
            </div>

            {/* Name */}
            <div className="mr-2 flex-1">
              <input
                type="text"
                className="input w-full"
                value={el.name}
                onChange={e => {
                  const newName = e.target.value

                  if (typeof newName !== 'string') {
                    return
                  }

                  setColumns(prev => {
                    const newColumns = [...prev]
                    newColumns[index].name = newName
                    return newColumns
                  })
                }}
                style={{ borderColor: 'black', resize: 'none' }}
              />
            </div>

            {/* Edit Prompt */}
            <div className="mr-2 flex w-32 items-center">
              <button
                className="btn"
                onClick={() => (window as any)['edit-prompt-' + el.columnId].showModal()}>
                Edit Prompt
              </button>
            </div>

            {/* Edit Prompt Modal */}
            <dialog id={'edit-prompt-' + el.columnId} className="modal">
              <form method="dialog" className="modal-box">
                <h3 className="text-lg font-bold">Edit Prompt: {el.name}</h3>

                {/* Instruction */}
                <label className="label">
                  <span className="label-text">Instruction</span>
                </label>
                <textarea
                  className="textarea-bordered textarea mb-3 w-full"
                  rows={2}
                  value={el.instruction}
                  onChange={e => {
                    const newText = e.target.value

                    if (typeof newText !== 'string') {
                      return
                    }

                    setColumns(prev => {
                      const newColumns = [...prev]
                      newColumns[index].instruction = newText
                      return newColumns
                    })
                  }}
                  style={{ borderColor: 'black', resize: 'none' }}
                />

                {/* Prompt */}
                <label className="label">
                  <span className="label-text">Prompt</span>
                </label>
                <textarea
                  className="textarea-bordered textarea mb-3 w-full"
                  rows={2}
                  value={el.prompt}
                  onChange={e => {
                    const newText = e.target.value

                    if (typeof newText !== 'string') {
                      return
                    }

                    setColumns(prev => {
                      const newColumns = [...prev]
                      newColumns[index].prompt = newText
                      return newColumns
                    })
                  }}
                  style={{ borderColor: 'black', resize: 'none' }}
                />

                {/* Prompt Strategy */}
                <label className="label">
                  <span className="label-text">Prompt Strategy</span>
                </label>
                <select
                  value={el.promptStrategy}
                  className="max-w-xs select mb-3 w-full border-black"
                  onChange={e => {
                    const newValue = e.target.value

                    if (typeof newValue !== 'string') {
                      return
                    }

                    setColumns(prev => {
                      const newColumns = [...prev]
                      newColumns[index].promptStrategy = newValue as ColumnContent['promptStrategy']
                      return newColumns
                    })
                  }}>
                  <option value={'default' satisfies ColumnContent['promptStrategy']}>
                    Default
                  </option>
                  <option value={'cot' satisfies ColumnContent['promptStrategy']}>CoT</option>
                  <option value={'consistency' satisfies ColumnContent['promptStrategy']}>
                    Consistency
                  </option>
                </select>

                {/* Result Type */}
                <label className="label">
                  <span className="label-text">Result Type</span>
                </label>
                <select
                  value={el.type}
                  className="max-w-xs select mb-3 w-full border-black"
                  onChange={e => {
                    const newValue = e.target.value

                    if (typeof newValue !== 'string') {
                      return
                    }

                    setColumns(prev => {
                      const newColumns = [...prev]
                      newColumns[index].type = newValue as ColumnContent['type']
                      return newColumns
                    })
                  }}>
                  <option value={'text' satisfies ColumnContent['type']}>Text</option>
                  <option value={'list' satisfies ColumnContent['type']}>List</option>
                  <option value={'number' satisfies ColumnContent['type']}>Number</option>
                  <option value={'category' satisfies ColumnContent['type']}>Category</option>
                </select>

                {el.type === 'category' && (
                  <>
                    {/* Categories */}
                    <label className="label">
                      <span className="label-text">Categories (comma seperated)</span>
                    </label>
                    <textarea
                      className="textarea-bordered textarea mb-3 w-full"
                      rows={2}
                      value={el.options}
                      onChange={e => {
                        const newText = e.target.value

                        if (typeof newText !== 'string') {
                          return
                        }

                        setColumns(prev => {
                          const newColumns = [...prev]
                          const newColumn = newColumns[index]

                          if (newColumn.type === 'category') {
                            newColumn.options = newText
                          }

                          return newColumns
                        })
                      }}
                      style={{ borderColor: 'black', resize: 'none' }}
                    />
                  </>
                )}

                {el.type === 'number' && (
                  <>
                    <div className="flex">
                      <div className="mr-1 flex-1">
                        <label className="label">
                          <span className="label-text">Min</span>
                        </label>
                        <input
                          type="text"
                          pattern="[0-9]*"
                          className="input mb-3 w-full border-black"
                          value={el.min}
                          onChange={e => {
                            const newText = e.target.value as any
                            const newNum = Number(newText)

                            setColumns(prev => {
                              const newColumns = [...prev]
                              const newColumn = newColumns[index]

                              if (newColumn.type === 'number') {
                                if (isFinite(newNum)) {
                                  newColumn.min = newNum
                                } else {
                                  newColumn.min = 0
                                }
                              }

                              return newColumns
                            })
                          }}
                          style={{ borderColor: 'black', resize: 'none' }}
                        />
                      </div>
                      <div className="ml-1 flex-1">
                        <label className="label">
                          <span className="label-text">Max</span>
                        </label>
                        <input
                          type="text"
                          pattern="[0-9]*"
                          className="input mb-3 w-full border-black"
                          value={el.max}
                          onChange={e => {
                            const newText = e.target.value as any
                            const newNum = Number(newText)

                            setColumns(prev => {
                              const newColumns = [...prev]
                              const newColumn = newColumns[index]

                              if (newColumn.type === 'number') {
                                if (isFinite(newNum)) {
                                  newColumn.max = newNum
                                } else {
                                  newColumn.max = 0
                                }
                              }

                              return newColumns
                            })
                          }}
                          style={{ borderColor: 'black', resize: 'none' }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="modal-action">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </div>
              </form>
            </dialog>

            {/* Delete Button */}
            <div
              className="ml-2 flex w-10 items-center justify-center"
              onClick={() => {
                setColumns(prev => prev.filter(val => val.columnId !== el.columnId))
              }}>
              <div className="flex items-center justify-center" style={{ width: 22, height: 32 }}>
                <GrFormClose style={{ color: '#6c757d' }} />
              </div>
            </div>
          </div>
        ))}
        <button
          className="btn"
          onClick={() => {
            setColumns(prev => [
              ...prev,
              {
                columnId: v4(),
                type: 'text',
                promptStrategy: 'default',
                instruction: '',
                name: '',
                prompt: '',
              },
            ])
          }}>
          Add
        </button>
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
