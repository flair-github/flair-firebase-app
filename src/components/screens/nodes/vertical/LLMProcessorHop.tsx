import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import cloneDeep from 'lodash/cloneDeep'
import { Fragment, useEffect, useState } from 'react'
import { FaEllipsisH } from 'react-icons/fa'
import { Handle, Position } from 'reactflow'
import { Select } from '~/catalyst/select'
import { nodeContents, type NodeData } from '../Registry'
import { GrFormClose } from 'react-icons/gr'
import { v4 } from 'uuid'

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
      context: string
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
      context: string
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
      context: string
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
      context: string
    }

export interface LLMProcessorHopContent {
  nodeType: 'llm-processor-hop'
  columns: Array<ColumnContent>
  exportedKeys: Record<string, boolean>
}

export const llmProcessorHopDefaultContent: LLMProcessorHopContent = {
  nodeType: 'llm-processor-hop',
  columns: [],
  exportedKeys: {},
}

export const LLMProcessorHop = ({ data, noHandle }: { data: NodeData; noHandle?: boolean }) => {
  const [nodeContent, setNodeContent] = useState<LLMProcessorHopContent>(
    llmProcessorHopDefaultContent,
  )
  const [nodeFormContent, setNodeFormContent] = useState<LLMProcessorHopContent>(
    llmProcessorHopDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'llm-processor-hop') {
      setNodeContent(cloneDeep(data.initialContents))
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache = cloneDeep(nodeContent)
    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId, nodeContent])

  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="w-[400px] rounded-md border border-slate-300 bg-white p-3 shadow-md">
        <div className="flex items-center gap-4">
          <img src="/images/data-sources/s3.svg" width={45} height={45} />
          <div>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Transform
            </span>
            <div className="text-lg font-medium">LLM Processor</div>
          </div>
          <div className="flex-1" />
          <div
            onClick={() => {
              setOpen(true)
              setNodeFormContent(cloneDeep(nodeContent))
            }}>
            <FaEllipsisH />
          </div>
        </div>
        {!noHandle && (
          <Handle
            type="target"
            position={Position.Top}
            style={{
              top: -7,
              width: 14,
              height: 14,
              background: 'rgb(148 163 184)',
            }}
            id="out"
          />
        )}
        {!noHandle && (
          <Handle
            type="source"
            position={Position.Bottom}
            style={{
              bottom: -8,
              width: 14,
              height: 14,
              background: 'rgb(148 163 184)',
            }}
            id="in"
          />
        )}
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/20 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-200 sm:duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-200 sm:duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full">
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="bg-gray-50 px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                LLM Processor
                              </Dialog.Title>
                              {/* <p className="text-sm text-gray-500">
                                Get started by filling in the information below to create your new
                                project.
                              </p> */}
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="relative text-gray-400 hover:text-gray-500"
                                onClick={() => setOpen(false)}>
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Divider container */}
                        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                          {/* Prompts */}
                          <div className="my-3 flex text-xl">
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
                          {nodeFormContent.columns.map((el, index) => (
                            <div key={el.columnId} className="mb-1 flex">
                              {/* Name */}
                              <div className="mr-2 flex-1">
                                <input
                                  type="text"
                                  className="input w-full text-lg"
                                  value={el.name}
                                  onChange={e => {
                                    const newText = e.target.value

                                    if (typeof newText !== 'string') {
                                      return
                                    }

                                    setNodeFormContent(prev => {
                                      const newFormContent = cloneDeep(prev)
                                      newFormContent.columns[index].name = newText
                                      return newFormContent
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

                                    setNodeFormContent(prev => {
                                      const newFormContent = cloneDeep(prev)
                                      newFormContent.columns[index].prompt = newText
                                      return newFormContent
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
                                    // setAllowInteraction(false)
                                    ;(window as any)['advanced-options-' + el.columnId].showModal()
                                  }}>
                                  Advanced
                                </button>
                              </div>

                              {/* Advanced Options Modal */}
                              <dialog
                                id={'advanced-options-' + el.columnId}
                                className="nowheel modal">
                                <form method="dialog" className="modal-box w-11/12 max-w-5xl">
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
                                      const newText = e.target.value

                                      if (typeof newText !== 'string') {
                                        return
                                      }

                                      setNodeFormContent(prev => {
                                        const newFormContent = cloneDeep(prev)
                                        newFormContent.columns[index].name = newText
                                        return newFormContent
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

                                      setNodeFormContent(prev => {
                                        const newFormContent = cloneDeep(prev)
                                        newFormContent.columns[index].instruction = newText
                                        return newFormContent
                                      })
                                    }}
                                    style={{ borderColor: 'black', resize: 'none' }}
                                  />

                                  {/* Contexts */}
                                  <div className="mb-4 mt-1">
                                    <label className="label">
                                      <span className="font-semibold">Contexts</span>
                                    </label>
                                    <textarea
                                      className="textarea textarea-bordered mb-3 w-full"
                                      rows={2}
                                      value={el.context}
                                      onChange={e => {
                                        const newText = e.target.value

                                        if (typeof newText !== 'string') {
                                          return
                                        }

                                        setNodeFormContent(prev => {
                                          const newFormContent = cloneDeep(prev)
                                          newFormContent.columns[index].context = newText
                                          return newFormContent
                                        })
                                      }}
                                      style={{ borderColor: 'black', resize: 'none' }}
                                    />
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

                                      setNodeFormContent(prev => {
                                        const newFormContent = cloneDeep(prev)
                                        newFormContent.columns[index].prompt = newText
                                        return newFormContent
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
                                    className="select mb-3 w-full border-black"
                                    onChange={e => {
                                      const newValue = e.target.value

                                      if (typeof newValue !== 'string') {
                                        return
                                      }

                                      setNodeFormContent(prev => {
                                        const newFormContent = cloneDeep(prev)
                                        newFormContent.columns[index].promptStrategy =
                                          newValue as ColumnContent['promptStrategy']
                                        return newFormContent
                                      })
                                    }}>
                                    <option
                                      value={'Default' satisfies ColumnContent['promptStrategy']}>
                                      Default
                                    </option>
                                    <option
                                      value={
                                        'Chain-of-Thought' satisfies ColumnContent['promptStrategy']
                                      }>
                                      Chain-of-Thought
                                    </option>
                                    <option
                                      value={
                                        'Tree-of-Thought' satisfies ColumnContent['promptStrategy']
                                      }>
                                      Tree-of-Thought
                                    </option>
                                    <option
                                      value={
                                        'Consistency' satisfies ColumnContent['promptStrategy']
                                      }>
                                      Reflection
                                    </option>
                                    <option
                                      value={
                                        'Reflection' satisfies ColumnContent['promptStrategy']
                                      }>
                                      Consistency
                                    </option>
                                    <option
                                      value={
                                        'Reflection' satisfies ColumnContent['promptStrategy']
                                      }>
                                      Multi-hop Prompt
                                    </option>
                                    <option
                                      value={'QA Prompt' satisfies ColumnContent['promptStrategy']}>
                                      QA Prompt
                                    </option>
                                    <option
                                      value={'Few-shot' satisfies ColumnContent['promptStrategy']}>
                                      Few-shot
                                    </option>
                                    <option value={'DSP' satisfies ColumnContent['promptStrategy']}>
                                      DSP
                                    </option>
                                  </select>

                                  {/* Model */}
                                  <label className="label">
                                    <span className="font-bold">Model</span>
                                  </label>
                                  <select
                                    value={el.model}
                                    className="select mb-3 w-full border-black"
                                    onChange={e => {
                                      const newValue = e.target.value
                                      if (typeof newValue !== 'string') {
                                        return
                                      }
                                      setNodeFormContent(prev => {
                                        const newFormContent = cloneDeep(prev)
                                        newFormContent.columns[index].model =
                                          newValue as ColumnContent['model']
                                        return newFormContent
                                      })
                                    }}>
                                    <option
                                      value={'gpt-3.5-turbo' satisfies ColumnContent['model']}>
                                      gpt-3.5-turbo
                                    </option>
                                    <option value={'gpt-4' satisfies ColumnContent['model']}>
                                      gpt-4
                                    </option>
                                    <option value={'falcon-40b' satisfies ColumnContent['model']}>
                                      falcon-40b
                                    </option>
                                    <option value={'vicuna-13' satisfies ColumnContent['model']}>
                                      vicuna-13
                                    </option>
                                    <option value={'claude' satisfies ColumnContent['model']}>
                                      Claude
                                    </option>
                                    <option value={'bard' satisfies ColumnContent['model']}>
                                      Bard
                                    </option>
                                  </select>

                                  {/* Column Type */}
                                  <label className="label">
                                    <span className="font-bold">Column Type</span>
                                  </label>
                                  <select
                                    value={el.type}
                                    className="select mb-3 w-full border-black"
                                    onChange={e => {
                                      const newValue = e.target.value

                                      if (typeof newValue !== 'string') {
                                        return
                                      }

                                      setNodeFormContent(prev => {
                                        const newFormContent = cloneDeep(prev)
                                        if (newFormContent.columns[index].type === 'number') {
                                          delete (newFormContent.columns[index] as any).min
                                          delete (newFormContent.columns[index] as any).max
                                        }
                                        if (newFormContent.columns[index].type === 'category') {
                                          delete (newFormContent.columns[index] as any).options
                                        }
                                        newFormContent.columns[index].type =
                                          newValue as ColumnContent['type']
                                        return newFormContent
                                      })
                                    }}>
                                    <option value={'text' satisfies ColumnContent['type']}>
                                      Text
                                    </option>
                                    <option value={'list' satisfies ColumnContent['type']}>
                                      List
                                    </option>
                                    <option value={'number' satisfies ColumnContent['type']}>
                                      Number
                                    </option>
                                    <option value={'category' satisfies ColumnContent['type']}>
                                      Category
                                    </option>
                                  </select>

                                  {el.type === 'category' && (
                                    <>
                                      {/* Categories */}
                                      <label className="label">
                                        <span className="font-bold">
                                          Categories (comma seperated)
                                        </span>
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

                                          setNodeFormContent(prev => {
                                            const newFormContent = cloneDeep(prev)
                                            const newColumn = newFormContent.columns[index]

                                            if (newColumn.type === 'category') {
                                              newColumn.options = newText
                                            }

                                            return newFormContent
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

                                              setNodeFormContent(prev => {
                                                const newFormContent = cloneDeep(prev)
                                                const newColumn = newFormContent.columns[index]

                                                if (newColumn.type === 'number') {
                                                  if (isFinite(newNum)) {
                                                    newColumn.min = newNum
                                                  } else {
                                                    newColumn.min = 0
                                                  }
                                                }

                                                return newFormContent
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

                                              setNodeFormContent(prev => {
                                                const newFormContent = cloneDeep(prev)
                                                const newColumn = newFormContent.columns[index]

                                                if (newColumn.type === 'number') {
                                                  if (isFinite(newNum)) {
                                                    newColumn.max = newNum
                                                  } else {
                                                    newColumn.max = 0
                                                  }
                                                }

                                                return newFormContent
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
                                    <button className="btn" onClick={() => {}}>
                                      Close
                                    </button>
                                  </div>
                                </form>
                              </dialog>

                              {/* Delete Button */}
                              <div
                                className="ml-2 flex w-10 items-center justify-center"
                                onClick={() => {
                                  setNodeFormContent(prev => {
                                    const newFormContent = cloneDeep(prev)
                                    newFormContent.columns = newFormContent.columns.filter(
                                      val => val.columnId !== el.columnId,
                                    )
                                    return newFormContent
                                  })
                                }}>
                                <div
                                  className="flex items-center justify-center"
                                  style={{ width: 22, height: 32 }}>
                                  <GrFormClose style={{ color: '#6c757d' }} />
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            className="btn mt-2 text-lg font-bold"
                            onClick={() => {
                              const colId = v4()

                              setNodeFormContent(prev => {
                                const newFormContent = cloneDeep(prev)
                                newFormContent.columns = [
                                  ...newFormContent.columns,
                                  {
                                    columnId: colId,
                                    type: 'text',
                                    promptStrategy: 'default',
                                    model: 'gpt-3.5-turbo',
                                    instruction: '',
                                    name: '',
                                    prompt: '',
                                    context: '',
                                    importedKeys: {},
                                  },
                                ]

                                return newFormContent
                              })
                              // setTimeout(() => {
                              //   // setAllowInteraction(false)
                              //   ;(window as any)['advanced-options-' + colId].showModal()
                              // }, 50)
                            }}>
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => setOpen(false)}>
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            onClick={() => {
                              setOpen(false)
                              setNodeContent(prev => {
                                const newContent = cloneDeep(nodeFormContent)
                                return newContent
                              })
                            }}>
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
