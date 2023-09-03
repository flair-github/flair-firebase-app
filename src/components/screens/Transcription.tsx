import React, { RefObject } from 'react'
import { useRef, useState } from 'react'
import { Head } from '~/components/shared/Head'
import { MoonLoader } from 'react-spinners'
import { BsThreeDots } from 'react-icons/bs'
import { MdDescription, MdRecordVoiceOver } from 'react-icons/md'
import { TbTemplate } from 'react-icons/tb'
import { ImSpinner9, ImUpload2 } from 'react-icons/im'
import { RiFileCopy2Line } from 'react-icons/ri'
import { copyToClipboard } from '../shared/DetailModal'

const dummyTranscript = `Hello?

Yes. Hi, {prospectName . This is Sam. I'm one of the office assistants here at Home Garden Realty. I just wanna follow-up with you regarding your home mortgage inquiry.

You said what brought you to our website? We actually received your home mortgage inquiry.

Is buying a home something that you're considering?

Do you have, like, a specific time frame for this?

Okay. I do understand there are actually a lot of factors that you need to consider when when buying a home. And we don't want to go through all the details right now, but our agent can discuss some strategies or tips on how you can save money or how you can find that good deal once you're ready to buy a home. So there's no time limit on saving money, wouldn't you agree?

So, yeah, I can go ahead and connect your call to one of our agents who can discuss this your home mortgage strategy. It'll only just take a minute. Okay?

And, yeah, so {prospectName , please stay on the line. I'll go ahead and connect your call now. Please stay on the line for a minute. Thank you.`

function Transcription() {
  const newTranscriptModal = useRef() as RefObject<HTMLDialogElement>
  const detailModal = useRef() as RefObject<HTMLDialogElement>

  const [modalMode, setModalMode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [transcriptions, setTranscriptions] = useState<number[]>([0])
  const [detailId, setDetailId] = useState<number>()
  return (
    <>
      <Head title="Transcription" />
      <div className="container mx-auto px-4 py-2">
        <div className="mb-5 mt-3">
          <button
            className="btn btn-primary normal-case"
            onClick={() => {
              setModalMode('')
              setIsLoading(false)
              newTranscriptModal.current?.showModal()
            }}>
            New Transcript
          </button>
        </div>

        {/* List of My Flows */}

        {false && (
          <div className="flex h-52 items-center justify-center">
            <MoonLoader color="rgba(0,0,0,0.2)" />
          </div>
        )}
        <div className="-m-4 flex flex-wrap">
          {transcriptions.map((_, idx) => (
            <div
              key={idx}
              className="card m-4 w-96 cursor-pointer border bg-base-100 shadow-md transition-shadow hover:shadow-xl"
              onClick={event => {
                setDetailId(idx + 1)
                detailModal.current?.showModal()
              }}>
              <div className="card-body">
                <header className="flex justify-between">
                  <h2 className="card-title truncate">{'Transcript ' + (idx + 1)}</h2>
                  <div
                    className="dropdown"
                    onClick={event => {
                      event.preventDefault()
                      event.stopPropagation()
                    }}>
                    <label tabIndex={0} className="btn btn-circle btn-ghost btn-sm m-1">
                      <BsThreeDots />
                    </label>
                    <ul
                      tabIndex={0}
                      className="menu dropdown-content rounded-box z-[1] w-52 bg-base-100 p-2 shadow">
                      <li>
                        <button
                          className=""
                          onClick={event => {
                            event.preventDefault()
                            event.stopPropagation()
                          }}>
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </header>
                <img src="/images/transcript.jpg" width={330} className="rounded-md border" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Transcript Modal */}
      <dialog ref={newTranscriptModal} className="modal">
        <form method="dialog" className="modal-box max-w-160">
          <header>
            <h3 className="text-lg font-bold">
              {modalMode === 'recording'
                ? 'Upload a Call Recording'
                : 'How do you want to magically generate a script?'}
            </h3>
            {modalMode === 'recording' && (
              <p className="mb-2">
                Clone your best rep by uploading a call recording from them and wel'll magically
                create a script for your Flair agent to follow based on it.
              </p>
            )}
          </header>
          {!modalMode && (
            <section className="grid grid-cols-3 gap-3 pt-3">
              <button
                className="group flex flex-col items-center space-y-3 rounded-lg border py-3 transition-shadow hover:shadow"
                onClick={event => {
                  event.preventDefault()
                  setModalMode('recording')
                }}>
                <span className="mt-3 rounded-lg bg-secondary p-3 group-hover:animate-pulse group-hover:shadow">
                  <MdRecordVoiceOver className="m-3 h-12 w-12 text-white" />
                </span>
                <article className="flex flex-col space-y-3 divide-y whitespace-normal">
                  <p className="font-semibold">Upload a recording</p>
                  <p className="px-3 pt-3">
                    Flair will take call recording, transcribe it, and create a framework from it
                    that your agent can follow.
                  </p>
                </article>
              </button>
              <button
                className="group flex flex-col items-center space-y-3 rounded-lg border py-3 transition-shadow hover:shadow"
                onClick={event => {
                  event.preventDefault()
                  setModalMode('script')
                }}>
                <span className="mt-3 rounded-lg bg-accent p-3 group-hover:animate-pulse group-hover:shadow">
                  <MdDescription className="m-3 h-12 w-12 text-white" />
                </span>
                <article className="flex flex-col space-y-3 divide-y whitespace-normal">
                  <p className="font-semibold">Existing script</p>
                  <p className="px-3 pt-3">
                    Copy and paste your current script and let Flair reformat it in a way that is
                    easy for your agent to follow.
                  </p>
                </article>
              </button>
              <button
                className="group flex flex-col items-center space-y-3 rounded-lg border py-3 transition-shadow hover:shadow"
                onClick={event => {
                  event.preventDefault()
                  setModalMode('template')
                }}>
                <span className="mt-3 rounded-lg bg-primary p-3 group-hover:animate-pulse group-hover:shadow">
                  <TbTemplate className="m-3 h-12 w-12 text-white" />
                </span>
                <article className="flex flex-col space-y-3 divide-y whitespace-normal">
                  <p className="font-semibold">Flair template</p>
                  <p className="px-3 pt-3">
                    Select a proven template, give Flair some basic context, and have AI customize
                    it for your business.
                  </p>
                </article>
              </button>
            </section>
          )}
          {modalMode === 'recording' && (
            <>
              <label
                htmlFor="recording-uploader"
                className="mt-6 flex flex-col items-center justify-center rounded-lg border py-12">
                {isLoading ? (
                  <ImSpinner9 className="mb-6 h-12 w-12 animate-spin" />
                ) : (
                  <ImUpload2 className="mb-6 h-12 w-12" />
                )}
                <h5 className="font-semibold">Click to upload audio from computer</h5>
                <p>or drag and drop here</p>
              </label>
              <input
                type="file"
                id="recording-uploader"
                name="recording-uploader"
                className="hidden"
                accept="audio/*"
                onChange={() => {
                  setIsLoading(true)
                  setTimeout(() => {
                    setTranscriptions(prev => [...prev, 0])
                    newTranscriptModal.current?.close()
                  }, 1500)
                }}
              />
            </>
          )}
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Transcript Detail Modal */}
      <dialog ref={detailModal} className="modal">
        <form method="dialog" className="modal-box max-w-160">
          <header className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Transcript {detailId}</h3>
            <button
              className="btn btn-square btn-sm cursor-pointer"
              onClick={event => {
                event.preventDefault()
                copyToClipboard(dummyTranscript)
              }}>
              <RiFileCopy2Line />
            </button>
          </header>
          <section>
            <textarea
              className="textarea textarea-bordered textarea-primary mt-3 w-full rounded-md"
              value={dummyTranscript}
              rows={12}
            />
          </section>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default Transcription
