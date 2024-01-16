import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRocket } from 'react-icons/fa'
import { HiDocumentReport } from 'react-icons/hi'
import { getAverage } from '~/lib/averager'
import { timestampToLocaleString } from './LLMOutputs'
import { DocWorkflowResult } from 'Types/firebaseStructure'
import { OrderByDirection, WhereFilterOp } from 'firebase/firestore'
import usePaginatedFirestore from '~/lib/usePaginatedFirestore'
import { ImSpinner9 } from 'react-icons/im'

function Results() {
  const [column, setColumn] = useState('')
  const [substring, setSubstring] = useState('')
  const [where, setWhere] = useState<[string, WhereFilterOp, any][]>([
    ['docExists', '==', true],
    ['executorUserId', '==', 'IVqAyQJR4ugRGR8qL9UuB809OX82'],
  ])
  const [orders, setOrders] = useState<[string, OrderByDirection | undefined][]>([])

  const { items, loading, hasMore, loadMore } = usePaginatedFirestore<DocWorkflowResult>(
    'workflow_results',
    10,
    where as [string, WhereFilterOp, string][],
    orders,
  )

  return (
    <div>
      <div className="flex h-16 items-center border-b px-5">
        <div className="text-lg font-medium">Executions</div>
      </div>

      <div className="container mx-4 mb-9 mt-5 w-[calc(100%-2rem)] rounded-md border">
        <div className="flex items-center border-b p-3">
          <form className="join">
            <select
              className={' join-item ' + 'select select-bordered '}
              value={column}
              onChange={event => {
                setSubstring('')
                setColumn(event.target.value)
              }}>
              <option disabled value="">
                Column
              </option>
              <option value="model">Model</option>
              <option value="status">Status</option>
              {/* <option value="model and status">Model and Status</option> */}
              <option value="workflowRequestId">Request Id</option>
              <option value="workflowName">Workflow Name</option>
            </select>
            <input
              className="input join-item input-bordered"
              value={substring}
              onChange={event => setSubstring(event.target.value)}
              placeholder="Filter"
            />
            <button
              className="btn join-item"
              onClick={e => {
                e.preventDefault()
                let queryOrders: [string, OrderByDirection | undefined][] = []
                let queryFilter: [string, WhereFilterOp, any][] = [
                  ['docExists', '==', true],
                  ['executorUserId', '==', 'IVqAyQJR4ugRGR8qL9UuB809OX82'],
                ]
                if (column && substring) {
                  queryFilter.push([column, '>=', substring])
                  queryFilter.push([column, '<=', substring + '\uf8ff'])
                  queryOrders = [[column, 'desc']]
                }
                setWhere(queryFilter)
                setOrders(queryOrders)
              }}>
              Search
            </button>
          </form>
          <div className="flex-1" />
          <button className="btn btn-disabled gap-1" onClick={async () => {}}>
            <div>Compare Selections</div>
            <div className="text-xs">(soon)</div>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th />
                <th>Workflow Name</th>
                <th>Workflow Request Id</th>
                <th>Status</th>
                <th>Created</th>
                <th>Model</th>
                {/* <th>Faithfulness</th> */}
                <th>Latency</th>
                {/* <th>Context Relevancy</th> */}
                <th>Accuracy</th>
                <th>Invalid Format (%)</th>
                <th>Tokens per Request</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(el => {
                const averaged = el.averageEvaluationData ?? getAverage(el.evaluationData)

                return (
                  <tr key={el.workflowResultId}>
                    <td>
                      <div className="flex h-full w-full items-center justify-center">
                        <input type="checkbox" className="checkbox" />
                      </div>
                    </td>
                    <td>
                      <div className="w-24 break-words">{el.workflowName}</div>
                    </td>
                    <td>
                      <div className="w-24 break-words">{el.workflowRequestId}</div>
                    </td>
                    <td>
                      <div className="w-24 break-words">{(el as any).status || 'completed'}</div>
                    </td>
                    <td>
                      <div className="w-36">{timestampToLocaleString(el.createdTimestamp)}</div>
                    </td>
                    <td>
                      <div className="w-24">{el.model}</div>
                    </td>
                    {/* <td>{averaged.faithfulness?.toFixed(3) ?? '-'}</td> */}
                    <td>{averaged.average_latency_per_request?.toFixed(3) ?? '-'}</td>
                    {/* <td>{averaged.context_relevancy?.toFixed(3) ?? '-'}</td> */}
                    <td>{averaged.answer_relevancy?.toFixed(3) ?? '-'}</td>
                    <td>{averaged.invalid_format_percentage?.toFixed(2) ?? '-'}</td>
                    <td>{averaged.average_tokens_per_request?.toFixed(0) ?? '-'}</td>
                    <td>
                      <div style={{ minWidth: 250 }}>
                        <Link
                          className="btn m-1 bg-slate-200"
                          to={'/result/' + el.workflowResultId}>
                          <HiDocumentReport /> Details
                        </Link>
                        <a className="btn m-1 bg-slate-200" href="#" onClick={() => {}}>
                          <FaRocket /> Deploy
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {hasMore ? (
            <button className="btn mx-auto my-3 block w-36" onClick={loadMore}>
              {loading ? (
                <ImSpinner9 className="animate mx-auto h-5 w-5 animate-spin" />
              ) : (
                'Load More'
              )}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Results
