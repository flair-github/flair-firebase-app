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
import { nodeContents, allNodeContentsAtom, type NodeData } from '../Registry'
import { useNodeContent } from '../utils/hooks'

export interface DataSourceAzureHopContent {
  nodeType: 'data-source-azure-hop'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
  bucket: string
  path: string
  importedKeys: Record<string, boolean>
}

export const dataSourceAzureHopDefaultContent: DataSourceAzureHopContent = {
  nodeType: 'data-source-azure-hop',
  fileType: 'csv',
  bucket: '',
  path: '',
  importedKeys: {},
}

export const DataSourceAzureHop = ({
  data,
  noHandle,
  yPos,
}: {
  data: NodeData
  noHandle?: boolean
} & NodeProps) => {
  const { nodeContent, setNodeContent } = useNodeContent<DataSourceAzureHopContent>({
    nodeId: data.nodeId,
    defaultContent: dataSourceAzureHopDefaultContent,
    initialContent: data.initialContents,
  })

  const [nodeFormContent, setNodeFormContent] = useState<DataSourceAzureHopContent>(
    dataSourceAzureHopDefaultContent,
  )

  // Right animation
  const { rightIconMode, didRunOnce } = useRightIconMode(yPos)

  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="w-[400px] rounded-md border border-slate-300 bg-white p-3 shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex w-10 items-center justify-center">
            <img src="/images/data-sources/azure.svg" width={45} height={45} />
          </div>
          <div>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Source
            </span>
            <div className="text-lg font-medium">Import data from Azure Blob Storage</div>
          </div>
          <div className="flex-1" />
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
        {/* {!noHandle && (
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
        )} */}
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
                                Azure Blob Storage Source
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

                        {/* Content */}
                        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                          {/* Credential */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="project-name"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                Credential
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Select name="status">
                                <option value="production">Production</option>
                                <option value="staging-1">Staging 1</option>
                                <option value="staging-2">Staging 2</option>
                              </Select>
                            </div>
                          </div>

                          {/* Bucket */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                Bucket
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={nodeFormContent.bucket}
                                onChange={e => {
                                  const newText = e.target.value

                                  if (typeof newText !== 'string') {
                                    return
                                  }

                                  setNodeFormContent(prev => {
                                    const newFormContent = cloneDeep(prev)
                                    newFormContent.bucket = newText
                                    return newFormContent
                                  })
                                }}
                              />
                            </div>
                          </div>

                          {/* Path */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                Path
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={nodeFormContent.path}
                                onChange={e => {
                                  const newText = e.target.value

                                  if (typeof newText !== 'string') {
                                    return
                                  }

                                  setNodeFormContent(prev => {
                                    const newFormContent = cloneDeep(prev)
                                    newFormContent.path = newText
                                    return newFormContent
                                  })
                                }}
                              />
                            </div>
                          </div>

                          {/* File Type */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="project-name"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                File Type
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Select
                                name="status"
                                onChange={e => {
                                  const newVal = e.target
                                    .value as DataSourceAzureHopContent['fileType']

                                  setNodeFormContent(prev => {
                                    const newFormContent = cloneDeep(prev)
                                    newFormContent.fileType = newVal
                                    return newFormContent
                                  })
                                }}>
                                <option
                                  value={'csv' satisfies DataSourceAzureHopContent['fileType']}>
                                  csv
                                </option>
                                <option
                                  value={'mp3' satisfies DataSourceAzureHopContent['fileType']}>
                                  mp3
                                </option>
                                <option
                                  value={'pdf' satisfies DataSourceAzureHopContent['fileType']}>
                                  pdf
                                </option>
                                <option
                                  value={'txt' satisfies DataSourceAzureHopContent['fileType']}>
                                  txt
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
