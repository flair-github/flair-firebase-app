import React, { RefObject, useEffect } from 'react'
import { useRef, useState } from 'react'
import { Head } from '~/components/shared/Head'
import { useAtomValue } from 'jotai'
import { atomUserData } from '~/jotai/jotai'
import { db } from '~/lib/firebase'
import { DocWorkflow, DocWorkflowResult } from 'Types/firebaseStructure'
import { Timestamp, serverTimestamp } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { TfiLayoutWidthDefault } from 'react-icons/tfi'
import { BsArrowLeftShort, BsTerminalFill, BsThreeDots } from 'react-icons/bs'
import { ImFileEmpty, ImSpinner8, ImSpinner9 } from 'react-icons/im'
import { Button } from '~/catalyst/button'
import clsx from 'clsx'
import { FaChevronRight, FaCloudUploadAlt, FaTasks } from 'react-icons/fa'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronRightIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { TiFlowMerge } from 'react-icons/ti'
import { Switch } from '~/catalyst/switch'
import { USER_ID_MODE } from '~/config'
import { simpleHash } from '~/lib/simpleHash'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/catalyst/table'
import { Badge } from '~/catalyst/badge'
import { convertToKebab } from '~/lib/utils'
import { Modal } from '../ui/modal'
import { PiChatBold, PiEnvelope, PiFileText, PiHeadset, PiPhoneCallFill } from 'react-icons/pi'
import { RiNotificationBadgeFill } from 'react-icons/ri'
import { FaChalkboard, FaEnvelope, FaMagnifyingGlass, FaPython } from 'react-icons/fa6'
import { REAL_ESTATE_PIPELINE } from '~/constants/flowSamples'
import { BiSolidFileJson } from 'react-icons/bi'

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

  const [createNewFlowTitle, setCreateNewFlowTitle] = useState('')
  const [showCreateFlowSpinner, setShowCreateFlowSpinner] = useState(false)

  const createNewFlow = async (frontendConfig: string) => {
    if (!userData?.userId) {
      return
    }

    try {
      setShowCreateFlowSpinner(false)
      if (frontendConfig.length > 1) {
        setShowCreateFlowSpinner(true)
      }

      const ref = db.collection('workflows').doc()
      const newFlowData: DocWorkflow = {
        createdTimestamp: serverTimestamp() as Timestamp,
        updatedTimestamp: serverTimestamp() as Timestamp,
        lastSaveTimestamp: serverTimestamp() as Timestamp,
        docExists: true,
        workflowId: ref.id,
        frontendConfig,
        workflowTitle: createNewFlowTitle || 'New Flow',
        ownerUserId: USER_ID_MODE === 'samir' ? 'IVqAyQJR4ugRGR8qL9UuB809OX82' : userData.userId,
      }

      await ref.set(newFlowData)
      setCreateNewFlowTitle('')

      if (frontendConfig.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 11000))
        setShowCreateFlowSpinner(false)
      }
    } catch (e) {
      setShowCreateFlowSpinner(false)
    }
  }

  const createNewPythonFlow = async () => {
    if (!userData?.userId) {
      return
    }

    try {
      setShowCreateFlowSpinner(false)

      const ref = db.collection('workflows').doc()
      const newFlowData: DocWorkflow = {
        createdTimestamp: serverTimestamp() as Timestamp,
        updatedTimestamp: serverTimestamp() as Timestamp,
        lastSaveTimestamp: serverTimestamp() as Timestamp,
        docExists: true,
        workflowId: ref.id,
        frontendConfig: '',
        workflowTitle: createNewFlowTitle || 'New Flow',
        ownerUserId: USER_ID_MODE === 'samir' ? 'IVqAyQJR4ugRGR8qL9UuB809OX82' : userData.userId,
        isPythonScript: true,
      }

      await ref.set(newFlowData)
      setCreateNewFlowTitle('')
    } catch (e) {
      setShowCreateFlowSpinner(false)
    }
  }

  const [showNewFlowModal, setShowNewFlowModal] = useState(false)
  const [showNewFlowModalFromDescription, setShowNewFlowModalFromDescription] = useState(false)
  const [showNewFlowModalFromPython, setShowNewFlowModalFromPython] = useState(false)
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

  const [addPipelineModal, setAddPipelineModal] = useState(false)

  const items = [
    {
      name: 'Empty Pipeline',
      description: 'Create a blank pipeline and start editing in flow editor',
      onClick: () => {
        setAddPipelineModal(false)
        setShowNewFlowModal(true)
      },
      iconColor: 'bg-blue-500',
      icon: FaChalkboard,
      grayedOut: false,
    },
    {
      name: 'Generate Pipeline from Prompt',
      description: 'Automatically generate pipeline from a text description',
      onClick: () => {
        setAddPipelineModal(false)
        setShowNewFlowModalFromDescription(true)
      },
      iconColor: 'bg-green-500',
      icon: BsTerminalFill,
      grayedOut: false,
    },
    {
      name: 'Upload JSON config',
      description: 'Load previously created config in JSON',
      onClick: () => {
        setAddPipelineModal(false)
      },
      iconColor: 'bg-yellow-500',
      icon: BiSolidFileJson,
      grayedOut: false,
    },
    {
      name: 'Upload Python Script',
      description: 'Load advanced pipelining features using ',
      onClick: () => {
        setAddPipelineModal(false)
        setShowNewFlowModalFromPython(true)
      },
      iconColor: 'bg-red-500',
      icon: FaPython,
      grayedOut: false,
    },
  ]

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
                  {/* <Button
                    color="blue"
                    onClick={() => {
                      setAddPipelineModal(true)
                    }}>
                    + New Pipeline
                  </Button> */}
                  <Button
                    color="blue"
                    onClick={() => {
                      setShowNewFlowModal(true)
                    }}>
                    + New Pipeline
                  </Button>
                  <Button
                    color="zinc"
                    onClick={() => {
                      setShowNewFlowModalFromDescription(true)
                    }}>
                    + Pipeline Templates
                  </Button>
                </div>
              </div>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="overflow-x-hidden rounded-lg bg-white px-5 py-2 shadow sm:px-6">
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
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Type</TableHeader>
                      <TableHeader>Frequency</TableHeader>
                      <TableHeader>Created Date</TableHeader>
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
                        <TableRow key={myflow.workflowId}>
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
                            <div className="flex flex-1 gap-2">
                              <span>{myflow.workflowTitle}</span>
                              {/* {myflow.isPythonScript && <Badge color="teal">Python</Badge>} */}
                            </div>
                          </TableCell>
                          <TableCell>
                            {isToggleOn ? (
                              <Badge color="green">Running</Badge>
                            ) : (
                              <Badge color="yellow">Paused</Badge>
                            )}
                          </TableCell>
                          <TableCell>{isChatbot ? 'API' : 'Schedule'}</TableCell>
                          <TableCell>
                            {isChatbot && (
                              <div className="text-sm">
                                api.flairlabs.ai/testcompany/{convertToKebab(myflow.workflowTitle)}
                              </div>
                            )}
                            {!isChatbot &&
                              ['1d', '2d', '3d', '4d'][simpleHash(myflow.workflowTitle) % 4]}
                          </TableCell>
                          <TableCell>
                            {myflow.createdTimestamp?.toDate().toLocaleDateString()}
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            <Button
                              color="white"
                              onClick={() => {
                                if (myflow.isPythonScript) {
                                  return
                                }

                                openWorkflow(myflow.workflowId)
                              }}>
                              {myflow.isPythonScript ? 'View Pipeline' : 'View Pipeline'}
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
                                    {({ focus }) => (
                                      <a
                                        onClick={event => {
                                          const workflowResult: Partial<DocWorkflowResult> = {
                                            docExists: true,
                                            averageEvaluationData: 0.86,
                                            workflowName: myflow.workflowTitle,
                                            workflowRequestId: db
                                              .collection('workflow_results')
                                              .doc().id,
                                            frontendConfig: '',
                                            workflowId: myflow.workflowId || '',
                                            status: 'initiated',
                                            createdTimestamp: new Date() as any,
                                            model: 'gpt-4',
                                            executorUserId: 'IVqAyQJR4ugRGR8qL9UuB809OX82',
                                            isPythonScript: true,
                                          }

                                          const exp1: Partial<DocWorkflowResult> = {
                                            ...workflowResult,
                                            workflowRequestId: db
                                              .collection('workflow_results')
                                              .doc().id,
                                            model: 'gpt-4',
                                            createdTimestamp: new Date(Date.now() - 2000) as any,
                                          }
                                          db.collection('workflow_results').add(exp1)

                                          const exp2: Partial<DocWorkflowResult> = {
                                            ...workflowResult,
                                            workflowRequestId: db
                                              .collection('workflow_results')
                                              .doc().id,
                                            model: 'claude-2',
                                            createdTimestamp: new Date(Date.now() - 1000) as any,
                                          }
                                          db.collection('workflow_results').add(exp2)

                                          const exp3: Partial<DocWorkflowResult> = {
                                            ...workflowResult,
                                            workflowRequestId: db
                                              .collection('workflow_results')
                                              .doc().id,
                                            model: 'google-7b-v0-1',
                                            createdTimestamp: new Date(Date.now() - 0) as any,
                                          }
                                          db.collection('workflow_results').add(exp3)
                                        }}
                                        className={clsx(
                                          focus ? 'bg-gray-50' : '',
                                          'block cursor-pointer px-3 py-1 text-sm leading-6 text-gray-900',
                                        )}>
                                        Run Experiments
                                      </a>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ focus }) => (
                                      <a
                                        onClick={event => {
                                          event.stopPropagation()
                                          db.collection('workflows').doc(myflow.workflowId).update({
                                            docExists: false,
                                          })
                                        }}
                                        className={clsx(
                                          focus ? 'bg-gray-50' : '',
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
          <h3 className="text-lg font-bold">Create New Pipeline</h3>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Flow Title</span>
            </label>
            <input
              type="text"
              placeholder="Flow Title"
              className="input input-bordered w-full"
              value={createNewFlowTitle}
              onChange={ev => setCreateNewFlowTitle(ev.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  setShowNewFlowModal(false)
                  createNewFlow('')
                }
              }}
            />
          </div>
          <div className="modal-action flex items-center justify-center">
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
                createNewFlow('')
              }}>
              Create
            </button>
          </div>
        </form>
      </dialog>

      {/* New Flow Modal from description */}
      <Modal
        shown={showNewFlowModalFromDescription}
        onClickBackdrop={() => setShowNewFlowModalFromDescription(false)}>
        <div>
          <h3 className="text-lg font-bold">Auto Pipeline</h3>
          {!showCreateFlowSpinner && (
            <>
              <div className="form-control my-1 w-full">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="input input-bordered w-full"
                  value={createNewFlowTitle}
                  onChange={ev => setCreateNewFlowTitle(ev.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      setShowNewFlowModalFromDescription(false)
                      createNewFlow(REAL_ESTATE_PIPELINE)
                    }
                  }}
                />
              </div>
              <div className="form-control my-1 w-full">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  rows={5}
                  placeholder=""
                  className="input input-bordered h-[200px] w-full"
                />
              </div>
              <div className="modal-action flex items-center justify-center">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    createNewFlow(REAL_ESTATE_PIPELINE)
                    setTimeout(() => {
                      setShowNewFlowModalFromDescription(false)
                    }, 8000)
                  }}>
                  Create a new pipeline <span className="text-2xl">✨</span>
                </button>
              </div>
            </>
          )}
          {showCreateFlowSpinner && (
            <div className="flex h-32 w-full items-center justify-center">
              <ImSpinner8 className="h-16 w-16 animate-spin text-slate-400" />
            </div>
          )}
        </div>
      </Modal>

      {/* List of pipelines */}
      <Modal
        shown={addPipelineModal}
        size="sm"
        onClickBackdrop={() => {
          setAddPipelineModal(false)
        }}>
        <div className="mx-auto">
          <h2 className="text-base font-semibold leading-6 text-gray-900">Start a Pipeline</h2>
          {/* <p className="mt-1 text-sm text-gray-500">
            Get started by selecting a template or start from an empty project.
          </p> */}
          <ul role="list" className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>
                <div
                  className={clsx(
                    'group relative flex items-start space-x-3 py-4',
                    item.grayedOut && 'opacity-50',
                  )}>
                  <div className="shrink-0">
                    <span
                      className={clsx(
                        item.iconColor,
                        'inline-flex h-10 w-10 items-center justify-center rounded-lg',
                      )}>
                      <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      <a className="cursor-pointer" onClick={item.onClick}>
                        <span className="absolute inset-0" aria-hidden="true" />
                        {item.name}
                      </a>
                    </div>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="shrink-0 self-center">
                    <ChevronRightIcon
                      className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* <div className="flex flex-col items-center justify-center">
            <p className="my-3 text-sm text-gray-500">
              or generate automated pipeline from a text description
            </p>
            <Button
              color="blue"
              onClick={() => {
                setShowNewFlowModalFromDescription(true)
                setAddAgentModal(false)
              }}>
              Start from Description
            </Button>
          </div> */}
        </div>
      </Modal>

      {/* New Flow Modal from Python */}
      <Modal
        shown={showNewFlowModalFromPython}
        onClickBackdrop={() => setShowNewFlowModalFromPython(false)}>
        <div>
          <h3 className="text-lg font-bold">Create Pipeline from Python</h3>
          {!showCreateFlowSpinner && (
            <>
              <div className="form-control my-1 w-full">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="input input-bordered w-full"
                  value={createNewFlowTitle}
                  onChange={ev => setCreateNewFlowTitle(ev.target.value)}
                  onKeyDown={async e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      setShowNewFlowModalFromPython(false)

                      await createNewPythonFlow()
                      setCreateNewFlowTitle('')
                    }
                  }}
                />
              </div>

              <div className="form-control my-1 w-full">
                <label className="label">
                  <span className="label-text">Python Script</span>
                </label>
                <div className="flex">
                  <Button
                    className="flair-btn-primary btn-sm"
                    color="white"
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.click()
                    }}>
                    <FaCloudUploadAlt className="mr-1" />
                    <span>Upload</span>
                  </Button>
                </div>
              </div>

              <div className="modal-action flex items-center justify-center">
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    setShowNewFlowModalFromPython(false)

                    await createNewPythonFlow()
                    setCreateNewFlowTitle('')
                  }}>
                  Create Pipeline
                </button>
              </div>
            </>
          )}
          {showCreateFlowSpinner && (
            <div className="flex h-32 w-full items-center justify-center">
              <ImSpinner8 className="h-16 w-16 animate-spin text-slate-400" />
            </div>
          )}
        </div>
      </Modal>

      {/* Onboarding Modal */}
      {/* <dialog ref={onboardingModal} className="modal">
        <form method="dialog" className="modal-box max-w-160 divide-y">
          <header>
            <h3 className="text-lg font-bold">Welcome to Flair AI!</h3>
            <p className="mb-2">Get started now to make powerful pipeline</p>
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
                  <p className="font-bold">Pipeline template</p>
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
