import React from 'react'
import { SignInButton } from '~/components/domain/auth/SignInButton'
import { SignOutButton } from '~/components/domain/auth/SignOutButton'
import { Head } from '~/components/shared/Head'
import FlowEditor from './FlowEditor'
import { useNavigate } from 'react-router-dom'

function PageResults() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto px-4">
      <div className="overflow-x-auto">
        <table className="table-zebra table">
          {/* head */}
          <thead>
            <tr>
              <th />
              <th>Workflow Name</th>
              <th>Request Date</th>
              <th>Total Time Taken</th>
              <th>Model</th>
              <th>Stats</th>
              <th>Result Link</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <a onClick={() => navigate('/result-details')}>Customer Call Workflow</a>
              </td>
              <td>2023-06-25 10:45:30</td>
              <td>15 minutes</td>
              <td>GPT-4</td>
              <td>Accuracy: 98%, Hallucination 0.2%, Invalid Format: 0%, Latency: 500ms</td>
              <td>
                <a className="btn bg-slate-200" href="#">
                  Link
                </a>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Invoice Approval Workflow</td>
              <td>2023-06-24 14:30:00</td>
              <td>8 minutes</td>
              <td>GPT-4</td>
              <td>Accuracy: 95%, Hallucination 0.2%, Invalid Format: 2%, Latency: 700ms</td>
              <td>
                <a className="btn bg-slate-200" href="#">
                  Link
                </a>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>Supply Chain Optimization Workflow</td>
              <td>2023-06-24 12:00:00</td>
              <td>30 minutes</td>
              <td>Falcon</td>
              <td>Accuracy: 90%, Hallucination 0.2%, Invalid Format: 5%, Latency: 800ms</td>
              <td>
                <a className="btn bg-slate-200" href="#">
                  Link
                </a>
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>Product Launch Process Workflow</td>
              <td>2023-06-23 16:15:00</td>
              <td>45 minutes</td>
              <td>GPT-3.5</td>
              <td>Accuracy: 93%, Hallucination 0.2%, Invalid Format: 1%, Latency: 550ms</td>
              <td>
                <a className="btn bg-slate-200" href="#">
                  Link
                </a>
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td>Financial Reporting</td>
              <td>2023-06-23 09:30:00</td>
              <td>20 minutes</td>
              <td>GPT-4</td>
              <td>Accuracy: 97%, Hallucination 0.2%, Invalid Format: 0%, Latency: 600ms</td>
              <td>
                <a className="btn bg-slate-200" href="#">
                  Link
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PageResults
