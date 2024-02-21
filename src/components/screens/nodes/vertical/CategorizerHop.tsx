import React from 'react'
import { useAtom } from 'jotai'
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
import { type NodeData } from '../Registry'

import { TiFlowMerge } from 'react-icons/ti'
import { Badge } from '~/catalyst/badge'
import { Button } from '~/catalyst/button'
import { v4 } from 'uuid'
import { Input } from '~/catalyst/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/catalyst/table'
import { GrFormClose } from 'react-icons/gr'
import { useNodeContent } from '../utils/hooks'
import { MdCategory } from 'react-icons/md'
import { edgesAtom } from '../../FlowEditor'

export interface CategorizerHopContent {
  nodeType: 'categorizer-hop'
  categorizerLabel: string
  prompt: string
  categories: {
    categoryId: string
    category: string
  }[]
}

export const categorizerHopDefaultContent: CategorizerHopContent = {
  nodeType: 'categorizer-hop',
  categorizerLabel: '',
  prompt: '',
  categories: [],
}

const exportedColumnsGen = (nodeContent: CategorizerHopContent) => {
  if (typeof nodeContent.categorizerLabel === 'string' && nodeContent.categorizerLabel.length > 0) {
    return {
      [nodeContent.categorizerLabel]: true,
    }
  }

  return { categorizer: true }
}

export const CategorizerHop = ({
  data,
  noHandle,
  yPos,
}: { data: NodeData; noHandle?: boolean } & NodeProps) => {
  const { nodeContent, setNodeContent, importedColumns } = useNodeContent<CategorizerHopContent>({
    nodeId: data.nodeId,
    defaultContent: categorizerHopDefaultContent,
    initialContent: data.initialContents,
    exportedColumnsGen,
  })

  const [nodeFormContent, setNodeFormContent] = useState<CategorizerHopContent>(
    categorizerHopDefaultContent,
  )

  // Right animation
  const { rightIconMode, didRunOnce } = useRightIconMode(yPos)

  const [open, setOpen] = useState(false)
  const [edges, setEdges] = useAtom(edgesAtom)

  return (
    <>
      <div
        className="rounded-md border border-slate-300 bg-white p-3 shadow-md"
        style={{ width: Math.max(400, nodeContent.categories.length * 100) }}>
        <div className="flex items-center gap-4">
          <div className="flex w-10 items-center justify-center">
            <MdCategory size={40} className="text-slate-600" />
          </div>
          <div className="flex-1">
            <span className="inline-flex items-center rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
              Transform
            </span>
            <div className="text-lg font-medium">Categorizer</div>
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

        <div className="-mx-3 flex font-mono font-medium">
          {nodeContent.categories.map((row, i) => (
            <div key={row.categoryId} className="w-[100px] truncate px-[2px] text-center">
              {row.category}
            </div>
          ))}
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
        {!noHandle &&
          nodeContent.categories.map((row, i) => (
            <Handle
              key={row.categoryId + '-' + i}
              type="source"
              position={Position.Bottom}
              style={{
                bottom: -8,
                left: 50 + i * 100,
                width: 14,
                height: 14,
                background: 'rgb(148 163 184)',
              }}
              id={'out-' + i}
            />
          ))}
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
                                Categorizer
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
                          {/* Imported Columns */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                Imported Columns
                              </label>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:col-span-2">
                              {importedColumns.map(col => (
                                <Badge color="blue" key={col}>
                                  {col}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Categorizer Label */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                Categorizer Label
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={nodeFormContent.categorizerLabel}
                                onChange={e => {
                                  const newText = e.target.value

                                  if (typeof newText !== 'string') {
                                    return
                                  }

                                  setNodeFormContent(prev => {
                                    const newFormContent = cloneDeep(prev)
                                    newFormContent.categorizerLabel = newText
                                    return newFormContent
                                  })
                                }}
                              />
                            </div>
                          </div>

                          {/* Categorizer Label */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                Prompt
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <textarea
                                rows={4}
                                className="block h-28 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={nodeFormContent.prompt}
                                onChange={e => {
                                  const newText = e.target.value

                                  if (typeof newText !== 'string') {
                                    return
                                  }

                                  setNodeFormContent(prev => {
                                    const newFormContent = cloneDeep(prev)
                                    newFormContent.prompt = newText
                                    return newFormContent
                                  })
                                }}
                              />
                            </div>
                          </div>

                          {/* Formula */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                Categories
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Table dense>
                                {/* <TableHead>
                                  <TableRow>
                                    <TableHeader className="" />
                                    <TableHeader className="w-[0.1%]" />
                                  </TableRow>
                                </TableHead> */}

                                <TableBody>
                                  {nodeFormContent.categories.map((row, i) => {
                                    return (
                                      <TableRow key={row.categoryId}>
                                        <TableCell>
                                          <Input
                                            value={row.category}
                                            onChange={e => {
                                              const newText = e.target.value

                                              if (typeof newText !== 'string') {
                                                return
                                              }

                                              setNodeFormContent(prev => {
                                                const newFormContent = cloneDeep(prev)
                                                newFormContent.categories[i].category = newText
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
                                                newFormContent.categories =
                                                  newFormContent.categories.filter(
                                                    val => val.categoryId !== row.categoryId,
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
                                  const categoryId = v4()

                                  setNodeFormContent(prev => {
                                    const newFormContent = cloneDeep(prev)
                                    newFormContent.categories = [
                                      ...newFormContent.categories,
                                      {
                                        categoryId,
                                        category: '',
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

                              const newContent = cloneDeep(nodeFormContent)
                              // newContent.categories.forEach(el => {
                              //   el.categoryId = v4()
                              // })

                              // Cleanup handles
                              {
                                const outHandlesOld = nodeContent.categories.map(
                                  el => 'out-' + el.categoryId,
                                )
                                const outHandlesNew = nodeFormContent.categories.map(
                                  el => 'out-' + el.categoryId,
                                )

                                if (outHandlesNew.length < outHandlesOld.length) {
                                  setEdges(prev => {
                                    const res: typeof prev = []

                                    for (const edge of prev) {
                                      if (edge.source === data.nodeId) {
                                        continue
                                      }

                                      res.push(edge)
                                    }

                                    return res
                                  })
                                }
                              }

                              setNodeContent(newContent)
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
