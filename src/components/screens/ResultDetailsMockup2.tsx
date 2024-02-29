import React, { useMemo, SyntheticEvent, useEffect, useRef, LegacyRef } from 'react'
import { useState } from 'react'
import { FaShare, FaCloudDownloadAlt, FaCheckCircle } from 'react-icons/fa'
import { PiFileCsvFill, PiTableBold } from 'react-icons/pi'
import { ImFilesEmpty, ImSpinner8 } from 'react-icons/im'
import { CodeBlock } from 'react-code-blocks'
import useFirestoreDoc from '~/lib/useFirestoreDoc'
import { DocLLMOutput, DocWorkflow, DocWorkflowResult } from 'Types/firebaseStructure'
import usePaginatedFirestore from '~/lib/usePaginatedFirestore'
import { ImSpinner9 } from 'react-icons/im'
import { AiOutlineCopy, AiOutlineExpand } from 'react-icons/ai'
import { timestampToLocaleDateOnly, timestampToLocaleString } from './LLMOutputs'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../../lib/firebase'
import { useCopyToClipboard } from 'react-use'
import DetailModal from '../shared/DetailModal'
import { WhereFilterOp } from 'firebase/firestore'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/catalyst/table'
import { callCenterData } from '~/constants/callCenterData'
import { Checkbox } from '~/catalyst/checkbox'
import { Button } from '~/catalyst/button'
import { TbCaretUpDownFilled } from 'react-icons/tb'
import { FaFilter } from 'react-icons/fa6'
import { Input } from '~/catalyst/input'
import clsx from 'clsx'
import { useAtom } from 'jotai'
import { resultDataAtom } from './Results'
import { chatbotData } from '~/constants/chatbotData'
import FlowEditor from './FlowEditor'
import { CALL_CENTER_GRADING_ID, FAQ_CHATBOT_ID } from '~/constants/workflowIds'

const yaml = `name: 'My LLM Pipeline'
description: 'Pipeline that extracts information from customer support calls.'
tags: ['audio-pipelines']
frequency: '1d'
customer_id: 'IVqAyQJR4ugRGR8qL9UuB809OX82'

data_sources:
  - name: s3
    type: s3
    uri: mp3s
    data_type: mp3
    data_indexer_name: data_indexer_1
    data_retriever_name: data_retriever_1

data_indexers:
  - name: data_indexer_1
    type: default

data_retrievers:
  - name: data_retriever_1
    type: default

llm_processors:
  - name: llm_processor_1
    type: qa
    data_exporter_name: s3
    data_sources:
      - s3
    questions:
      - name: 'customer_objections'
        type: 'text'
        prompt_strategy: 'CoT'
        model_name: 'gpt-3.5-turbo'
        instruction: ''
        prompt: 'What are some customer objections if there are any otherwise None.'
        self_consistency: 0
      - name: 'call_type'
        type: 'category'
        options: ['schedule_appt', 'live_transfer', 'callback', 'NA']
        prompt_strategy: 'CoT'
        model_name: 'gpt-3.5-turbo'
        instruction: ''
        prompt: 'Which of the categories does the conversation best match?'
        self_consistency: 10

data_exporters:
  - name: s3
    type: s3
    uri: 'output'
    data_type: 'csv'
`

const downloadYAML = (yamlString: string) => {
  const blob = new Blob([yamlString], { type: 'text/yaml' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = 'config.yaml' // can be adjusted
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getFilenameFromURL = (urlString: string, defaultName: string): string => {
  const url = new URL(urlString)
  const pathname = url.pathname

  const parts = pathname.split('/')
  const filename = parts[parts.length - 1]

  // Ensure the filename has an extension
  if (/\.[a-z0-9]{2,4}$/i.test(filename)) {
    return filename
  }

  return defaultName
}

const ResultDetailsMockup2 = ({ id }: { id?: string }) => {
  const [activeTab, setActiveTab] = useState<'Evaluation' | 'Result' | 'Pipeline'>('Evaluation')
  const resultId =
    id ?? window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]
  const [sharedToken, setSharedToken] = useState('')

  const [workflowResultData] = useFirestoreDoc<DocWorkflowResult>(
    'workflow_results',
    resultId as string,
  )
  const [columnName, setColumnName] = useState<string>()
  const whereConditions = useMemo(() => {
    const conditions: [string, WhereFilterOp, string][] = [['workflowResultId', '==', resultId]]

    if (columnName) {
      const columnCondition: [string, WhereFilterOp, string] = ['columnName', '==', columnName]
      conditions.push(columnCondition)
    }

    return conditions
  }, [resultId, columnName]) // Dependencies for useMemo, recompute when these change.

  const [resultData, setResultData] = useAtom(resultDataAtom)
  const inlineOutputArray = useMemo(() => {
    if (resultData?.inlineOutput) {
      const index0 = resultData.inlineOutput[0]
      const headers = Object.keys(index0).sort()
      const contents: string[][] = [headers]

      for (const rowObj of resultData.inlineOutput) {
        const rowArray: string[] = []

        for (const header of headers) {
          rowArray.push(rowObj[header] || '')
        }

        contents.push(rowArray)
      }

      return contents
    }

    return undefined
  }, [resultData?.inlineOutput])

  // const {
  //   items,
  //   loading: outputLoading,
  //   hasMore,
  //   loadMore,
  // } = usePaginatedFirestore<DocLLMOutput>('llm_outputs', 10, where)

  const [isOpen, setIsOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<DocLLMOutput>()

  const [_state, copyToClipboard] = useCopyToClipboard()
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    setSharedToken(workflowResultData?.shared_token ?? '')
  }, [workflowResultData])

  const [editMode, setEditMode] = useState<Set<number>>(new Set())

  const tabs = [
    { name: 'Evaluation', href: '#', current: activeTab === 'Evaluation' },
    { name: 'Result', href: '#', current: activeTab === 'Result' },
    { name: 'Pipeline', href: '#', current: activeTab === 'Pipeline' },
  ]

  const runningModalRef: LegacyRef<HTMLDialogElement> = useRef(null)
  const [runningModalStep, setRunningModalStep] = useState<number>(1)

  const [workflowData, setWorkflowData] = useState<DocWorkflow>()
  useEffect(() => {
    const workflowId = resultData?.workflowId

    if (!workflowId) {
      return
    }

    const unsub = db
      .collection('workflows')
      .doc(workflowId)
      .onSnapshot(snap => {
        const data: DocWorkflow | undefined = snap?.data() as any
        setWorkflowData(data)
      })

    return () => {
      unsub()
    }
  }, [resultData?.workflowId])

  if (!workflowResultData) {
    return <></>
  }

  const averageEval = workflowResultData.averageEvaluationData
  const shareHandler = async (event: SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      setSharing(true)
      event.preventDefault()
      // Generate a UUID as shared_token
      const newSharedToken = uuidv4()

      // Query preparation
      const documentRef = db.collection('workflow_results').doc(resultId as string)
      const llmOutputsQuerySnapshot = await db
        .collection('llm_outputs')
        .where('workflowResultId', '==', resultId)
        .get()
      const batch = db.batch()
      llmOutputsQuerySnapshot.forEach(doc => {
        batch.update(doc.ref, { shared_token: sharedToken })
      })

      // Commit
      await documentRef.update({
        shared_token: newSharedToken,
      })
      await batch.commit()

      console.log('Document updated successfully.')
      setSharedToken(newSharedToken)
    } catch (err) {
      console.error('Error updating document:', err)
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="container mx-auto bg-slate-50">
      <div className="flex h-[68px] flex-none items-center border-b bg-white px-[20px]">
        <div className="text-[20px] font-medium">Execution Result: {resultData?.workflowName}</div>
        <div className="flex-1" />
      </div>

      <div className="p-4">
        <div>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Model</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">GPT-4</dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Accuracy</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">94%</dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Hallucination</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">1%</dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Invalid Format</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">2%</dd>
            </div>
          </dl>
        </div>

        <div>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Request Time</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">2/5/2024</dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Total Time</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">1h 12min</dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Average Tokens</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                56 tokens
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Average Latency</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">200ms</dd>
            </div>
          </dl>
        </div>

        <div className="my-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map(tab => (
              <a
                key={tab.name}
                onClick={() => setActiveTab(tab.name as any)}
                className={clsx(
                  tab.current
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'cursor-pointer whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
                )}
                aria-current={tab.current ? 'page' : undefined}>
                {tab.name}
              </a>
            ))}
          </nav>
        </div>

        {activeTab === 'Pipeline' && resultData?.frontendConfig && (
          <div>
            <div className="h-[600px] w-full">
              <FlowEditor viewOnlyFrontEndConfig={resultData.frontendConfig} />
            </div>
          </div>
        )}

        {activeTab === 'Evaluation' && (
          <div>
            <div className="flex space-x-2">
              <div className="justify-items flex items-center gap-2">
                <Button color="white">
                  <FaFilter />
                  Filter
                </Button>
                <Input placeholder="Search" />
                <Button color="blue" onClick={(e: any) => {}}>
                  Search
                </Button>
              </div>
              <div className="flex-1" />
              <div className="justify-items flex items-center">
                <Button
                  color="blue"
                  disabled={editMode.size === 0}
                  onClick={async () => {
                    runningModalRef.current?.showModal()
                    setRunningModalStep(1)
                    await new Promise(resolve => setTimeout(resolve, 3000))
                    setRunningModalStep(2)
                    await new Promise(resolve => setTimeout(resolve, 3000))
                    setRunningModalStep(3)
                    await new Promise(resolve => setTimeout(resolve, 2000))
                    runningModalRef.current?.close()

                    db.collection('workflow_results').add({
                      docExists: true,
                      averageEvaluationData: 0.86,
                      workflowName: resultData?.workflowName,
                      workflowRequestId: db.collection('workflow_results').doc().id,
                      status: 'initiated',
                      createdTimestamp: new Date(),
                      model: 'gpt-4',
                      executorUserId: 'IVqAyQJR4ugRGR8qL9UuB809OX82',
                    })
                  }}>
                  Retrain model
                </Button>
              </div>
              {/* <div className="form-control w-80">
              <label className="label">
                <span className="label-text">LLM Output Column</span>
              </label>
              <select
                className="select select-bordered"
                onChange={({ target: { value } }) => {
                  setColumnName(value)
                }}>
                <option value="">All</option>
                {(data?.evaluationData ? Object.keys(data.evaluationData) : []).map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div> */}
              {/* <div className="form-control w-80">
              <label className="label">
                <span className="label-text">Similarity Score</span>
              </label>
              <select className="select select-bordered">
                <option>All</option>
                <option>{'< 0.9'}</option>
                <option>{'< 0.8'}</option>
                <option>{'< 0.7'}</option>
                <option>{'< 0.6'}</option>
                <option>{'< 0.5'}</option>
              </select>
            </div>
            <div className="form-control w-80">
              <label className="label">
                <span className="label-text">OpenAI Eval</span>
              </label>
              <select className="select select-bordered">
                <option>All</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div> */}
            </div>

            {/* Table */}
            <div className="-mx-4 overflow-x-auto overflow-y-hidden px-4">
              <div className="mt-5 flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full pb-5 pt-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          {inlineOutputArray ? (
                            <tr>
                              <th
                                scope="col"
                                className="w-[0.1%] whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              />
                              {inlineOutputArray[0].map(header => (
                                <th
                                  key={header}
                                  scope="col"
                                  className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                  {header}{' '}
                                  <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                                </th>
                              ))}
                            </tr>
                          ) : resultData?.workflowId === FAQ_CHATBOT_ID ? (
                            <tr>
                              <th
                                scope="col"
                                className="w-[0.1%] whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              />
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Input{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Retrieved Context{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Output{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Hallucination{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Invalid Format{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                            </tr>
                          ) : (
                            <tr>
                              <th
                                scope="col"
                                className="w-[0.1%] whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              />
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Filename{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Transcript{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Summary{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Outcome{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Call Type{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Call Type Reason{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Call Type Confidence{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Used Proper Introduction{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Identified Call Reason{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Demonstrated Effective Listening{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Expressed Proper Empathy{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Used Professional Language{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Used Accurate Grammar{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Provided Accurate Information{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Rudeness/Dishonesty/Fraud{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Call Flow Followed{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Call Flow Followed Reason{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Score{' '}
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Hallucination Detected
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                              <th
                                scope="col"
                                className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Invalid Format
                                <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                              </th>
                            </tr>
                          )}{' '}
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {inlineOutputArray
                            ? inlineOutputArray.slice(1).map((row, index) => (
                                <tr>
                                  <td className="px-3 py-4 text-sm text-gray-500">
                                    <Checkbox
                                      color="blue"
                                      checked={editMode.has(index)}
                                      onChange={checked => {
                                        if (checked) {
                                          setEditMode(prev => {
                                            const newSet = new Set(prev)
                                            newSet.add(index)
                                            return newSet
                                          })
                                        } else {
                                          setEditMode(prev => {
                                            const newSet = new Set(prev)
                                            newSet.delete(index)
                                            return newSet
                                          })
                                        }
                                      }}
                                    />
                                  </td>
                                  {row.map((el, i) => (
                                    <td
                                      key={i}
                                      onClick={() => {
                                        setEditMode(prev => {
                                          const newSet = new Set(prev)
                                          newSet.add(index)
                                          return newSet
                                        })
                                      }}
                                      className={clsx(
                                        'max-w-80 px-3 py-4 text-sm text-gray-500',
                                        !editMode.has(index) && 'truncate',
                                        editMode.has(index) && 'bg-yellow-100',
                                      )}
                                      contentEditable={editMode.has(index)}>
                                      {el}
                                    </td>
                                  ))}
                                </tr>
                              ))
                            : resultData?.workflowId === FAQ_CHATBOT_ID
                            ? chatbotData.map((row, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-4 text-sm text-gray-500">
                                    <Checkbox
                                      color="blue"
                                      checked={editMode.has(index)}
                                      onChange={checked => {
                                        if (checked) {
                                          setEditMode(prev => {
                                            const newSet = new Set(prev)
                                            newSet.add(index)
                                            return newSet
                                          })
                                        } else {
                                          setEditMode(prev => {
                                            const newSet = new Set(prev)
                                            newSet.delete(index)
                                            return newSet
                                          })
                                        }
                                      }}
                                    />
                                  </td>
                                  <td
                                    onClick={() => {
                                      setEditMode(prev => {
                                        const newSet = new Set(prev)
                                        newSet.add(index)
                                        return newSet
                                      })
                                    }}
                                    className={clsx(
                                      'max-w-80 px-3 py-4 text-sm text-gray-500',
                                      !editMode.has(index) && 'truncate',
                                    )}>
                                    {row.input}
                                  </td>
                                  <td
                                    onClick={() => {
                                      setEditMode(prev => {
                                        const newSet = new Set(prev)
                                        newSet.add(index)
                                        return newSet
                                      })
                                    }}
                                    className={clsx(
                                      'max-w-80 px-3 py-4 text-sm text-gray-500',
                                      !editMode.has(index) && 'truncate',
                                    )}>
                                    {row.retrievedContext}{' '}
                                  </td>
                                  {[row.output].map((el, i) => (
                                    <td
                                      key={i}
                                      onClick={() => {
                                        setEditMode(prev => {
                                          const newSet = new Set(prev)
                                          newSet.add(index)
                                          return newSet
                                        })
                                      }}
                                      className={clsx(
                                        'max-w-80 px-3 py-4 text-sm text-gray-500',
                                        !editMode.has(index) && 'truncate',
                                        editMode.has(index) && 'bg-yellow-100',
                                      )}
                                      contentEditable={editMode.has(index)}>
                                      {el}
                                    </td>
                                  ))}
                                  <td
                                    onClick={() => {
                                      setEditMode(prev => {
                                        const newSet = new Set(prev)
                                        newSet.add(index)
                                        return newSet
                                      })
                                    }}
                                    className={clsx(
                                      'px-3 py-4 text-sm text-gray-500',
                                      editMode.has(index) && 'bg-yellow-100',
                                    )}>
                                    No
                                  </td>
                                  <td
                                    onClick={() => {
                                      setEditMode(prev => {
                                        const newSet = new Set(prev)
                                        newSet.add(index)
                                        return newSet
                                      })
                                    }}
                                    className={clsx(
                                      'px-3 py-4 text-sm text-gray-500',
                                      editMode.has(index) && 'bg-yellow-100',
                                    )}>
                                    No
                                  </td>
                                </tr>
                              ))
                            : callCenterData.map((row, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-4 text-sm text-gray-500">
                                    <Checkbox
                                      color="blue"
                                      checked={editMode.has(index)}
                                      onChange={checked => {
                                        if (checked) {
                                          setEditMode(prev => {
                                            const newSet = new Set(prev)
                                            newSet.add(index)
                                            return newSet
                                          })
                                        } else {
                                          setEditMode(prev => {
                                            const newSet = new Set(prev)
                                            newSet.delete(index)
                                            return newSet
                                          })
                                        }
                                      }}
                                    />
                                  </td>
                                  <td
                                    onClick={() => {
                                      setEditMode(prev => {
                                        const newSet = new Set(prev)
                                        newSet.add(index)
                                        return newSet
                                      })
                                    }}
                                    className={clsx(
                                      'max-w-80 px-3 py-4 text-sm text-gray-500',
                                      !editMode.has(index) && 'truncate',
                                    )}>
                                    {row.filename}
                                  </td>
                                  <td
                                    onClick={() => {
                                      setEditMode(prev => {
                                        const newSet = new Set(prev)
                                        newSet.add(index)
                                        return newSet
                                      })
                                    }}
                                    className={clsx(
                                      'max-w-80 px-3 py-4 text-sm text-gray-500',
                                      !editMode.has(index) && 'truncate',
                                    )}>
                                    {row.transcript}{' '}
                                  </td>
                                  {[
                                    row.summary,
                                    row.outcome,
                                    row.call_type,
                                    row.call_type_reason,
                                    row.call_type_confidence,
                                    row.used_proper_introduction,
                                    row.identified_call_reason,
                                    row.demonstrate_effective_listening,
                                    row.expressed_proper_empathy,
                                    row.used_professional_language,
                                    row.used_accurate_grammar,
                                    row.provided_accurate_information,
                                    row.rudeness_dishonesty_fraud,
                                    row.call_flow_followed,
                                    row.call_flow_followed_reason,
                                    row.score,
                                  ].map((el, i) => (
                                    <td
                                      key={i}
                                      onClick={() => {
                                        setEditMode(prev => {
                                          const newSet = new Set(prev)
                                          newSet.add(index)
                                          return newSet
                                        })
                                      }}
                                      className={clsx(
                                        'max-w-80 px-3 py-4 text-sm text-gray-500',
                                        !editMode.has(index) && 'truncate',
                                        editMode.has(index) && 'bg-yellow-100',
                                      )}
                                      contentEditable={editMode.has(index)}>
                                      {el}
                                    </td>
                                  ))}
                                  <td
                                    onClick={() => {
                                      setEditMode(prev => {
                                        const newSet = new Set(prev)
                                        newSet.add(index)
                                        return newSet
                                      })
                                    }}
                                    className={clsx(
                                      'px-3 py-4 text-sm text-gray-500',
                                      editMode.has(index) && 'bg-yellow-100',
                                    )}>
                                    No
                                  </td>
                                  <td
                                    onClick={() => {
                                      setEditMode(prev => {
                                        const newSet = new Set(prev)
                                        newSet.add(index)
                                        return newSet
                                      })
                                    }}
                                    className={clsx(
                                      'px-3 py-4 text-sm text-gray-500',
                                      editMode.has(index) && 'bg-yellow-100',
                                    )}>
                                    No
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* {hasMore ? (
            <button className="btn mx-auto my-3 block w-36" onClick={loadMore}>
              {outputLoading ? (
                <ImSpinner9 className="animate mx-auto h-5 w-5 animate-spin" />
              ) : (
                'Load More'
              )}
            </button>
          ) : null} */}
          </div>
        )}

        {activeTab === 'Result' && (
          <div className="justify-left flex w-full border bg-white">
            <div className="container max-w-200 p-5">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-bold leading-7 text-gray-900">Pipeline Result</h3>
                {/* <p className="max-w-2xl mt-1 text-sm leading-6 text-gray-500">
                Personal details and application.
              </p> */}
              </div>
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Storage Location
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      S3
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Result Type</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      CSV
                    </dd>
                  </div>
                  {/* Output files */}
                  <section className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Output Files</dt>
                    <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {/* {data?.outputData && (
                      <ul
                        role="list"
                        className="divide-y divide-gray-100 rounded-md border border-gray-200">
                        {Object.entries(data.outputData).map(([key, url]) => (
                          <li
                            key={key}
                            className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                            <div className="flex w-0 flex-1 items-center">
                              <PiFileCsvFill className="h-5 w-5 shrink-0 text-gray-400" />
                              <div
                                className="min-w-0 ml-4 flex flex-1 gap-2 overflow-hidden"
                                style={{ direction: 'rtl' }}>
                                <p className="truncate font-medium">
                                  {getFilenameFromURL(url, key)}
                                </p>
                              </div>
                            </div>
                            <div className="ml-4 shrink-0">
                              <a
                                target="_blank"
                                href={url as string}
                                className="font-medium text-primary hover:text-primary/80">
                                Download
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )} */}
                      <ul
                        role="list"
                        className="divide-y divide-gray-100 rounded-md border border-gray-200">
                        <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                          <div className="flex w-0 flex-1 items-center">
                            <PiTableBold className="h-5 w-5 shrink-0 text-gray-400" />
                            <div className="ml-4 flex min-w-0 flex-1 gap-2 overflow-hidden">
                              <p className="truncate font-medium">
                                call_center_grading_partial_1_27
                              </p>
                            </div>
                          </div>
                          <div className="ml-4 shrink-0">
                            <a
                              target="_blank"
                              href={
                                resultData?.workflowId === CALL_CENTER_GRADING_ID
                                  ? 'https://docs.google.com/spreadsheets/d/1ey04b4cJNy6VZLa74pW7HTaukZ9rFZsRX0lgQ_Ou_bA/edit#gid=0'
                                  : 'https://docs.google.com/spreadsheets/d/1QzgPwvy4Ws1OHJ8geUvdoyUufU--nEkc1w9KHFNG3IE/edit#gid=1720787933'
                              }
                              className="font-medium text-primary hover:text-primary/80">
                              Open
                            </a>
                          </div>
                        </li>
                      </ul>
                    </dd>
                  </section>
                  {/* Result files */}
                  <section className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Evaluation Files
                    </dt>
                    <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {workflowResultData?.resultData && (
                        <ul
                          role="list"
                          className="divide-y divide-gray-100 rounded-md border border-gray-200 empty:hidden">
                          {Object.entries(workflowResultData.resultData).map(([key, url]) => (
                            <li
                              key={key}
                              className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                              <div className="flex w-0 flex-1 items-center">
                                <PiFileCsvFill className="h-5 w-5 shrink-0 text-gray-400" />
                                <div
                                  className="ml-4 flex min-w-0 flex-1 gap-2 overflow-hidden"
                                  style={{ direction: 'rtl' }}>
                                  <p className="truncate font-medium">
                                    {getFilenameFromURL(url, key)}
                                  </p>
                                </div>
                              </div>
                              <div className="ml-4 shrink-0">
                                <a
                                  target="_blank"
                                  href={url as string}
                                  className="font-medium text-primary hover:text-primary/80">
                                  Download
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </dd>
                  </section>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedRow ? (
        <DetailModal key={selectedRow?.id} open={isOpen} setOpen={setIsOpen} item={selectedRow} />
      ) : null}

      <RunModal dialogRef={runningModalRef} step={runningModalStep} />
    </div>
  )
}

export default ResultDetailsMockup2

export const RunModal = ({ dialogRef, step }: { dialogRef: any; step: number }) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="mb-5 text-center text-lg font-bold">
          {step === 1 && 'Automatically updating prompts'}
          {step === 2 && 'Deploying'}
          {step === 3 && 'Done'}
        </h3>
        {/* <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button> */}
        <div className="mb-2 mt-1">
          <div className="flex h-32 w-full items-center justify-center">
            {(step === 1 || step === 2) && (
              <ImSpinner8 className="h-16 w-16 animate-spin text-slate-400" />
            )}
            {step === 3 && <FaCheckCircle className="h-16 w-16 text-slate-400" />}
          </div>
          <div />
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
