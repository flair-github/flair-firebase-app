import React, { useMemo, SyntheticEvent, useEffect } from 'react'
import { useState } from 'react'
// import { FLOW_SAMPLE_2 } from '~/constants/flowSamples'
import { FaShare, FaCloudDownloadAlt } from 'react-icons/fa'
import { PiFileCsvFill } from 'react-icons/pi'
import { ImFilesEmpty } from 'react-icons/im'
import { CodeBlock } from 'react-code-blocks'
import { useParams } from 'react-router-dom'
import useFirestoreDoc from '~/lib/useFirestoreDoc'
import { DocLLMOutput, DocWorkflowResult } from 'Types/firebaseStructure'
import usePaginatedFirestore from '~/lib/usePaginatedFirestore'
import { ImSpinner9 } from 'react-icons/im'
import { AiOutlineCopy, AiOutlineEdit, AiOutlineExpand } from 'react-icons/ai'
import { Firestore, Timestamp, WhereFilterOp } from 'firebase/firestore'
import { timestampToLocaleString } from './LLMOutputs'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../../lib/firebase'
import { useCopyToClipboard } from 'react-use'
import DetailModal from '../shared/DetailModal'

// const nodes = JSON.parse(FLOW_SAMPLE_2).nodes
// const edges = JSON.parse(FLOW_SAMPLE_2).edges

const downloadYAML = (yaml: string) => {
  const blob = new Blob([yaml], { type: 'text/yaml' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = 'config.yaml' // or any other filename you want
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function getFilenameFromURL(urlString: string, defaultName: string): string {
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

// const snakeToTitle = (input: string): string => {
//   return input
//     .split('_') // Split the string on underscores
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
//     .join(' ') // Join the words together with spaces
// }

function ResultDetails({ id }: { id?: string }) {
  const [activeTab, setActiveTab] = useState<'config' | 'evaluation' | 'result'>('evaluation')
  const resultId =
    id ?? window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]

  const [data, loading, error] = useFirestoreDoc<DocWorkflowResult>(
    'workflow_results',
    resultId as string,
  )
  const [columnName, setColumnName] = useState<string>()
  const where: [string, WhereFilterOp, string][] = useMemo(
    () => [
      ['workflowResultId', '==', resultId as string],
      ...(columnName
        ? ([['columnName', '==', columnName]] as [string, WhereFilterOp, string][])
        : []),
    ],
    [resultId, columnName],
  )

  const {
    items,
    loading: outputLoading,
    hasMore,
    loadMore,
  } = usePaginatedFirestore<DocLLMOutput>('llm_outputs', 10, where)

  const [isOpen, setIsOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<DocLLMOutput>()
  const [sharedToken, setSharedToken] = useState('')
  useEffect(() => {
    setSharedToken(data?.shared_token ?? '')
  }, [data])

  const [_state, copyToClipboard] = useCopyToClipboard()

  if (!data) {
    return <></>
  }

  const averageEval = data.averageEvaluationData

  const shareHandler = async (event: SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      event.preventDefault()
      // Generate a UUID as shared_token
      const newSharedToken = uuidv4()
      // Calculate the expiration timestamp (3 days from now)
      const expirationTimestamp = new Date()
      expirationTimestamp.setDate(expirationTimestamp.getDate() + 3)

      const documentRef = db.collection('workflow_results').doc(resultId as string)
      await documentRef.update({
        shared_token: newSharedToken,
        shared_expiry: Timestamp.fromDate(expirationTimestamp),
      })
      console.log('Document updated successfully.')
      setSharedToken(newSharedToken)
    } catch (err) {
      console.error('Error updating document:', err)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-2 flex items-center ">
        <h1 className="text-3xl font-bold">{'Workflow Result'}</h1>
        <div className="flex-1" />
        {sharedToken ? (
          <div className="join flex w-96 items-center divide-x divide-gray-300 border bg-white shadow-sm">
            <h5 className="truncate px-3">
              {window.location.origin + '?shared_token=' + sharedToken}
            </h5>
            <button
              className="btn btn-outline join-item border-0"
              onClick={() =>
                copyToClipboard(window.location.origin + '?shared_token=' + sharedToken)
              }>
              <AiOutlineCopy className="h-6 w-6" />
            </button>
          </div>
        ) : (
          <button className="btn gap-1" onClick={shareHandler}>
            <FaShare />
            <div>{'Share'}</div>
          </button>
        )}
      </div>
      <header className="stats mb-4 w-full grid-cols-4 border shadow">
        <div className="stat overflow-hidden">
          <div className="stat-title">Model</div>
          <div className="stat-value">{data.model}</div>
        </div>
        <div className="stat overflow-hidden">
          <div className="stat-title">Relevancy</div>
          <div className="stat-value">{averageEval.answer_relevancy?.toFixed(3)}</div>
          {/* <div className="stat-desc">5% more than last run</div> */}
        </div>
        <div className="stat overflow-hidden">
          <div className="stat-title">Hallucination</div>
          <div className="stat-value">-</div>
          {/* <div className="stat-desc">21% more than last run</div> */}
        </div>
        <div className="stat overflow-hidden">
          <div className="stat-title">Invalid Format</div>
          <div className="stat-value">{averageEval.invalid_format_percentage || 0}%</div>
          {/* <div className="stat-desc">4% more than last run</div> */}
        </div>
      </header>
      <header className="stats mb-4 w-full grid-cols-4 border shadow">
        <div className="stat overflow-hidden">
          <div className="stat-title">Request Time</div>
          <div className="stat-value text-sm">
            {timestampToLocaleString(data.createdTimestamp)}
            {/* <div className="text-3xl">2023/06/25</div>
            <div className="stat-desc text-lg font-bold">10:45:30</div> */}
          </div>
        </div>
        <div className="stat overflow-hidden">
          <div className="stat-title">Total Time</div>
          <div className="stat-value">-</div>
        </div>
        <div className="stat overflow-hidden">
          <div className="stat-title">Average Tokens</div>
          <div className="stat-value">
            {typeof averageEval.average_tokens_per_request === 'number'
              ? Math.round(averageEval.average_tokens_per_request)
              : '-'}
          </div>
          {/* <div className="text-lg font-bold stat-desc">Avg: 56 tokens</div> */}
        </div>
        <div className="stat overflow-hidden">
          <div className="stat-title">Average Latency</div>
          <div className="stat-value">
            {averageEval.average_latency_per_request?.toFixed(3) ?? '-'}
          </div>
          {/* <div className="text-lg font-bold stat-desc">Avg: 200ms</div> */}
        </div>
      </header>
      <nav className="tabs-boxed tabs mb-2 w-full justify-center">
        <a
          className={`tab tab-lg font-bold ${activeTab === 'evaluation' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('evaluation')}>
          Evaluation
        </a>
        <a
          className={`tab tab-lg font-bold ${activeTab === 'result' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('result')}>
          Result
        </a>
        <a
          className={`tab tab-lg font-bold ${activeTab === 'config' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('config')}>
          Config
        </a>
      </nav>
      {activeTab === 'evaluation' && (
        <div>
          <div className="mb-3 flex space-x-2">
            <div className="form-control w-80">
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
                    {/* {snakeToTitle(item)} */}
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1" />
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
          <table className="table w-full shadow">
            {items?.length ? (
              <>
                <thead>
                  <tr>
                    <th>LLM Input</th>
                    <th>LLM Output</th>
                    <th>Answer</th>
                    <th>Latency</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="line-clamp-3 h-14 w-96">{item.input}</div>
                      </td>
                      <td>
                        <div className="line-clamp-3 h-14 w-96">{item.output}</div>
                      </td>
                      <td>
                        <div className="line-clamp-3 h-14 w-36 break-words">{item.answer}</div>
                      </td>
                      <td>{item.latency.toFixed(2) + ' seconds'}</td>
                      <td>
                        <div className="w-32">
                          <button
                            className="btn bg-slate-200"
                            onClick={() => {
                              setSelectedRow(item)
                              setIsOpen(true)
                            }}>
                            <AiOutlineExpand /> Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <div className="my-36 flex w-full flex-col items-center justify-center space-y-6">
                <ImFilesEmpty className="h-32 w-32" />
                <h5 className="text-lg font-semibold">There is empty result for this query</h5>
              </div>
            )}
          </table>
          {hasMore ? (
            <button className="btn mx-auto my-3 block w-36" onClick={loadMore}>
              {outputLoading ? (
                <ImSpinner9 className="animate mx-auto h-5 w-5 animate-spin" />
              ) : (
                'Load More'
              )}
            </button>
          ) : null}
        </div>
      )}
      {activeTab === 'result' && (
        <div className="justify-left flex w-full border">
          <div className="container max-w-200 p-5">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">Workflow Result</h3>
              {/* <p className="max-w-2xl mt-1 text-sm leading-6 text-gray-500">
                Personal details and application.
              </p> */}
            </div>
            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Storage Location</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">S3</dd>
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
                    {data?.outputData && (
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
                    )}
                  </dd>
                </section>
                {/* Result files */}
                <section className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Evaluation Files</dt>
                  <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {data?.resultData && (
                      <ul
                        role="list"
                        className="divide-y divide-gray-100 rounded-md border border-gray-200">
                        {Object.entries(data.resultData).map(([key, url]) => (
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
                    )}
                  </dd>
                </section>
              </dl>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'config' && (
        <div className="relative w-full overflow-y-auto border font-mono">
          <CodeBlock text={yaml} language="yaml" showLineNumbers={true} wrapLines />
          <button
            className="btn absolute right-3 top-3"
            onClick={() => {
              downloadYAML(yaml)
            }}>
            <FaCloudDownloadAlt /> Download
          </button>
        </div>
      )}
      {selectedRow ? (
        <DetailModal key={selectedRow?.id} open={isOpen} setOpen={setIsOpen} item={selectedRow} />
      ) : null}
    </div>
  )
}

export default ResultDetails

const yaml = `name: 'My LLM workflow'
description: 'Workflow that extracts information from customer support calls.'
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
