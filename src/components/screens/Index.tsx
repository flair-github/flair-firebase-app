import React, { useEffect } from 'react'
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
import { useNavigate } from 'react-router-dom'
import { MoonLoader, RingLoader } from 'react-spinners'

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

  return (
    <>
      <Head title="Home" />
      <div className="container mx-auto px-4 py-2">
        <div className="mb-5 mt-3">
          <button
            className="btn-primary btn normal-case"
            onClick={() => {
              setShowNewFlowModal(true)
            }}>
            Create New Flow
          </button>
        </div>

        {/* List of My Flows */}

        {!myFlows && (
          <div className="flex h-52 items-center justify-center">
            <MoonLoader color="rgba(0,0,0,0.2)" />
          </div>
        )}
        {myFlows &&
          myFlows.map(myFlow => (
            <div key={myFlow.workflowId} className="card mb-4 w-96 border bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{myFlow.workflowTitle}</h2>
                <div className="card-actions flex justify-end">
                  <button
                    className="btn-ghost btn"
                    onClick={() => {
                      db.collection('workflows').doc(myFlow.workflowId).delete()
                    }}>
                    Delete
                  </button>
                  <div className="flex-1" />
                  <button
                    className="btn"
                    onClick={() => {
                      navigate('editor', { state: { workflowId: myFlow.workflowId } })
                    }}>
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}

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
                className="input-bordered input w-full"
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
                className="btn-primary btn"
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
    </>
  )
}

export default Index
