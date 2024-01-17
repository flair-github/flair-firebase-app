import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { BiLogoAws } from 'react-icons/bi'
import { NodeHeader } from '~/components/shared/NodeHeader'
import { useAtomValue } from 'jotai'
import { atomNodeExportedKeys } from '~/jotai/jotai'
import { edgesAtom } from '../FlowEditor'
import clsx from 'clsx'
import { FaEllipsisH } from 'react-icons/fa'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { LinkIcon, PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { Field } from '~/catalyst/fieldset'
import { Select } from '~/catalyst/select'

export interface EventNodeContent {
  nodeType: 'event-node'
  fileType: 'txt' | 'csv' | 'mp3' | 'pdf'
  accessKey: string
  path: string
  secretKey: string
  bucketName: string
  regionName: string
  importedKeys: Record<string, boolean>
}

export const eventNodeDefaultContent: EventNodeContent = {
  nodeType: 'event-node',
  fileType: 'csv',
  accessKey: '',
  path: '',
  secretKey: '',
  bucketName: '',
  regionName: '',
  importedKeys: {},
}

const team = [
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Whitney Francis',
    email: 'whitney.francis@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Leonard Krasner',
    email: 'leonard.krasner@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Floyd Miles',
    email: 'floyd.miles@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Emily Selman',
    email: 'emily.selman@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
]

export const EventNode = ({ data, noHandle }: { data: NodeData; noHandle?: boolean }) => {
  const [nodeContent, setNodeContent] = useState<EventNodeContent>(eventNodeDefaultContent)

  // Initial data
  useEffect(() => {
    if (data.initialContents.nodeType === 'event-node') {
      setNodeContent({
        ...data.initialContents,
      })
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const cache: EventNodeContent = {
      ...nodeContent,
    }

    nodeContents.current[data.nodeId] = cache
  }, [data.nodeId, nodeContent])

  const nodeExportedKeys = useAtomValue(atomNodeExportedKeys)
  const edges = useAtomValue(edgesAtom)

  const keyOptions = React.useMemo(() => {
    let newKeys: Record<string, boolean> = {}

    const recursiveAssign = (nodeId: string) => {
      const keyEdges = edges.filter(({ target }) => target === nodeId)
      keyEdges.forEach(kE => {
        newKeys = Object.assign(newKeys, nodeExportedKeys[kE.source] ?? {})
        recursiveAssign(kE.source) // Recursive call
      })
    }

    recursiveAssign(data.nodeId) // Start recursion from the initial nodeId

    return newKeys
  }, [edges, data.nodeId, nodeExportedKeys])

  useEffect(() => {
    setNodeContent(prev => ({ ...prev, importedKeys: keyOptions }))
  }, [keyOptions])

  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        style={{
          width: 400,
        }}
        className="rounded-md border border-slate-300 bg-white p-3 shadow-md">
        <div className="flex items-center gap-4">
          <img src="/images/data-sources/s3.svg" width={45} height={45} />
          <div>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Event
            </span>
            <div className="text-lg font-medium">New CSV Row in S3</div>
          </div>
          <div className="flex-1" />
          <div
            onClick={() => {
              setOpen(true)
            }}>
            <FaEllipsisH />
          </div>
        </div>
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
                                S3 Node
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
                          {/* Project name */}
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
                                <option value="my-aws">My AWS</option>
                              </Select>
                            </div>
                          </div>

                          {/* Project description */}

                          {/* Team members */}
                          {/* Deleted */}

                          {/* Privacy */}
                          <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div
                              className="text-sm font-medium leading-6 text-gray-900"
                              aria-hidden="true">
                              Event Type
                            </div>
                            <div className="space-y-5 sm:col-span-2">
                              <div className="space-y-5 sm:mt-0">
                                <div className="relative flex items-start">
                                  <div className="absolute flex h-6 items-center">
                                    <input
                                      id="public-access"
                                      name="privacy"
                                      aria-describedby="public-access-description"
                                      type="radio"
                                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                                      defaultChecked
                                    />
                                  </div>
                                  <div className="pl-7 text-sm leading-6">
                                    <label
                                      htmlFor="public-access"
                                      className="font-medium text-gray-900">
                                      New CSV file
                                    </label>
                                    <p id="public-access-description" className="text-gray-500">
                                      New CSV file detected in S3
                                    </p>
                                  </div>
                                </div>
                                <div className="relative flex items-start">
                                  <div className="absolute flex h-6 items-center">
                                    <input
                                      id="restricted-access"
                                      name="privacy"
                                      aria-describedby="restricted-access-description"
                                      type="radio"
                                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                                    />
                                  </div>
                                  <div className="pl-7 text-sm leading-6">
                                    <label
                                      htmlFor="restricted-access"
                                      className="font-medium text-gray-900">
                                      Updated CSV file
                                    </label>
                                    <p id="restricted-access-description" className="text-gray-500">
                                      An existing CSV file is deleted in S3
                                    </p>
                                  </div>
                                </div>
                                <div className="relative flex items-start">
                                  <div className="absolute flex h-6 items-center">
                                    <input
                                      id="private-access"
                                      name="privacy"
                                      aria-describedby="private-access-description"
                                      type="radio"
                                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                                    />
                                  </div>
                                  <div className="pl-7 text-sm leading-6">
                                    <label
                                      htmlFor="private-access"
                                      className="font-medium text-gray-900">
                                      Deleted CSV File
                                    </label>
                                    <p id="private-access-description" className="text-gray-500">
                                      A CSV file is deleted in S3
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <hr className="border-gray-200" />
                              <div className="flex text-sm">
                                <a className="group inline-flex items-center text-gray-500 hover:text-gray-900">
                                  <QuestionMarkCircleIcon
                                    className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                  />
                                  <span className="ml-2">Learn more about structuring CSV</span>
                                </a>
                              </div>
                            </div>
                          </fieldset>
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
                            onClick={() => setOpen(false)}>
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
