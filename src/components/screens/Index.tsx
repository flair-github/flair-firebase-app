import React, { RefObject, useEffect } from 'react'
import { useRef, useState } from 'react'
import { Head } from '~/components/shared/Head'
import { useAtomValue } from 'jotai'
import { atomUserData } from '~/jotai/jotai'
import { db } from '~/lib/firebase'
import { DocWorkflow } from 'Types/firebaseStructure'
import { Timestamp, serverTimestamp } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { TfiLayoutWidthDefault } from 'react-icons/tfi'
import { BsArrowLeftShort, BsThreeDots } from 'react-icons/bs'
import { ImFileEmpty, ImSpinner8, ImSpinner9 } from 'react-icons/im'
import { Button } from '~/catalyst/button'
import clsx from 'clsx'
import { FaChevronRight } from 'react-icons/fa'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { TiFlowMerge } from 'react-icons/ti'
import { Switch } from '~/catalyst/switch'
import { USER_ID_MODE } from '~/config'
import { simpleHash } from '~/lib/simpleHash'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/catalyst/table'
import { Badge } from '~/catalyst/badge'

function Index() {
  const userData = useAtomValue(atomUserData)
  const [myFlows, setMyFlows] = useState<DocWorkflow[]>()

  useEffect(() => {
    if (!userData?.userId) {
      return
    }

    const unsub = db
      .collection('workflows')
      .where('docExists', '==', true)
      .where(
        'ownerUserId',
        '==',
        USER_ID_MODE === 'samir' ? 'IVqAyQJR4ugRGR8qL9UuB809OX82' : userData.userId,
      )
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
      ownerUserId: USER_ID_MODE === 'samir' ? 'IVqAyQJR4ugRGR8qL9UuB809OX82' : userData.userId,
    }

    ref.set(newFlowData)

    // TODO: Continue to flow editor
  }

  const [showNewFlowModal, setShowNewFlowModal] = useState(false)
  const navigate = useNavigate()

  const openWorkflow = (workflowId: string) => {
    navigate('/editor/' + workflowId)
  }
  const onboardingModal = useRef() as RefObject<HTMLDialogElement>
  useEffect(() => {
    onboardingModal.current?.showModal()
  }, [])

  const statuses: Record<string, string> = {
    Running: 'text-green-700 bg-green-50 ring-green-600/20',
    'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
    Paused: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
  }

  return (
    <>
      <Head title="Home" />
      <div className="min-h-full bg-slate-50">
        <div className="bg-slate-800 pb-32">
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex">
                <h1 className="text-3xl font-bold tracking-tight text-white">Pipelines</h1>
                <div className="flex-1" />
                <div className="flex gap-2">
                  <Button
                    color="blue"
                    onClick={() => {
                      setShowNewFlowModal(true)
                    }}>
                    + Add Pipeline
                  </Button>
                  <Button
                    color="zinc"
                    onClick={() => {
                      navigate('templates')
                    }}>
                    Flow Templates
                  </Button>
                </div>
              </div>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white px-5 py-2 shadow sm:px-6">
              {!myFlows && (
                <div className="flex h-72 w-full items-center justify-center">
                  <ImSpinner8 className="h-16 w-16 animate-spin text-slate-400" />
                </div>
              )}

              {/* Your content */}
              {myFlows && (
                <Table bleed className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
                  <TableHead>
                    <TableRow>
                      <TableHeader className="w-[0.1%]" />
                      <TableHeader>Pipeline</TableHeader>
                      <TableHeader className="w-[0.1%]" />
                      <TableHeader>Type</TableHeader>
                      <TableHeader>Frequency</TableHeader>
                      <TableHeader>Last Run</TableHeader>
                      <TableHeader className="w-[0.1%]" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myFlows.map(myflow => {
                      const isToggleOn =
                        typeof myflow.isToggleOn === 'boolean' ? myflow.isToggleOn : true
                      const isChatbot =
                        myflow.workflowTitle?.toLocaleLowerCase().includes('chatbot') || false

                      return (
                        <TableRow>
                          <TableCell className="">
                            <div className="flex items-center justify-center">
                              <Switch
                                color="blue"
                                defaultChecked
                                checked={isToggleOn}
                                onChange={checked => {
                                  db.collection('workflows').doc(myflow.workflowId).update({
                                    isToggleOn: checked,
                                  })
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell
                            className="cursor-pointer font-medium"
                            onClick={() => {
                              openWorkflow(myflow.workflowId)
                            }}>
                            {myflow.workflowTitle}
                          </TableCell>
                          <TableCell>
                            {isToggleOn ? (
                              <Badge color="green">Running</Badge>
                            ) : (
                              <Badge color="yellow">Paused</Badge>
                            )}
                          </TableCell>
                          <TableCell>{isChatbot ? 'Schedule' : 'API'}</TableCell>
                          <TableCell>
                            {isChatbot
                              ? 'On Demand'
                              : ['1d', '2d', '3d', '4d'][simpleHash(myflow.workflowTitle) % 4]}
                          </TableCell>
                          <TableCell>
                            {myflow.createdTimestamp?.toDate().toLocaleDateString()}
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            <Button
                              color="white"
                              onClick={() => {
                                openWorkflow(myflow.workflowId)
                              }}>
                              View Pipeline
                            </Button>
                            <Menu as="div" className="relative flex-none">
                              <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                <span className="sr-only">Open options</span>
                                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                              </Menu.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95">
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        onClick={event => {
                                          event.stopPropagation()
                                          db.collection('workflows').doc(myflow.workflowId).update({
                                            docExists: false,
                                          })
                                        }}
                                        className={clsx(
                                          active ? 'bg-gray-50' : '',
                                          'block cursor-pointer px-3 py-1 text-sm leading-6 text-gray-900',
                                        )}>
                                        Delete
                                      </a>
                                    )}
                                  </Menu.Item>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </main>
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

      {/* Onboarding Modal */}
      {/* <dialog ref={onboardingModal} className="modal">
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
                  <p className="font-bold">Empty template</p>
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
                  <p className="font-bold">Workflow template</p>
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
      </dialog> */}
    </>
  )
}

export default Index
