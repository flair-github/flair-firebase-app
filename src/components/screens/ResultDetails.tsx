import React, { useMemo } from 'react'
import { useState } from 'react'
// import { FLOW_SAMPLE_2 } from '~/constants/flowSamples'
import { FaShare, FaCloudDownloadAlt } from 'react-icons/fa'
import { PiFileCsvFill } from 'react-icons/pi'
import { CodeBlock } from 'react-code-blocks'
import { useParams } from 'react-router-dom'
import useFirestoreDoc from '~/lib/useFirestoreDoc'
import { DocLLMOutput, DocWorkflowResult } from 'Types/firebaseStructure'
import usePaginatedFirestore from '~/lib/usePaginatedFirestore'
import { ImSpinner9 } from 'react-icons/im'
import { AiOutlineExpand } from 'react-icons/ai'
import DetailModal from '../shared/DetailModal'
import { WhereFilterOp } from 'firebase/firestore'
import { timestampToLocaleString } from './LLMOutputs'

// const nodes = JSON.parse(FLOW_SAMPLE_2).nodes
// const edges = JSON.parse(FLOW_SAMPLE_2).edges

const snakeToTitle = (input: string): string => {
  return input
    .split('_') // Split the string on underscores
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(' ') // Join the words together with spaces
}

function ResultDetails() {
  const [activeTab, setActiveTab] = useState<'config' | 'evaluation' | 'result'>('evaluation')
  const { resultId } = useParams()
  const [data, loading, error] = useFirestoreDoc<any>('workflow_results', resultId as string)
  const [columnName, setColumnName] = useState<string>()
  const where: [string, WhereFilterOp, string][] = useMemo(() => {
    return [
      ['workflowResultId', '==', resultId as string],
      ...(columnName
        ? ([['columnName', '==', columnName]] as [string, WhereFilterOp, string][])
        : []),
    ]
  }, [resultId, columnName])

  const {
    items,
    loading: outputLoading,
    hasMore,
    loadMore,
  } = usePaginatedFirestore<DocLLMOutput>('llm_outputs', 10, where)

  const [isOpen, setIsOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<DocLLMOutput>()

  if (!data) {
    return <></>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-2 flex items-center ">
        <h1 className="text-3xl font-bold">Customer Call Workflow #1831</h1>
        <div className="flex-1" />
        <a className="btn btn-disabled mr-2 gap-1" href="#" onClick={() => {}}>
          <FaShare />
          <div>Share</div>
          <div className="text-xs">(soon)</div>
        </a>
        <a className="btn" href="#" onClick={() => {}}>
          <FaCloudDownloadAlt /> Download
        </a>
      </div>
      <div className="stats mb-4 w-full grid-cols-4 shadow">
        <div className="stat overflow-hidden">
          <div className="stat-title">Model</div>
          <div className="stat-value">{data.model}</div>
        </div>
        <div className="stat overflow-hidden">
          <div className="stat-title">Relevancy</div>
          <div className="stat-value">
            {data.averageEvaluationData.answer_relevancy?.toFixed?.(3)}
          </div>
          {/* <div className="stat-desc">5% more than last run</div> */}
        </div>
        <div className="stat overflow-hidden">
          <div className="stat-title">Hallucination</div>
          <div className="stat-value">-</div>
          {/* <div className="stat-desc">21% more than last run</div> */}
        </div>
        <div className="stat overflow-hidden">
          <div className="stat-title">Invalid Format</div>
          <div className="stat-value">
            {data.averageEvaluationData.invalid_format_percentage || 0}%
          </div>
          {/* <div className="stat-desc">4% more than last run</div> */}
        </div>
      </div>
      <div className="stats mb-4 w-full grid-cols-4 shadow">
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
          <div className="stat-value">{data.average_tokens_per_request}</div>
          {/* <div className="text-lg font-bold stat-desc">Avg: 56 tokens</div> */}
        </div>
        <div className="stat overflow-hidden">
          <div className="stat-title">Average Latency</div>
          <div className="stat-value">
            {data.averageEvaluationData.average_latency_per_request?.toFixed?.(3) ?? '-'}
          </div>
          {/* <div className="text-lg font-bold stat-desc">Avg: 200ms</div> */}
        </div>
      </div>
      <div className="tabs-boxed tabs mb-2 w-full justify-center">
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
      </div>
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
                <option value={undefined}>All</option>
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
            <thead>
              <tr>
                <th>LLM Input</th>
                <th>LLM Output</th>
                <th>Latency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items?.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="line-clamp-3 h-14 w-96">{item.input}</div>
                  </td>
                  <td>
                    <div className="line-clamp-3 h-14 w-96">{item.output}</div>
                  </td>
                  <td>{item.latency.toFixed(2) + ' seconds'}</td>
                  <td>
                    <div className="">
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
        <div className="justify-left flex w-full border [height:720px]">
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
                  <dt className="text-sm font-medium leading-6 text-gray-900">Region</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    us-west-2
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Bucket</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    bn-complete-dev-test
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Folder Path</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    llm/result/workflow1/*
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Result Type</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    CSV
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Files</dt>
                  <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <ul
                      role="list"
                      className="divide-y divide-gray-100 rounded-md border border-gray-200">
                      {Object.entries(data?.resultData || {}).map(([key, url]) => (
                        <li
                          key={key}
                          className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                          <div className="flex w-0 flex-1 items-center">
                            <PiFileCsvFill className="h-5 w-5 shrink-0 text-gray-400" />
                            <div className="min-w-0 ml-4 flex flex-1 gap-2">
                              <span className="truncate font-medium">{key}</span>
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
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'config' && (
        <div className="w-full overflow-y-auto border font-mono">
          <CodeBlock text={yaml} language="yaml" showLineNumbers={true} wrapLines />
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
