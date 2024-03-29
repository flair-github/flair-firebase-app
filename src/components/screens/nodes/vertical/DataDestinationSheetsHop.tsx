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

import { PiTableBold } from 'react-icons/pi'
import { useNodeContent } from '../utils/hooks'
import { CALL_CENTER_GRADING_ID, LEAD_QUALIFICATION_ID } from '~/constants/workflowIds'

export interface DataDestinationSheetsHopContent {
  nodeType: 'data-destination-sheets-hop'
  path: string
  sheetName: string
  columnMapping: string
}

export const dataDestinationSheetsHopDefaultContent: DataDestinationSheetsHopContent = {
  nodeType: 'data-destination-sheets-hop',
  path: '',
  sheetName: '',
  columnMapping: 'Auto-map',
}

export const DataDestinationSheetsHop = ({
  data,
  noHandle,
  yPos,
}: {
  data: NodeData
  noHandle?: boolean
} & NodeProps) => {
  const { nodeContent, setNodeContent, workflowId } =
    useNodeContent<DataDestinationSheetsHopContent>({
      nodeId: data.nodeId,
      defaultContent: dataDestinationSheetsHopDefaultContent,
      initialContent: data.initialContents,
    })

  const [nodeFormContent, setNodeFormContent] = useState<DataDestinationSheetsHopContent>(
    dataDestinationSheetsHopDefaultContent,
  )

  // Right animation
  const { rightIconMode, didRunOnce } = useRightIconMode(yPos, nodeContent.nodeType)

  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="w-[400px] rounded-md border border-slate-300 bg-white p-3 shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex w-10 items-center justify-center">
            <img src="/images/data-sources/google-sheets.svg" width={35} height={35} />
          </div>
          <div>
            <span className="inline-flex items-center rounded-md bg-orange-50 px-1.5 py-0.5 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-700/10">
              Destination
            </span>
            <div className="text-lg font-medium">Insert rows in Google Sheets</div>
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
        {/* {!noHandle && (
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
        )} */}

        {/* Result */}
        {workflowId === CALL_CENTER_GRADING_ID && didRunOnce && rightIconMode !== 'spinner' && (
          <div className="mt-3 border-t pt-2">
            <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
              <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                <div className="flex w-0 flex-1 items-center">
                  <PiTableBold className="h-5 w-5 shrink-0 text-gray-400" />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2 overflow-hidden">
                    <p className="truncate font-medium">Result</p>
                  </div>
                </div>
                <div className="ml-4 shrink-0">
                  <a
                    target="_blank"
                    href={
                      'https://docs.google.com/spreadsheets/d/1ey04b4cJNy6VZLa74pW7HTaukZ9rFZsRX0lgQ_Ou_bA/edit#gid=0'
                    }
                    className="font-medium text-primary hover:text-primary/80">
                    Open
                  </a>
                </div>
              </li>
            </ul>
          </div>
        )}

        {workflowId === LEAD_QUALIFICATION_ID && didRunOnce && rightIconMode !== 'spinner' && (
          <div className="mt-3 border-t pt-2">
            <div className="mb-2 font-medium">Row Result</div>
            <pre className="mb-1 overflow-x-auto whitespace-pre-wrap text-xs">
              {`{
  "filename": "1133390.txt",
  "motivation": "Looking to sell quickly, possibly to an investor",
  "sentiment": "Neutral",
  "talk_time": 0.54,
  "talk_over": [],
  "location": ["College Grove"],
  "bed_count": "NA",
  "bath_count": "NA",
  "property_type": "NA",
  "home_preferences": [],
  "budget": "NA",
  "appointment_asked": "YES",
  "appointment_date": "12 o'clock today",
  "lead_type_asked": "YES",
  "lead_type": "Seller",
  "objections": ["wants to sell to an investor"],
  "objection_handling": "The agent mentioned a guaranteed offer program and a cash offer program to appeal to the prospect's interest in selling to an investor.",
  "follow_ups": [
    "Send a three-way text introduction to the College Grove agent",
    "Have the agent call around 12 o'clock today and leave a message if the prospect doesn't answer"
  ]
}`}
            </pre>
            <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
              <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                <div className="flex w-0 flex-1 items-center">
                  <PiTableBold className="h-5 w-5 shrink-0 text-gray-400" />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2 overflow-hidden">
                    <p className="truncate font-medium">FUB call metadata</p>
                  </div>
                </div>
                <div className="ml-4 shrink-0">
                  <a
                    target="_blank"
                    href={
                      'https://docs.google.com/spreadsheets/d/19uYCfSJF3j7hVz4tDtQSwIKuq-6LoegEGq9ctYKOhLA/edit#gid=0'
                    }
                    className="font-medium text-primary hover:text-primary/80">
                    Open
                  </a>
                </div>
              </li>
            </ul>
          </div>
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
                                Google Sheets
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
                                Credential
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Select name="status">
                                <option value="google-account-1">google-account-1</option>
                                <option value="google-account-2">google-account-2</option>
                              </Select>
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

                          {/* Sheet Name */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                Sheet Name
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={nodeFormContent.sheetName}
                                onChange={e => {
                                  const newText = e.target.value

                                  if (typeof newText !== 'string') {
                                    return
                                  }

                                  setNodeFormContent(prev => {
                                    const newFormContent = cloneDeep(prev)
                                    newFormContent.sheetName = newText
                                    return newFormContent
                                  })
                                }}
                              />
                            </div>
                          </div>

                          {/* Column Mapping */}
                          <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div
                              className="text-sm font-medium leading-6 text-gray-900"
                              aria-hidden="true">
                              Column Mapping
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
                                      checked={nodeFormContent.columnMapping === 'Auto-map'}
                                      onClick={() => {
                                        setNodeFormContent(prev => {
                                          const newFormContent = cloneDeep(prev)
                                          newFormContent.columnMapping = 'Auto-map'
                                          return newFormContent
                                        })
                                      }}
                                    />
                                  </div>
                                  <div className="pl-7 text-sm leading-6">
                                    <label
                                      htmlFor="public-access"
                                      className="font-medium text-gray-900">
                                      Auto-map
                                    </label>
                                    <p id="public-access-description" className="text-gray-500">
                                      Automatically detect column names and match
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
                                      checked={nodeFormContent.columnMapping === 'Manual'}
                                      onClick={() => {
                                        setNodeFormContent(prev => {
                                          const newFormContent = cloneDeep(prev)
                                          newFormContent.columnMapping = 'Manual'
                                          return newFormContent
                                        })
                                      }}
                                    />
                                  </div>
                                  <div className="pl-7 text-sm leading-6">
                                    <label
                                      htmlFor="restricted-access"
                                      className="font-medium text-gray-900">
                                      Manual
                                    </label>
                                    <p id="restricted-access-description" className="text-gray-500">
                                      Manually map columns
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
                                  <span className="ml-2">
                                    Learn more about Google Sheets connection
                                  </span>
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
