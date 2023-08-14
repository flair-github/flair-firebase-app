import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRocket } from 'react-icons/fa'
import { HiDocumentReport } from 'react-icons/hi'
import { db } from '~/lib/firebase'
import { getAverage } from '~/lib/averager'
import { timestampToLocaleString } from './LLMOutputs'

function PageResults() {
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    const unsub = db
      .collection('workflow_results')
      .where('docExists', '==', true)
      .where('executorUserId', '==', 'IVqAyQJR4ugRGR8qL9UuB809OX82')
      .orderBy('createdTimestamp', 'desc')
      .limit(50)
      .onSnapshot(snaps => {
        const newResults = snaps.docs.map(
          snap => ({ ...snap.data(), workflowResultId: snap.id } as any),
        )
        setResults(newResults)
      })

    return () => {
      unsub()
    }
  }, [])
  console.log(results)

  return (
    <div className="container mx-auto border-x">
      <div className="border-grayscaleDivider flex h-[3rem] border-b">
        <div className="flex-1" />
        <button
          className="btn-disabled btn m-1 h-[2.5rem] min-h-[2.5rem] gap-1"
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
              <th>Job Id</th>
              <th>Timestamp</th>
              <th>Total Time Taken</th>
              <th>Model</th>
              <th>Accuracy</th>
              <th>Hallucination</th>
              <th>Invalid Format</th>
              <th>Latency</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {results.map(el => {
              return (
                <tr key={el.workflowResultId}>
                  <td>
                    <div className="flex items-center justify-center w-full h-full">
                      <input type="checkbox" className="checkbox" />
                    </div>
                  </td>
                  <td>{el.workflowResultId}</td>
                  <td>
                    <div className="w-32">{timestampToLocaleString(el.createdTimestamp)}</div>
                  </td>
                  <td>15 minutes</td>
                  <td>gpt-4</td>
                  <td>98%</td>
                  <td>1.2%</td>
                  <td>0%</td>
                  <td>
                    {el.evaluationData?.average_latency_per_request ??
                      getAverage(el.evaluationData).average_latency_per_request}
                  </td>
                  <td>
                    <div style={{ minWidth: 250 }}>
                      <Link
                        className="m-1 btn bg-slate-200"
                        to={'/result-details/' + el.workflowResultId}>
                        <HiDocumentReport /> Details
                      </Link>
                      <a className="m-1 btn bg-slate-200" href="#" onClick={() => {}}>
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
