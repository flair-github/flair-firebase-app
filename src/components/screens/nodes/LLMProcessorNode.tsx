import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents, jotaiAllowInteraction } from './Registry'
import { v4 } from 'uuid'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { NodeHeader } from '~/components/shared/NodeHeader'
import { edgesAtom, nodesAtom } from '../FlowEditor'
import { atomNodeExportedKeys } from '~/jotai/jotai'
import clsx from 'clsx'

type ColumnContent =
  | {
      columnId: string
      name: string
      type: 'text'
      promptStrategy: string
      model: string
      instruction: string
      importedKeys: Record<string, boolean>
      prompt: string
    }
  | {
      columnId: string
      name: string
      type: 'list'
      promptStrategy: string
      model: string
      instruction: string
      importedKeys: Record<string, boolean>
      prompt: string
    }
  | {
      columnId: string
      name: string
      type: 'category'
      options: string
      promptStrategy: string
      model: string
      instruction: string
      importedKeys: Record<string, boolean>
      prompt: string
    }
  | {
      name: string
      columnId: string
      type: 'number'
      min: number
      max: number
      promptStrategy: string
      model: string
      instruction: string
      importedKeys: Record<string, boolean>
      prompt: string
    }

export interface LLMProcessorNodeContent {
  nodeType: 'llm-processor'
  columns: Array<ColumnContent>
  exportedKeys: Record<string, boolean>
}

export const llmProcessorNodeDefaultContent: LLMProcessorNodeContent = {
  nodeType: 'llm-processor',
  columns: [],
  exportedKeys: {},
}

export const LLMProcessorNode = ({ data, noHandle }: { data: NodeData; noHandle?: boolean }) => {
  const [columns, setColumns] = useState<LLMProcessorNodeContent['columns']>([])
  const [columnNames, setColumnNames] = useState<Record<string, string>>({})
  // We must introduce above "columnNames" state to prevent circular dependency between "columns" local state and "nodeExportedKeys" jotai state
  const [exportedKeys, setExportedKeys] = useState<LLMProcessorNodeContent['exportedKeys']>({})
  const setAllowInteraction = useSetAtom(jotaiAllowInteraction)

  // Initial data
  useEffect(() => {
    if (data.initialContents?.nodeType !== 'llm-processor') {
      return
    }

    const initialColumns = JSON.parse(JSON.stringify(data.initialContents.columns))
    setColumns(initialColumns)
    setColumnNames(
      Object.fromEntries(initialColumns.map((col: ColumnContent) => [col.columnId, col.name])),
    )
    setExportedKeys(data.initialContents.exportedKeys)
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: LLMProcessorNodeContent = {
      nodeType: 'llm-processor',
      columns: columns,
      exportedKeys: exportedKeys,
    }

    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId, columns, exportedKeys])

  const [nodeExportedKeys, setNodeExportedKeys] = useAtom(atomNodeExportedKeys)
  const edges = useAtomValue(edgesAtom)

  const [keyOptions, setKeyOptions] = useState<Record<string, boolean>>({})
  React.useEffect(() => {
    const newExportedKeys = { ...keyOptions }
    columns.forEach(col => {
      newExportedKeys[col.name] = true
    })
    setExportedKeys(newExportedKeys)
  }, [keyOptions, columns])

  React.useEffect(() => {
    let newKeys: Record<string, boolean> = {}

    const recursiveAssign = (nodeId: string) => {
      const keyEdges = edges.filter(({ target }) => target === nodeId)
      keyEdges.forEach(kE => {
        newKeys = Object.assign(newKeys, nodeExportedKeys[kE.source] ?? {})
        recursiveAssign(kE.source) // Recursive call
      })
    }

    recursiveAssign(data.nodeId) // Start recursion from the initial nodeId

    setKeyOptions(newKeys)
    setColumns(prev => prev.map(col => ({ ...col, importedKeys: newKeys })))
  }, [edges, data.nodeId, nodeExportedKeys])

  React.useEffect(() => {
    const newExportedKeys: Record<string, boolean> = {}
    Object.values(columnNames).forEach(columnName => {
      newExportedKeys[columnName] = true
    })
    setNodeExportedKeys(prev => ({ ...prev, [data.nodeId]: newExportedKeys }))
  }, [data.nodeId, columnNames, setNodeExportedKeys])

  const [isCollapsed, setIsCollapse] = useState(true)

  return (
    <div
      style={{
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '5px',
        width: 1000,
      }}
      className="bg-blue-50">
      <NodeHeader
        title="LLM Processor"
        color="blue"
        withFlair
        nodeId={data.nodeId}
        isCollapsed={isCollapsed}
        toggleCollapse={() => {
          setIsCollapse(x => !x)
        }}
      />
      <section className={clsx(isCollapsed && 'hidden', 'px-5 pb-5')}>
        <div className="mb-3 flex">
          {/* Col */}
          {/* <div className="mr-2 flex w-14 items-center" /> */}

          {/* Name */}
          <div className="mr-2 flex-1 font-bold">Column Name</div>

          {/* Prompt */}
          <div className="mr-2 flex-[2] font-bold">Prompt</div>

          {/* Advanced */}
          <div className="mr-2 flex w-24 items-center" />

          <div className="ml-2 flex w-10 items-center justify-center" />
        </div>
        {columns.map((el, index) => (
          <div key={el.columnId} className="mb-1 flex">
            {/* Col */}
            {/* <div className="mr-2 flex w-14 items-center text-lg font-bold">
              <div>Col {index + 1}</div>
            </div> */}

            {/* Name */}
            <div className="mr-2 flex-1">
              <input
                type="text"
                className="input w-full text-lg"
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
                  setColumnNames(prev => {
                    const newColumnNames = { ...prev }
                    newColumnNames[el.columnId] = newName
                    return newColumnNames
                  })
                }}
                style={{ borderColor: 'black', resize: 'none' }}
              />
            </div>

            {/* Prompt */}
            <div className="mr-2 flex-[2]">
              <input
                type="text"
                className="input w-full text-lg"
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
            </div>

            {/* Advanced */}
            <div className="mr-2 flex w-24 items-center">
              <button
                className="btn text-lg"
                onClick={() => {
                  setAllowInteraction(false)
                  ;(window as any)['advanced-options-' + el.columnId].showModal()
                }}>
                Advanced
              </button>
            </div>

            {/* Advanced Options Modal */}
            <dialog id={'advanced-options-' + el.columnId} className="nowheel modal">
              <form method="dialog" className="max-w-5xl modal-box w-11/12">
                <h3 className="text-lg font-bold">Advanced Options: {el.name}</h3>

                {/* Column Name */}
                <label className="label">
                  <span className="font-bold">Column Name</span>
                </label>
                <input
                  type="text"
                  className="input mb-3 w-full"
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
                    setColumnNames(prev => {
                      const newColumnNames = { ...prev }
                      newColumnNames[el.columnId] = newName
                      return newColumnNames
                    })
                  }}
                  style={{ borderColor: 'black', resize: 'none' }}
                />

                {/* Instruction */}
                <label className="label">
                  <span className="font-bold">Instruction</span>
                </label>
                <textarea
                  className="textarea textarea-bordered mb-3 w-full"
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

                {/* Contexts */}
                <div className="mb-4 mt-1">
                  <label className="label">
                    <span className="font-semibold">Contexts</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(keyOptions ? keyOptions : {}).map((localKey, i) => {
                      return (
                        <div key={i} className="join border">
                          <span className="join-item flex grow items-center overflow-x-hidden bg-white px-3 text-black">
                            <p className="overflow-x-hidden text-ellipsis whitespace-nowrap">
                              {localKey}
                            </p>
                          </span>
                          <input
                            type="checkbox"
                            className="checkbox join-item px-1"
                            checked={el.importedKeys[localKey]}
                            onChange={() => {
                              setColumns(prev => {
                                const newColumns = [...prev]
                                const newColumn = { ...newColumns[index] }
                                let newImportedKeys = { ...newColumn.importedKeys }

                                if (newImportedKeys[localKey]) {
                                  newImportedKeys[localKey] = false
                                } else {
                                  newImportedKeys[localKey] = true
                                }

                                newColumn.importedKeys = newImportedKeys
                                newColumns[index] = newColumn
                                return newColumns
                              })
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Prompt */}
                <label className="label">
                  <span className="font-bold">Prompt</span>
                </label>
                <textarea
                  className="textarea textarea-bordered mb-3 w-full"
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
                  <span className="font-bold">Prompt Strategy</span>
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
                  <option value={'Default' satisfies ColumnContent['promptStrategy']}>
                    Default
                  </option>
                  <option value={'Chain-of-Thought' satisfies ColumnContent['promptStrategy']}>
                    Chain-of-Thought
                  </option>
                  <option value={'Tree-of-Thought' satisfies ColumnContent['promptStrategy']}>
                    Tree-of-Thought
                  </option>
                  <option value={'Consistency' satisfies ColumnContent['promptStrategy']}>
                    Reflection
                  </option>
                  <option value={'Reflection' satisfies ColumnContent['promptStrategy']}>
                    Consistency
                  </option>
                  <option value={'Reflection' satisfies ColumnContent['promptStrategy']}>
                    Multi-hop Prompt
                  </option>
                  <option value={'QA Prompt' satisfies ColumnContent['promptStrategy']}>
                    QA Prompt
                  </option>
                  <option value={'Few-shot' satisfies ColumnContent['promptStrategy']}>
                    Few-shot
                  </option>
                  <option value={'DSP' satisfies ColumnContent['promptStrategy']}>DSP</option>
                </select>

                {/* Model */}
                <label className="label">
                  <span className="font-bold">Model</span>
                </label>
                <select
                  value={el.model}
                  className="max-w-xs select mb-3 w-full border-black"
                  onChange={e => {
                    const newValue = e.target.value
                    if (typeof newValue !== 'string') {
                      return
                    }
                    setColumns(prev => {
                      const newColumns = [...prev]
                      newColumns[index].model = newValue as ColumnContent['model']
                      return newColumns
                    })
                  }}>
                  <option value={'gpt-3.5-turbo' satisfies ColumnContent['model']}>
                    gpt-3.5-turbo
                  </option>
                  <option value={'gpt-4' satisfies ColumnContent['model']}>gpt-4</option>
                  <option value={'falcon-40b' satisfies ColumnContent['model']}>falcon-40b</option>
                  <option value={'vicuna-13' satisfies ColumnContent['model']}>vicuna-13</option>
                  <option value={'claude' satisfies ColumnContent['model']}>Claude</option>
                  <option value={'bard' satisfies ColumnContent['model']}>Bard</option>
                </select>

                {/* Column Type */}
                <label className="label">
                  <span className="font-bold">Column Type</span>
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
                      if (newColumns[index].type === 'number') {
                        delete (newColumns[index] as any).min
                        delete (newColumns[index] as any).max
                      }
                      if (newColumns[index].type === 'category') {
                        delete (newColumns[index] as any).options
                      }
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
                      <span className="font-bold">Categories (comma seperated)</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered mb-3 w-full"
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
                          <span className="font-bold">Min</span>
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
                          <span className="font-bold">Max</span>
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
                  <button
                    className="btn"
                    onClick={() => {
                      setAllowInteraction(true)
                    }}>
                    Close
                  </button>
                </div>
              </form>
            </dialog>

            {/* Delete Button */}
            <div
              className="ml-2 flex w-10 items-center justify-center"
              onClick={() => {
                setColumns(prev => prev.filter(val => val.columnId !== el.columnId))
                setColumnNames(prev => {
                  const newColumnNames = { ...prev }
                  delete newColumnNames[el.columnId]
                  return newColumnNames
                })
              }}>
              <div className="flex items-center justify-center" style={{ width: 22, height: 32 }}>
                <GrFormClose style={{ color: '#6c757d' }} />
              </div>
            </div>
          </div>
        ))}
        <button
          className="btn mt-2 text-lg font-bold"
          onClick={() => {
            const colId = v4()
            setColumns(prev => [
              ...prev,
              {
                columnId: colId,
                type: 'text',
                promptStrategy: 'default',
                model: 'gpt-3.5-turbo',
                instruction: '',
                name: '',
                prompt: '',
                importedKeys: {},
              },
            ])
            setTimeout(() => {
              setAllowInteraction(false)
              ;(window as any)['advanced-options-' + colId].showModal()
            }, 50)
          }}>
          Add
        </button>
      </section>
      {!noHandle && (
        <>
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
        </>
      )}
    </div>
  )
}
