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
import { GrCube } from 'react-icons/gr'

export interface DataIndexerHopContent {
  nodeType: 'data-indexer-hop'
  embeddingType: 'bert' | 'cohere' | 'gpt'
  indexStrategy: 'default' | 'HyDE'
  vectorStore: 'pinecone' | 'faiss' | 'local'
}

export const dataIndexerHopDefaultContent: DataIndexerHopContent = {
  nodeType: 'data-indexer-hop',
  embeddingType: 'gpt',
  indexStrategy: 'default',
  vectorStore: 'pinecone',
}

export const DataIndexerHop = ({ data, noHandle }: { data: NodeData; noHandle?: boolean }) => {
  const [nodeContent, setNodeContent] = useState<DataIndexerHopContent>(
    dataIndexerHopDefaultContent,
  )
  const [nodeFormContent, setNodeFormContent] = useState<DataIndexerHopContent>(
    dataIndexerHopDefaultContent,
  )

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'data-indexer-hop') {
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
            <GrCube size={40} className="text-slate-600" />
          </div>
          <div>
            <span className="inline-flex items-center rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
              Transform
            </span>
            <div className="text-lg font-medium">Data Indexer</div>
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
            id="in"
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
            id="out"
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
                                Data Indexer
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
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="project-name"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                Embedding Type
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Select
                                name="status"
                                onChange={e => {
                                  const newVal = e.target
                                    .value as DataIndexerHopContent['embeddingType']

                                  setNodeFormContent(prev => {
                                    const newFormContent = cloneDeep(prev)
                                    newFormContent.embeddingType = newVal
                                    return newFormContent
                                  })
                                }}>
                                <option
                                  value={'bert' satisfies DataIndexerHopContent['embeddingType']}>
                                  bert
                                </option>
                                <option
                                  value={'cohere' satisfies DataIndexerHopContent['embeddingType']}>
                                  cohere
                                </option>
                                <option
                                  value={'gpt' satisfies DataIndexerHopContent['embeddingType']}>
                                  gpt
                                </option>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="project-name"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                Index Strategy
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Select
                                name="status"
                                onChange={e => {
                                  const newVal = e.target
                                    .value as DataIndexerHopContent['indexStrategy']

                                  setNodeFormContent(prev => {
                                    const newFormContent = cloneDeep(prev)
                                    newFormContent.indexStrategy = newVal
                                    return newFormContent
                                  })
                                }}>
                                <option
                                  value={
                                    'default' satisfies DataIndexerHopContent['indexStrategy']
                                  }>
                                  default
                                </option>
                                <option
                                  value={'HyDE' satisfies DataIndexerHopContent['indexStrategy']}>
                                  HyDE
                                </option>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="project-name"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                Vector Store
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Select
                                name="status"
                                onChange={e => {
                                  const newVal = e.target
                                    .value as DataIndexerHopContent['vectorStore']

                                  setNodeFormContent(prev => {
                                    const newFormContent = cloneDeep(prev)
                                    newFormContent.vectorStore = newVal
                                    return newFormContent
                                  })
                                }}>
                                <option
                                  value={'pinecone' satisfies DataIndexerHopContent['vectorStore']}>
                                  pinecone
                                </option>
                                <option
                                  value={'faiss' satisfies DataIndexerHopContent['vectorStore']}>
                                  faiss
                                </option>
                                <option
                                  value={'local' satisfies DataIndexerHopContent['vectorStore']}>
                                  local
                                </option>
                              </Select>
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