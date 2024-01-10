import React, { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { DocLLMOutput } from 'Types/firebaseStructure'
import { timestampToLocaleString } from '../screens/LLMOutputs'
import { RiFileCopy2Line } from 'react-icons/ri'

const makeTextReadable = (inputText: string): string => {
  return inputText
    .split('\n')
    .map(line => {
      // Check if line is a JSON string by looking for '{' at the start
      if (line.trim().startsWith('{')) {
        try {
          // Try to parse and pretty print the JSON
          const obj = JSON.parse(line)
          return JSON.stringify(obj, null, 2)
        } catch (error) {
          return line
        }
      }
      return line
    })
    .join('\n')
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
    console.log('Text copied to clipboard')
  } catch (err) {
    console.error('Error copying text: ', err)
  }
}

export default function DetailModal({
  open,
  setOpen,
  item,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  item: DocLLMOutput
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative my-8 w-full max-w-160 overflow-hidden rounded-lg bg-white p-6 px-4 pb-4 pt-5 text-left shadow-xl transition-all">
                <header className="border-b pb-3 text-left text-base font-bold leading-6 text-gray-900">
                  LLM Output Detail
                </header>
                <section className="my-6 grid max-h-[30rem] grid-cols-6 gap-3 overflow-y-scroll border-b px-1 pb-9">
                  <h2 className="col-span-6 border-y py-2 text-base font-bold leading-7 text-gray-900">
                    Meta
                  </h2>

                  <article className="max-w-xs form-control col-span-3 w-full">
                    <div className="label">
                      <span className="label-text">Workflow ID</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(item.workflowId)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.workflowId}
                      className="max-w-xs input input-bordered w-full"
                      readOnly
                    />
                  </article>
                  <article className="max-w-xs form-control col-span-3 w-full">
                    <div className="label">
                      <span className="label-text">Workflow Request ID</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(item.workflowRequestId ?? '')
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.workflowRequestId}
                      className="max-w-xs input input-bordered w-full"
                      readOnly
                    />
                  </article>
                  <article className="max-w-xs form-control col-span-3 w-full">
                    <div className="label">
                      <span className="label-text">Workflow Result ID</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(item.workflowResultId ?? '')
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.workflowResultId ?? ''}
                      className="max-w-xs input input-bordered w-full"
                      readOnly
                    />
                  </article>
                  <article className="max-w-xs form-control col-span-3 w-full">
                    <div className="label">
                      <span className="label-text">Output ID</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(item.id)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.id}
                      className="max-w-xs input input-bordered w-full"
                      readOnly
                    />
                  </article>

                  <h2 className="col-span-6 border-y py-2 text-base font-bold leading-7 text-gray-900">
                    Content
                  </h2>

                  <article className="max-w-xs form-control col-span-6 w-full">
                    <div className="label">
                      <span className="label-text">Column Name</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(item.columnName)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.columnName}
                      className="max-w-xs input input-bordered w-full"
                      readOnly
                    />
                  </article>
                  <article className="max-w-xs form-control col-span-3 w-full">
                    <div className="label">
                      <span className="label-text">Column Prompt</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(item.columnPrompt)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <textarea
                      value={item.columnPrompt}
                      className="textarea textarea-bordered h-24 w-full"
                      readOnly
                    />
                  </article>
                  <article className="max-w-xs form-control col-span-3 w-full">
                    <div className="label">
                      <span className="label-text">Context</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(item.context)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <textarea
                      value={item.context}
                      className="textarea textarea-bordered h-24 w-full"
                      readOnly
                    />
                  </article>
                  <article className="max-w-xs form-control col-span-3 w-full">
                    <div className="label">
                      <span className="label-text">Instruction</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(item.instruction)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <textarea
                      value={item.instruction}
                      className="textarea textarea-bordered h-36 w-full"
                      readOnly
                    />
                  </article>
                  <article className="max-w-xs form-control col-span-3 w-full">
                    <div className="label">
                      <span className="label-text">Answer</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(
                            Array.isArray(item.answer)
                              ? item.answer.join(', ')
                              : typeof item.answer === 'number'
                              ? item.answer.toString()
                              : item.answer,
                          )
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <textarea
                      value={
                        Array.isArray(item.answer)
                          ? item.answer.join(', ')
                          : typeof item.answer === 'number'
                          ? item.answer.toString()
                          : item.answer
                      }
                      className="textarea textarea-bordered h-36 w-full"
                      readOnly
                    />
                  </article>
                  <article className="max-w-xs form-control col-span-6 w-full">
                    <div className="label">
                      <span className="label-text">Input</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(item.input)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <pre className="textarea textarea-bordered h-64 w-full overflow-scroll">
                      {item.input}
                    </pre>
                  </article>
                  <article className="max-w-xs form-control col-span-6 w-full">
                    <div className="label">
                      <span className="label-text">Output</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(item.output)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <pre className="textarea textarea-bordered h-64 w-full overflow-scroll">
                      {makeTextReadable(item.output)}
                    </pre>
                  </article>

                  <h2 className="col-span-6 border-y py-2 text-base font-bold leading-7 text-gray-900">
                    Other
                  </h2>

                  <article className="max-w-xs form-control col-span-3 w-full">
                    <div className="label">
                      <span className="label-text">Doc Exists</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(item.docExists.toString())
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.docExists.toString()}
                      className="max-w-xs input input-bordered w-full"
                      readOnly
                    />
                  </article>
                  <article className="max-w-xs form-control col-span-3 w-full">
                    <div className="label">
                      <span className="label-text">Latency</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(item.latency.toString())
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="number"
                      value={item.latency}
                      className="max-w-xs input input-bordered w-full"
                      readOnly
                    />
                  </article>
                  <article className="max-w-xs form-control col-span-3 w-full">
                    <div className="label">
                      <span className="label-text">Created Timestamp</span>
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(timestampToLocaleString(item.createdTimestamp))
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={timestampToLocaleString(item.createdTimestamp)}
                      className="max-w-xs input input-bordered w-full"
                      readOnly
                    />
                  </article>
                  <article className="max-w-xs form-control col-span-3 w-full">
                    <div className="label">
                      <span className="label-text">Updated Timestamp</span>{' '}
                      <button
                        className="btn btn-square btn-xs cursor-pointer"
                        onClick={() => {
                          copyToClipboard(timestampToLocaleString(item.updatedTimestamp))
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={timestampToLocaleString(item.updatedTimestamp)}
                      className="max-w-xs input input-bordered w-full"
                      readOnly
                    />
                  </article>
                </section>
                <button type="button" className="btn mx-auto block" onClick={() => setOpen(false)}>
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
