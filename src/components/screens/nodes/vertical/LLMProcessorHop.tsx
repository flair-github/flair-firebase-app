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
import { Description, Field, FieldGroup, Fieldset, Label, Legend } from '~/catalyst/fieldset'
import { Input } from '~/catalyst/input'
import { Textarea } from '~/catalyst/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/catalyst/table'
import { Button } from '~/catalyst/button'
import { Text } from '~/catalyst/text'
import { FaBoltLightning } from 'react-icons/fa6'

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
          <div className="flex w-10 items-center justify-center">
            <FaBoltLightning size={40} className="text-slate-600" />
          </div>
          <div>
            <span className="inline-flex items-center rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
              Transform
            </span>
            <div className="text-lg font-medium">LLM Processor</div>
            <div className="">
              {nodeContent.columns.length} Prompt{nodeContent.columns.length >= 2 && 's'}
            </div>
          </div>
          <div className="flex-1" />
          <div
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-100"
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

                        <Table dense className="px-4">
                          <TableHead>
                            <TableRow>
                              <TableHeader className="w-[33%]">Column</TableHeader>
                              <TableHeader className="w-[67%]">Prompt</TableHeader>
                              <TableHeader />
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {nodeFormContent.columns.map((el, index) => (
                              <TableRow key={el.columnId}>
                                <TableCell>
                                  <Input
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
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
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
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex">
                                    <Button
                                      onClick={() => {
                                        ;(window as any)[
                                          'advanced-options-' + el.columnId
                                        ].showModal()
                                      }}>
                                      Advanced
                                    </Button>

                                    {/* Delete Button */}
                                    <div
                                      className="ml-2 flex cursor-pointer items-center justify-center"
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
                                </TableCell>

                                {/* Advanced Options Modal */}
                                <dialog
                                  id={'advanced-options-' + el.columnId}
                                  className="nowheel modal">
                                  <form method="dialog" className="modal-box w-11/12 max-w-xl">
                                    <Fieldset>
                                      <Legend>
                                        Advanced Options{el.name && ':'} {el.name}
                                      </Legend>
                                      <Text>Further configurations for the prompt</Text>
                                      <FieldGroup>
                                        <Field>
                                          <Label>Column Name</Label>
                                          <Input
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
                                          />
                                        </Field>
                                        <Field>
                                          <Label>Instruction</Label>
                                          <Textarea
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
                                          />
                                        </Field>
                                        <Field>
                                          <Label>Context</Label>
                                          <Textarea
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
                                          />
                                        </Field>
                                        <Field>
                                          <Label>Prompt</Label>
                                          <Textarea
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
                                          />
                                        </Field>
                                        <Field>
                                          <Label>Prompt Strategy</Label>
                                          <Select
                                            value={el.promptStrategy}
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
                                              value={
                                                'Default' satisfies ColumnContent['promptStrategy']
                                              }>
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
                                              value={
                                                'QA Prompt' satisfies ColumnContent['promptStrategy']
                                              }>
                                              QA Prompt
                                            </option>
                                            <option
                                              value={
                                                'Few-shot' satisfies ColumnContent['promptStrategy']
                                              }>
                                              Few-shot
                                            </option>
                                            <option
                                              value={
                                                'DSP' satisfies ColumnContent['promptStrategy']
                                              }>
                                              DSP
                                            </option>
                                          </Select>
                                        </Field>
                                        <Field>
                                          <Label>Model</Label>
                                          <Select
                                            value={el.model}
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
                                              value={
                                                'gpt-3.5-turbo' satisfies ColumnContent['model']
                                              }>
                                              gpt-3.5-turbo
                                            </option>
                                            <option
                                              value={'gpt-4' satisfies ColumnContent['model']}>
                                              gpt-4
                                            </option>
                                            <option
                                              value={'falcon-40b' satisfies ColumnContent['model']}>
                                              falcon-40b
                                            </option>
                                            <option
                                              value={'vicuna-13' satisfies ColumnContent['model']}>
                                              vicuna-13
                                            </option>
                                            <option
                                              value={'claude' satisfies ColumnContent['model']}>
                                              Claude
                                            </option>
                                            <option value={'bard' satisfies ColumnContent['model']}>
                                              Bard
                                            </option>
                                          </Select>
                                        </Field>
                                        <Field>
                                          <Label>Column Type</Label>
                                          <Select
                                            value={el.type}
                                            onChange={e => {
                                              const newValue = e.target.value

                                              if (typeof newValue !== 'string') {
                                                return
                                              }

                                              setNodeFormContent(prev => {
                                                const newFormContent = cloneDeep(prev)
                                                if (
                                                  newFormContent.columns[index].type === 'number'
                                                ) {
                                                  delete (newFormContent.columns[index] as any).min
                                                  delete (newFormContent.columns[index] as any).max
                                                }
                                                if (
                                                  newFormContent.columns[index].type === 'category'
                                                ) {
                                                  delete (newFormContent.columns[index] as any)
                                                    .options
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
                                            <option
                                              value={'number' satisfies ColumnContent['type']}>
                                              Number
                                            </option>
                                            <option
                                              value={'category' satisfies ColumnContent['type']}>
                                              Category
                                            </option>
                                          </Select>
                                        </Field>

                                        {el.type === 'category' && (
                                          <Field>
                                            <Label>Categories (comma seperated)</Label>
                                            <Textarea
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
                                            />
                                          </Field>
                                        )}

                                        {el.type === 'number' && (
                                          <>
                                            <div className="flex">
                                              <div className="mr-1 flex-1">
                                                <Field>
                                                  <Label>Min</Label>
                                                  <Input
                                                    pattern="[0-9]*"
                                                    value={el.min}
                                                    onChange={e => {
                                                      const newText = e.target.value as any
                                                      const newNum = Number(newText)

                                                      setNodeFormContent(prev => {
                                                        const newFormContent = cloneDeep(prev)
                                                        const newColumn =
                                                          newFormContent.columns[index]

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
                                                  />
                                                </Field>
                                              </div>
                                              <div className="ml-1 flex-1">
                                                <Field>
                                                  <Label>Max</Label>
                                                  <Input
                                                    pattern="[0-9]*"
                                                    value={el.max}
                                                    onChange={e => {
                                                      const newText = e.target.value as any
                                                      const newNum = Number(newText)

                                                      setNodeFormContent(prev => {
                                                        const newFormContent = cloneDeep(prev)
                                                        const newColumn =
                                                          newFormContent.columns[index]

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
                                                  />
                                                </Field>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </FieldGroup>
                                    </Fieldset>

                                    <div className="modal-action">
                                      {/* if there is a button in form, it will close the modal */}
                                      <Button
                                        color="blue"
                                        onClick={() => {
                                          ;(window as any)[
                                            'advanced-options-' + el.columnId
                                          ].close()
                                        }}>
                                        Close
                                      </Button>
                                    </div>
                                  </form>
                                </dialog>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        {/* Divider container */}
                        <div className="px-6 py-4">
                          <Button
                            color="blue"
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
                              setTimeout(() => {
                                ;(window as any)['advanced-options-' + colId].showModal()
                              }, 50)
                            }}>
                            Add
                          </Button>
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
