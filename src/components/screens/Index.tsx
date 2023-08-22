import React, { RefObject, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { useRef, useState } from 'react'
import { SignInButton } from '~/components/domain/auth/SignInButton'
import { SignOutButton } from '~/components/domain/auth/SignOutButton'
import { Head } from '~/components/shared/Head'
import { useAtomValue } from 'jotai'
import { atomUser, atomUserData } from '~/jotai/jotai'
import { db } from '~/lib/firebase'
import { DocWorkflow } from 'Types/firebaseStructure'
import { Timestamp, serverTimestamp } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { MoonLoader, RingLoader } from 'react-spinners'
import { TfiLayoutWidthDefault } from 'react-icons/tfi'
import { BsArrowLeftShort, BsThreeDots } from 'react-icons/bs'
import { ImFileEmpty } from 'react-icons/im'

function Index() {
  const [isOpen, setIsOpen] = useState(true)
  const completeButtonRef = useRef(null)

  const userData = useAtomValue(atomUserData)

  const [myFlows, setMyFlows] = useState<DocWorkflow[]>()

  useEffect(() => {
    if (!userData?.userId) {
      return
    }

    const unsub = db
      .collection('workflows')
      .where('docExists', '==', true)
      .where('ownerUserId', '==', userData.userId)
      .orderBy('lastSaveTimestamp', 'desc')
      .limit(50)
      .onSnapshot(snaps => {
        const newMyFlows = snaps.docs.map(snap => snap.data() as DocWorkflow)
        setMyFlows(newMyFlows)
      })

    return () => {
      unsub()
    }
  }, [userData?.userId])

  const createNewFlow = () => {
    const titleInput = window.document.getElementById('flow-title-field') as HTMLInputElement
    const title = titleInput?.value || 'New Flow'

    if (titleInput) {
      titleInput.value = ''
    }

    if (!userData?.userId) {
      return
    }

    const ref = db.collection('workflows').doc()
    const newFlowData: DocWorkflow = {
      createdTimestamp: serverTimestamp() as Timestamp,
      updatedTimestamp: serverTimestamp() as Timestamp,
      lastSaveTimestamp: serverTimestamp() as Timestamp,
      docExists: true,
      workflowId: ref.id,
      frontendConfig: '',
      workflowTitle: title || 'New Flow',
      ownerUserId: userData.userId,
    }

    ref.set(newFlowData)

    // TODO: Continue to flow editor
  }

  const [showNewFlowModal, setShowNewFlowModal] = useState(false)
  const navigate = useNavigate()

  const openWorkflow = (workflowId: string) => {
    navigate('editor', { state: { workflowId } })
  }
  const onboardingModal = useRef() as RefObject<HTMLDialogElement>
  useEffect(() => {
    onboardingModal.current?.showModal()
  }, [])
  return (
    <>
      <Head title="Home" />
      <div className="container mx-auto px-4 py-2">
        <div className="mb-5 mt-3">
          <button
            className="btn btn-primary normal-case"
            onClick={() => {
              setShowNewFlowModal(true)
            }}>
            New Empty Flow
          </button>
          <button
            className="btn ml-2 normal-case"
            onClick={() => {
              navigate('templates')
            }}>
            Flow Templates
          </button>
        </div>

        {/* List of My Flows */}

        {!myFlows && (
          <div className="flex h-52 items-center justify-center">
            <MoonLoader color="rgba(0,0,0,0.2)" />
          </div>
        )}
        <div className="-m-4 flex flex-wrap">
          {myFlows &&
            myFlows.map(myFlow => (
              <div
                key={myFlow.workflowId}
                className="card m-4 w-96 cursor-pointer border bg-base-100 shadow-md transition-shadow hover:shadow-xl"
                onClick={() => {
                  openWorkflow(myFlow.workflowId)
                }}>
                <div className="card-body">
                  <header className="flex justify-between">
                    <h2 className="card-title truncate">{myFlow.workflowTitle}</h2>
                    <div
                      className="dropdown"
                      onClick={event => {
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
                              event.stopPropagation()
                              db.collection('workflows').doc(myFlow.workflowId).update({
                                docExists: false,
                              })
                            }}>
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </header>
                  <img src="/images/flow-artwork.svg" width={330} height={180} className="border" />
                </div>
              </div>
            ))}
        </div>

        {/* New Flow Modal */}
        <dialog className={['modal', showNewFlowModal ? 'modal-open' : ''].join(' ')}>
          <form method="dialog" className="modal-box">
            <h3 className="text-lg font-bold">Create New Flow</h3>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Flow Title</span>
              </label>
              <input
                type="text"
                placeholder="Flow Title"
                id="flow-title-field"
                className="input input-bordered w-full"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    setShowNewFlowModal(false)
                    createNewFlow()
                  }
                }}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setShowNewFlowModal(false)
                }}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowNewFlowModal(false)
                  createNewFlow()
                }}>
                Create
              </button>
            </div>
          </form>
        </dialog>
      </div>

      {/* Onboarding Modal */}
      <dialog ref={onboardingModal} className="modal">
        <form method="dialog" className="modal-box max-w-160 divide-y">
          <header>
            <h3 className="text-lg font-bold">Welcome to Flair AI!</h3>
            <p className="mb-2">Get started now to make powerful workflow</p>
          </header>
          <section className="grid grid-cols-2 gap-3 pt-3">
            <button
              className="flex items-center space-x-6 rounded-lg border p-3"
              onClick={() => {
                setShowNewFlowModal(true)
              }}>
              <span className="rounded-lg bg-secondary p-3">
                <ImFileEmpty className="m-3 h-6 w-6 text-white" />
              </span>
              <article className="flex flex-col justify-center text-left">
                <div className="flex items-center">
                  <p className="font-semibold">Empty template</p>
                  <BsArrowLeftShort className="h-5 w-5 rotate-180" />
                </div>
                <p className="line-clamp-2">Start with white blank canvas</p>
              </article>
            </button>
            <Link className="flex items-center space-x-6 rounded-lg border p-3" to="/templates">
              <span className="rounded-lg bg-primary p-3">
                <TfiLayoutWidthDefault className="m-3 h-6 w-6 text-white" />
              </span>
              <article className="flex flex-col justify-center text-left">
                <div className="flex items-center">
                  <p className="font-semibold">Workflow template</p>
                  <BsArrowLeftShort className="h-5 w-5 rotate-180" />
                </div>
                <p className="line-clamp-2">Ready to go template for you</p>
              </article>
            </Link>
          </section>
          <div className="modal-action justify-start pt-2">
            <button className="link-hover link-primary link">Or resume from previous work</button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default Index
