import React, { useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { useRef, useState } from 'react'
import { SignInButton } from '~/components/domain/auth/SignInButton'
import { SignOutButton } from '~/components/domain/auth/SignOutButton'
import { Head } from '~/components/shared/Head'
import { useAtomValue } from 'jotai'
import { atomUser, atomUserData } from '~/jotai/jotai'
import { db } from '~/lib/firebase'
import { DocFlowData } from 'Types/firebaseStructure'

function Index() {
  const [isOpen, setIsOpen] = useState(true)
  const completeButtonRef = useRef(null)

  const userData = useAtomValue(atomUserData)

  const [myFlows, setMyFlows] = useState<DocFlowData[]>([])

  useEffect(() => {
    if (!userData?.userId) {
      return
    }

    const unsub = db
      .collection('flow_data')
      .where('docExists', '==', true)
      .where('ownerUserId', '==', userData.userId)
      .orderBy('lastSaveTimestamp', 'desc')
      .limit(50)
      .onSnapshot(snaps => {
        const newMyFlows = snaps.docs.map(snap => snap.data() as DocFlowData)
        setMyFlows(newMyFlows)
      })

    return () => {
      unsub()
    }
  }, [userData])

  const createNewFlow = () => {}

  const [showNewFlowModal, setShowNewFlowModal] = useState(false)

  return (
    <>
      <Head title="Home" />
      <div className="container mx-auto py-2">
        <div className="py-2">
          <button
            className="btn-primary btn normal-case"
            onClick={() => {
              setShowNewFlowModal(true)
            }}>
            Create New Flow
          </button>
        </div>
        {myFlows.map(myFlow => (
          <div key={myFlow.flowDataId} className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Card title!</h2>
              <div className="card-actions justify-end">
                <button className="btn">Edit</button>
              </div>
            </div>
          </div>
        ))}
        <dialog className={['modal', showNewFlowModal ? 'modal-open' : ''].join(' ')}>
          <form method="dialog" className="modal-box">
            <h3 className="text-lg font-bold">Create New Flow</h3>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Flow Title</span>
              </label>
              <input type="text" placeholder="Type here" className="input-bordered input w-full" />
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
