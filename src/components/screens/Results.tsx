import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FaRocket } from 'react-icons/fa'
import { HiDocumentReport } from 'react-icons/hi'
import { getAverage } from '~/lib/averager'
import { timestampToLocaleString } from './LLMOutputs'
import { DocWorkflowResult } from 'Types/firebaseStructure'
import { WhereFilterOp } from 'firebase/firestore'
import usePaginatedFirestore from '~/lib/usePaginatedFirestore'
import { ImSpinner9 } from 'react-icons/im'

function PageResults() {
  const where = useMemo(
    () => [
      ['docExists', '==', true],
      ['executorUserId', '==', 'IVqAyQJR4ugRGR8qL9UuB809OX82'],
    ],
    [],
  )
  const { items, loading, hasMore, loadMore } = usePaginatedFirestore<DocWorkflowResult>(
    'workflow_results',
    10,
    where as [string, WhereFilterOp, string][],
  )

  return (
    <div className="container mx-auto mb-9 mt-6 rounded-md border">
      <div className="border-grayscaleDivider flex h-[3rem] border-b">
        <div className="flex-1" />
        <button
          className="btn btn-disabled m-1 h-[2.5rem] min-h-[2.5rem] gap-1"
          onClick={async () => {}}>
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
              <th>Answer Relevancy</th>
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
                        to={'/result-details/' + el.workflowResultId}>
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
  )
}

export default PageResults
