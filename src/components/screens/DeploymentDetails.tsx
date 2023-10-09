import * as React from 'react'
import { RiFlowChart } from 'react-icons/ri'
import { useParams } from 'react-router-dom'
import { BarChart } from './deployment/BarChart'
// import { PieChart } from './deployment/PieChart'
import { GiCheckMark, GiChecklist, GiSandsOfTime } from 'react-icons/gi'
import { HiDocumentReport } from 'react-icons/hi'
import { ImSpinner9 } from 'react-icons/im'
import { MdForwardToInbox } from 'react-icons/md'
import { BsReplyAll } from 'react-icons/bs'

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

const complaints = [
  {
    id: 1,
    email: 'john.doe@example.com',
    subject: 'Faulty Product Received',
    message:
      'I recently purchased a product from your website and it arrived faulty. Please assist.',
    date: '2023-10-01',
  },
  {
    id: 2,
    email: 'jane.smith@example.com',
    subject: 'Late Delivery',
    message:
      'My order was supposed to arrive last week and I still haven’t received it. Can you update me on the status?',
    date: '2023-10-02',
  },
  {
    id: 3,
    email: 'samuel.jones@example.com',
    subject: 'Incorrect Item Sent',
    message:
      'I ordered a blue shirt and received a red one instead. Please send me the correct item.',
    date: '2023-10-03',
  },
  {
    id: 4,
    email: 'lucy.williams@example.com',
    subject: 'Billing Issue',
    message: 'I was double charged for my last purchase. Please refund the extra charge.',
    date: '2023-10-04',
  },
  {
    id: 5,
    email: 'michael.brown@example.com',
    subject: 'Website Issue',
    message:
      'I was trying to place an order on your website and it kept crashing. Can you look into this?',
    date: '2023-10-05',
  },
]

const DeploymentDetails: React.FunctionComponent<DeploymentDetailsProps> = props => {
  const { deploymentId } = useParams()

  return (
    <>
      <div className="container mx-4 mb-9 mt-6 w-[calc(100%-2rem)] rounded-md border px-6 py-3">
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

      <div className="container mx-4 mb-9 mt-6 w-[calc(100%-2rem)] rounded-md border">
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
                <th>Result Period</th>
                <th>Processed Emails</th>
                <th>Complaint Emails</th>
                <th>Forward to Sales</th>
                <th>Flagged for Review</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {generateResults().map(el => {
                return (
                  <tr key={el.resultPeriod}>
                    <td>
                      <div className="">{el.resultPeriod}</div>
                    </td>
                    <td>
                      <div className="w-24 break-words">{el.processedEmails}</div>
                    </td>
                    <td>
                      <div className="w-24 break-words">{Math.ceil(Math.random() * 20)}</div>
                    </td>
                    <td>
                      <div className="w-24 break-words">{Math.ceil(Math.random() * 20)}</div>
                    </td>
                    <td>
                      <div className="w-24 break-words">{el.flaggedForReview}</div>
                    </td>

                    <td>
                      <div>
                        <button
                          className="btn m-1 bg-slate-200"
                          onClick={() => {
                            ;(document.getElementById('my_modal') as HTMLDialogElement).showModal()
                          }}>
                          <HiDocumentReport /> Details
                        </button>
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
      <dialog id="my_modal" className="modal">
        <div className="modal-box w-5/6 max-w-200">
          <form method="dialog">
            <div className="mb-4 flex w-full items-center justify-between">
              <h3 className="text-lg font-bold">Details List</h3>
              <button className="btn btn-circle btn-ghost btn-sm">✕</button>
            </div>
          </form>
          <div className="grid grid-cols-2 gap-3">
            {complaints.map(complaint => (
              <div key={complaint.id} className="card card-side border bg-base-100 shadow-sm">
                <div className="card-body px-6 py-3">
                  <h2 className="card-title">{complaint.subject}</h2>
                  <p>{complaint.message}</p>
                  <div className="card-actions items-center justify-between text-sm">
                    <p>{complaint.email}</p>
                    <span className="join">
                      <div className="tooltip tooltip-bottom" data-tip="Reply">
                        <button className="btn join-item btn-sm">
                          <BsReplyAll />
                        </button>
                      </div>
                      <div className="tooltip tooltip-bottom" data-tip="Forward">
                        <button className="btn join-item btn-sm">
                          <MdForwardToInbox />
                        </button>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default DeploymentDetails
