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
import { nodeContents, nodeContentsAtom, type NodeData } from '../Registry'

interface HopContent {
  nodeType: string
}

export const generateHop = <T extends HopContent>(config: {
  defaultContent: T
  topHandle: boolean
  bottomHandle: boolean
  nodeTitle: string
  nodeDescription?: string
  renderNode: (content: T, setNodeContent: React.Dispatch<React.SetStateAction<T>>) => JSX.Element
  renderDetails: (
    formContent: T,
    setNodeFormContent: React.Dispatch<React.SetStateAction<T>>,
  ) => JSX.Element
}) => {
  const {
    defaultContent,
    topHandle,
    bottomHandle,
    nodeTitle,
    nodeDescription,
    renderNode,
    renderDetails,
  } = config

  const Hop = ({
    data,
    noHandle,
    yPos,
  }: {
    data: NodeData
    noHandle?: boolean
  } & NodeProps) => {
    const [nodeContent, setNodeContent] = useState<T>(defaultContent)
    const [nodeFormContent, setNodeFormContent] = useState<T>(defaultContent)

    // Right animation
    const { rightIconMode, didRunOnce } = useRightIconMode(yPos)

    // Initial data
    useEffect(() => {
      if (data.initialContents.nodeType === defaultContent.nodeType) {
        setNodeContent(cloneDeep(data.initialContents) as any)
      }
    }, [data.initialContents])

    // Copy node data to cache
    useEffect(() => {
      const cache = cloneDeep(nodeContent) as T
      nodeContents.current[data.nodeId] = cache as any
    }, [data.nodeId, nodeContent])

    const [open, setOpen] = useState(false)

    return (
      <>
        <div className="w-[400px] rounded-md border border-slate-300 bg-white p-3 shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex-1">{renderNode(nodeContent, setNodeContent)}</div>
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
          {!noHandle && topHandle && (
            <Handle
              type="target"
              id="in"
              position={Position.Top}
              style={{
                top: -7,
                width: 14,
                height: 14,
                background: 'rgb(148 163 184)',
              }}
            />
          )}
          {!noHandle && bottomHandle && (
            <Handle
              type="source"
              id="out"
              position={Position.Bottom}
              style={{
                bottom: -8,
                width: 14,
                height: 14,
                background: 'rgb(148 163 184)',
              }}
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
                                  {nodeTitle || 'Edit Node'}
                                </Dialog.Title>
                                {nodeDescription && (
                                  <p className="text-sm text-gray-500">{nodeDescription}</p>
                                )}
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

                          {/* Details */}
                          {renderDetails(nodeFormContent, setNodeFormContent)}
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

  return Hop
}
