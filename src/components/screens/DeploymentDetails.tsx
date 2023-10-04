import * as React from 'react'
import { RiFlowChart } from 'react-icons/ri'
import { Link, useParams } from 'react-router-dom'
import { BarChart } from './deployment/BarChart'
import Results from './Results'
// import { PieChart } from './deployment/PieChart'
import { GiCheckMark, GiChecklist, GiSandsOfTime } from 'react-icons/gi'
import { HiDocumentReport } from 'react-icons/hi'
import { ImSpinner9 } from 'react-icons/im'

interface DeploymentDetailsProps {}

type Sentiment = 'neutral' | 'happy' | 'angry'

interface Result {
  resultPeriod: string
  processedEmails: string
  sentimentLevel: Sentiment
  flaggedForReview: string
}

function generateResults(length: number = 10): Result[] {
  const results: Result[] = []

  for (let i = 0; i < length; i++) {
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() - 1)
    endDate.setDate(endDate.getDate() + 2 * i)
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 1)

    const resultPeriod = `${startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} - ${endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`
    const processedEmails = Math.floor(Math.random() * 10000 + 1).toString()
    const sentiments: Sentiment[] = ['neutral', 'happy', 'angry']
    const sentimentLevel = sentiments[Math.floor(Math.random() * sentiments.length)]
    const flaggedForReview = Math.floor(Math.random() * 100 + 1).toString()

    results.push({
      resultPeriod,
      processedEmails,
      sentimentLevel,
      flaggedForReview,
    })

    // Shift the date back
    endDate.setDate(endDate.getDate() - 1)
  }

  return results
}

const DeploymentDetails: React.FunctionComponent<DeploymentDetailsProps> = props => {
  const { deploymentId } = useParams()

  return (
    <>
      <div className="container mx-auto mb-9 mt-6 rounded-md border px-6 py-3">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium">Deployment ID : {deploymentId}</h4>
          <button className="btn bg-slate-200" onClick={() => {}}>
            <RiFlowChart /> View Flow
          </button>
        </div>

        <div className="stats mt-4 w-full rounded-md border shadow-sm">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <GiChecklist className="h-10 w-10" />
            </div>
            <div className="stat-title">Data Processed</div>
            <div className="stat-value">3776 rows</div>
            <div className="stat-desc">3 GigaByte(s)</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <GiCheckMark className="h-10 w-10" />
            </div>
            <div className="stat-title">Success Rate</div>
            <div className="stat-value">78 %</div>
            <div className="stat-desc">From whole data</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <GiSandsOfTime className="h-10 w-10" />
            </div>
            <div className="stat-title">Average Time</div>
            <div className="stat-value">2.4 minutes</div>
            <div className="stat-desc">For each item</div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-1" />
          <BarChart />
          <div className="col-span-1" />
          {/* <PieChart /> */}
        </div>
      </div>

      <div className="container mx-auto mb-9 mt-6 rounded-md border">
        <div className="flex items-center border-b p-3">
          <form className="join">
            <select
              className={' join-item ' + 'select select-bordered '}
              // value={}
              // onChange={event => {}}
            >
              <option disabled value="">
                Column
              </option>
              <option value="period">Period</option>
              <option value="sentiment">Sentiment</option>
              <option value="satisfaction">Satisfaction</option>
            </select>
            <input
              className="input join-item input-bordered"
              // value={substring}
              // onChange={event => setSubstring(event.target.value)}
              placeholder="Filter"
            />
            <button
              className="btn join-item"
              onClick={e => {
                e.preventDefault()
              }}>
              Search
            </button>
          </form>
          <div className="flex-1" />
          <button className="btn gap-1" onClick={async () => {}}>
            <div>View Flagged</div>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th>Review Flag</th>
                <th>Result Period</th>
                <th>Processed Emails</th>
                <th>Avg. Sentiment Level</th>
                <th>Flagged for Review</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {generateResults().map(el => {
                return (
                  <tr key={el.resultPeriod}>
                    <td>
                      <div className="flex h-full w-full items-center justify-center">
                        <input type="checkbox" className="checkbox" />
                      </div>
                    </td>
                    <td>
                      <div className="">{el.resultPeriod}</div>
                    </td>
                    <td>
                      <div className="w-24 break-words">{el.processedEmails}</div>
                    </td>
                    <td>
                      <div className="w-24 break-words">{el.sentimentLevel}</div>
                    </td>
                    <td>
                      <div className="w-24 break-words">{el.flaggedForReview}</div>
                    </td>

                    <td>
                      <div>
                        <Link
                          className="btn m-1 bg-slate-200"
                          to={'/deployment/' + el.resultPeriod}>
                          <HiDocumentReport /> Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {true ? (
            <button className="btn mx-auto my-3 block w-36" onClick={() => {}}>
              {false ? (
                <ImSpinner9 className="animate mx-auto h-5 w-5 animate-spin" />
              ) : (
                'Load More'
              )}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default DeploymentDetails
