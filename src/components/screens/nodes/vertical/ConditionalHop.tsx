import React from 'react'
import { ImSpinner8 } from 'react-icons/im'
import { FaCheckCircle } from 'react-icons/fa'
import { useRightIconMode } from '../utils/useRightIconMode'
import { Dialog, Transition } from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import cloneDeep from 'lodash/cloneDeep'
import { Fragment, useEffect, useState } from 'react'
import { FaEllipsisH } from 'react-icons/fa'
import { Handle, NodeProps, Position } from 'reactflow'
import { Select } from '~/catalyst/select'
import { nodeContents, type NodeData } from '../Registry'
import { TiFlowMerge } from 'react-icons/ti'
import { Badge } from '~/catalyst/badge'
import { Button } from '~/catalyst/button'
import { v4 } from 'uuid'
import { Input } from '~/catalyst/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/catalyst/table'
import { GrFormClose } from 'react-icons/gr'

export interface ConditionalHopContent {
  nodeType: 'conditional-hop'
  conditions: {
    conditionId: string
    column: string
    operator: 'is' | 'is not' | 'contains' | 'does not contain' | 'is empty' | 'is not empty'
    value: string | number
  }[]
}

export const conditionalHopDefaultContent: ConditionalHopContent = {
  nodeType: 'conditional-hop',
  conditions: [],
}

export const ConditionalHop = ({
  data,
  noHandle,
  yPos,
}: { data: NodeData; noHandle?: boolean } & NodeProps) => {
  const [nodeContent, setNodeContent] = useState<ConditionalHopContent>(
    conditionalHopDefaultContent,
  )
  const [nodeFormContent, setNodeFormContent] = useState<ConditionalHopContent>(
    conditionalHopDefaultContent,
  )

  // Right animation
  const { rightIconMode } = useRightIconMode(yPos)

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'conditional-hop') {
      setNodeContent(cloneDeep({ ...conditionalHopDefaultContent, ...data.initialContents }))
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
            <TiFlowMerge size={40} className="text-slate-600" />
          </div>
          <div className="flex-1">
            <span className="inline-flex items-center rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
              Transform
            </span>
            <div className="text-lg font-medium">Conditional</div>
            <div className="flex font-mono font-medium">
              <div className="flex-1">true</div>
              <div className="flex-1">false</div>
            </div>
          </div>
          <div
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-100"
            onClick={() => {
              setOpen(true)
              setNodeFormContent(cloneDeep(nodeContent))
            }}>
            {rightIconMode === 'ellipsis' && <FaEllipsisH />}
            {rightIconMode === 'spinner' && (
              <ImSpinner8 className="animate h-full w-full animate-spin opacity-80" />
            )}
            {rightIconMode === 'check' && (
              <FaCheckCircle className="h-full w-full text-emerald-400" />
            )}
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
            id="in"
          />
        )}
        {!noHandle && (
          <Handle
            type="source"
            position={Position.Bottom}
            style={{
              bottom: -8,
              left: 87,
              width: 14,
              height: 14,
              background: 'rgb(148 163 184)',
            }}
            id="out-true"
          />
        )}
        {!noHandle && (
          <Handle
            type="source"
            position={Position.Bottom}
            style={{
              bottom: -8,
              left: 230,
              width: 14,
              height: 14,
              background: 'rgb(148 163 184)',
            }}
            id="out-false"
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
                    <form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="bg-gray-50 px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                Conditional
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

                        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                          {/* Columns */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                Inputs
                              </label>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:col-span-2">
                              <Badge color="blue">motivation</Badge>
                              <Badge color="blue">summary</Badge>
                              <Badge color="blue">outcome</Badge>
                              <Badge color="blue">sentiment</Badge>
                              <Badge color="blue">location</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                          {/* Formula */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div className="sm:col-span-3">
                              <Table dense>
                                <TableHead>
                                  <TableRow>
                                    <TableHeader className="">Column</TableHeader>
                                    <TableHeader className="">Operator</TableHeader>
                                    <TableHeader className="">Value</TableHeader>
                                    <TableHeader className="w-[0.1%]" />
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  {nodeFormContent.conditions.map((row, i) => {
                                    return (
                                      <TableRow key={row.conditionId}>
                                        <TableCell>
                                          <Input
                                            value={row.column}
                                            onChange={e => {
                                              const newText = e.target.value

                                              if (typeof newText !== 'string') {
                                                return
                                              }

                                              setNodeFormContent(prev => {
                                                const newFormContent = cloneDeep(prev)
                                                newFormContent.conditions[i].column = newText
                                                return newFormContent
                                              })
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Select
                                            value={row.operator}
                                            onChange={e => {
                                              const newText = e.target.value

                                              if (typeof newText !== 'string') {
                                                return
                                              }

                                              setNodeFormContent(prev => {
                                                const newFormContent = cloneDeep(prev)
                                                newFormContent.conditions[i].operator =
                                                  newText as any
                                                return newFormContent
                                              })
                                            }}>
                                            <option value="is">is</option>
                                            <option value="is not">is not</option>
                                            <option value="contains">contains</option>
                                            <option value="does not contain">
                                              does not contain
                                            </option>
                                            <option value="is empty">is empty</option>
                                            <option value="is not empty">is not empty</option>
                                          </Select>
                                        </TableCell>
                                        <TableCell>
                                          <Input
                                            value={row.value}
                                            onChange={e => {
                                              const newText = e.target.value

                                              if (typeof newText !== 'string') {
                                                return
                                              }

                                              setNodeFormContent(prev => {
                                                const newFormContent = cloneDeep(prev)
                                                newFormContent.conditions[i].value = newText
                                                return newFormContent
                                              })
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          {/* Delete Button */}
                                          <div
                                            className="flex cursor-pointer items-center justify-center"
                                            onClick={() => {
                                              setNodeFormContent(prev => {
                                                const newFormContent = cloneDeep(prev)
                                                newFormContent.conditions =
                                                  newFormContent.conditions.filter(
                                                    val => val.conditionId !== row.conditionId,
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
                                        </TableCell>
                                      </TableRow>
                                    )
                                  })}
                                </TableBody>
                              </Table>
                              <div className="mt-2" />
                              <Button
                                color="blue"
                                onClick={() => {
                                  const conditionId = v4()

                                  setNodeFormContent(prev => {
                                    const newFormContent = cloneDeep(prev)
                                    newFormContent.conditions = [
                                      ...newFormContent.conditions,
                                      {
                                        conditionId,
                                        column: '',
                                        operator: 'is',
                                        value: '',
                                      },
                                    ]

                                    return newFormContent
                                  })
                                }}>
                                Add
                              </Button>
                            </div>
                          </div>
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
                    </form>
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
