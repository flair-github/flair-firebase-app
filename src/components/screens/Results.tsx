import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRocket } from 'react-icons/fa'
import { HiDocumentReport } from 'react-icons/hi'
import { db } from '~/lib/firebase'
import { getAverage } from '~/lib/averager'
import { timestampToLocaleString } from './LLMOutputs'
import { DocWorkflowResult } from 'Types/firebaseStructure'

function PageResults() {
  const [results, setResults] = useState<DocWorkflowResult[]>([])
  useEffect(() => {
    const unsub = db
      .collection('workflow_results')
      .where('docExists', '==', true)
      .where('executorUserId', '==', 'IVqAyQJR4ugRGR8qL9UuB809OX82')
      .orderBy('createdTimestamp', 'desc')
      .limit(50)
      .onSnapshot(snaps => {
        const newResults = snaps.docs.map(
          snap => ({ ...snap.data(), workflowResultId: snap.id } as DocWorkflowResult),
        )
        setResults(newResults)
      })

    return () => {
      unsub()
    }
  }, [])

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
              <th>Workflow Result Id</th>
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
            {results.map(el => {
              const averaged = el.averageEvaluationData ?? getAverage(el.evaluationData)

              return (
                <tr key={el.workflowResultId}>
                  <td>
                    <div className="flex h-full w-full items-center justify-center">
                      <input type="checkbox" className="checkbox" />
                    </div>
                  </td>
                  <td>
                    <div className="w-24 break-words">{el.workflowResultId}</div>
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
      </div>
    </div>
  )
}

export default PageResults
