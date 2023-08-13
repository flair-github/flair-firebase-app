import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { DocLLMOutput } from 'Types/firebaseStructure'
import { timestampToLocaleString } from '../screens/LLMOutputs'
import { RiFileCopy2Line } from 'react-icons/ri'

async function copyToClipboard(text: string): Promise<void> {
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
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative w-full p-6 px-4 pt-5 pb-4 my-8 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl max-w-160">
                <header className="pb-3 text-base font-semibold leading-6 text-left text-gray-900 border-b">
                  LLM Output Detail
                </header>
                <section className="grid grid-cols-6 gap-3 my-6 overflow-y-scroll border-b pb-9 px-1 max-h-[30rem]">
                  <h2 className="col-span-6 py-2 text-base font-semibold leading-7 text-gray-900 border-y">
                    Meta
                  </h2>

                  <article className="w-full max-w-xs col-span-3 form-control">
                    <div className="label">
                      <span className="label-text">Workflow ID</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(item.workflowId)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.workflowId}
                      className="w-full max-w-xs input input-bordered"
                      readOnly
                    />
                  </article>
                  <article className="w-full max-w-xs col-span-3 form-control">
                    <div className="label">
                      <span className="label-text">Workflow Request ID</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(item.workflowRequestId ?? '')
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.workflowRequestId}
                      className="w-full max-w-xs input input-bordered"
                      readOnly
                    />
                  </article>
                  <article className="w-full max-w-xs col-span-3 form-control">
                    <div className="label">
                      <span className="label-text">Workflow Result ID</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(item.workflowResultId ?? '')
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.workflowResultId ?? ''}
                      className="w-full max-w-xs input input-bordered"
                      readOnly
                    />
                  </article>
                  <article className="w-full max-w-xs col-span-3 form-control">
                    <div className="label">
                      <span className="label-text">Output ID</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(item.id)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.id}
                      className="w-full max-w-xs input input-bordered"
                      readOnly
                    />
                  </article>

                  <h2 className="col-span-6 py-2 text-base font-semibold leading-7 text-gray-900 border-y">
                    Content
                  </h2>

                  <article className="w-full max-w-xs col-span-6 form-control">
                    <div className="label">
                      <span className="label-text">Column Name</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(item.columnName)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.columnName}
                      className="w-full max-w-xs input input-bordered"
                      readOnly
                    />
                  </article>
                  <article className="w-full max-w-xs col-span-3 form-control">
                    <div className="label">
                      <span className="label-text">Column Prompt</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(item.columnPrompt)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <textarea
                      value={item.columnPrompt}
                      className="w-full h-24 textarea textarea-bordered"
                      readOnly
                    />
                  </article>
                  <article className="w-full max-w-xs col-span-3 form-control">
                    <div className="label">
                      <span className="label-text">Context</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(item.context)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <textarea
                      value={item.context}
                      className="w-full h-24 textarea textarea-bordered"
                      readOnly
                    />
                  </article>
                  <article className="w-full max-w-xs col-span-3 form-control">
                    <div className="label">
                      <span className="label-text">Instruction</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(item.instruction)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <textarea
                      value={item.instruction}
                      className="w-full h-36 textarea textarea-bordered"
                      readOnly
                    />
                  </article>
                  <article className="w-full max-w-xs col-span-3 form-control">
                    <div className="label">
                      <span className="label-text">Answer</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
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
                      className="w-full h-36 textarea textarea-bordered"
                      readOnly
                    />
                  </article>
                  <article className="w-full max-w-xs col-span-6 form-control">
                    <div className="label">
                      <span className="label-text">Input</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(item.input)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <textarea
                      value={item.input}
                      className="w-full h-64 textarea textarea-bordered"
                      readOnly
                    />
                  </article>
                  <article className="w-full max-w-xs col-span-6 form-control">
                    <div className="label">
                      <span className="label-text">Output</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(item.output)
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <textarea
                      value={item.output}
                      className="w-full h-64 textarea textarea-bordered"
                      readOnly
                    />
                  </article>

                  <h2 className="col-span-6 py-2 text-base font-semibold leading-7 text-gray-900 border-y">
                    Other
                  </h2>

                  <article className="w-full max-w-xs col-span-3 form-control">
                    <div className="label">
                      <span className="label-text">Doc Exists</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(item.docExists.toString())
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.docExists.toString()}
                      className="w-full max-w-xs input input-bordered"
                      readOnly
                    />
                  </article>
                  <article className="w-full max-w-xs col-span-3 form-control">
                    <div className="label">
                      <span className="label-text">Latency</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(item.latency.toString())
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="number"
                      value={item.latency}
                      className="w-full max-w-xs input input-bordered"
                      readOnly
                    />
                  </article>
                  <article className="w-full max-w-xs col-span-3 form-control">
                    <div className="label">
                      <span className="label-text">Created Timestamp</span>
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(timestampToLocaleString(item.createdTimestamp))
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={timestampToLocaleString(item.createdTimestamp)}
                      className="w-full max-w-xs input input-bordered"
                      readOnly
                    />
                  </article>
                  <article className="w-full max-w-xs col-span-3 form-control">
                    <div className="label">
                      <span className="label-text">Updated Timestamp</span>{' '}
                      <button
                        className="cursor-pointer btn btn-square btn-xs"
                        onClick={() => {
                          copyToClipboard(timestampToLocaleString(item.updatedTimestamp))
                        }}>
                        <RiFileCopy2Line />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={timestampToLocaleString(item.updatedTimestamp)}
                      className="w-full max-w-xs input input-bordered"
                      readOnly
                    />
                  </article>
                </section>
                <button type="button" className="block mx-auto btn" onClick={() => setOpen(false)}>
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
