import React from 'react'
import { SignInButton } from '~/components/domain/auth/SignInButton'
import { SignOutButton } from '~/components/domain/auth/SignOutButton'
import { Head } from '~/components/shared/Head'
import FlowEditor from './FlowEditor'
import { useNavigate } from 'react-router-dom'
import { FaCloudDownloadAlt } from 'react-icons/fa'
import { HiDocumentReport } from 'react-icons/hi'

function PageResults() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto border-x">
      <div className="border-grayscaleDivider flex h-[3rem] border-b">
        <div className="flex-1" />
        <button className="btn m-1 h-[2.5rem] min-h-[2.5rem]" onClick={async () => {}}>
          Compare Selections
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-zebra table">
          {/* head */}
          <thead>
            <tr>
              <th />
              <th>Job Id</th>
              <th>Workflow</th>
              <th>Request Date</th>
              <th>Total Time Taken</th>
              <th>Model</th>
              <th>Stats</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="flex h-full w-full items-center justify-center">
                  <input type="checkbox" className="checkbox" />
                </div>
              </td>
              <td>#1831</td>
              <td>
                Customer Call Workflow <br />
                <span className="badge badge-outline whitespace-nowrap text-xs">
                  Workflow Id: #12
                </span>
              </td>
              <td>2023-06-25 10:45:30</td>
              <td>15 minutes</td>
              <td>gpt-4</td>
              <td>Accuracy: 98%, Hallucination 1.2%, Invalid Format: 0%, Latency: 200ms</td>
              <td>
                <div style={{ minWidth: 300 }}>
                  <a
                    className="btn m-1 bg-slate-200"
                    href="#"
                    onClick={() => navigate('/result-details')}>
                    <HiDocumentReport /> Details
                  </a>
                  <a className="btn m-1 bg-slate-200" href="#" onClick={() => {}}>
                    <FaCloudDownloadAlt /> Download
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="flex h-full w-full items-center justify-center">
                  <input type="checkbox" className="checkbox" />
                </div>
              </td>
              <td>#1830</td>
              <td>
                Customer Call Workflow
                <br />
                <span className="badge badge-outline whitespace-nowrap text-xs">
                  Workflow Id: #12
                </span>
              </td>
              <td>2023-06-24 14:30:00</td>
              <td>8 minutes</td>
              <td>gpt-3.5</td>
              <td>Accuracy: 95%, Hallucination 2.4%, Invalid Format: 2%, Latency: 500ms</td>
              <td>
                <div style={{ minWidth: 300 }}>
                  <a
                    className="btn m-1 bg-slate-200"
                    href="#"
                    onClick={() => navigate('/result-details')}>
                    <HiDocumentReport /> Details
                  </a>
                  <a className="btn m-1 bg-slate-200" href="#" onClick={() => {}}>
                    <FaCloudDownloadAlt /> Download
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="flex h-full w-full items-center justify-center">
                  <input type="checkbox" className="checkbox" />
                </div>
              </td>
              <td>#1829</td>
              <td>
                Supply Chain Optimization Workflow <br />
                <span className="badge badge-outline whitespace-nowrap text-xs">
                  Workflow Id: #3
                </span>
              </td>
              <td>2023-06-24 12:00:00</td>
              <td>30 minutes</td>
              <td>Falcon</td>
              <td>Accuracy: 90%, Hallucination 0.2%, Invalid Format: 5%, Latency: 800ms</td>
              <td>
                <div style={{ minWidth: 300 }}>
                  <a
                    className="btn m-1 bg-slate-200"
                    href="#"
                    onClick={() => navigate('/result-details')}>
                    <HiDocumentReport /> Details
                  </a>
                  <a className="btn m-1 bg-slate-200" href="#" onClick={() => {}}>
                    <FaCloudDownloadAlt /> Download
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="flex h-full w-full items-center justify-center">
                  <input type="checkbox" className="checkbox" />
                </div>
              </td>
              <td>#1828</td>
              <td>
                Product Launch Process Workflow
                <br />
                <span className="badge badge-outline whitespace-nowrap text-xs">
                  Workflow Id: #5
                </span>
              </td>
              <td>2023-06-23 16:15:00</td>
              <td>45 minutes</td>
              <td>gpt-3.5</td>
              <td>Accuracy: 93%, Hallucination 0.2%, Invalid Format: 1%, Latency: 550ms</td>
              <td>
                <div style={{ minWidth: 300 }}>
                  <a
                    className="btn m-1 bg-slate-200"
                    href="#"
                    onClick={() => navigate('/result-details')}>
                    <HiDocumentReport /> Details
                  </a>
                  <a className="btn m-1 bg-slate-200" href="#" onClick={() => {}}>
                    <FaCloudDownloadAlt /> Download
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="flex h-full w-full items-center justify-center">
                  <input type="checkbox" className="checkbox" />
                </div>
              </td>
              <td>#1827</td>
              <td>
                Financial Reporting <br />
                <span className="badge badge-outline whitespace-nowrap text-xs">
                  {' '}
                  Workflow Id: #6
                </span>
              </td>
              <td>2023-06-23 09:30:00</td>
              <td>20 minutes</td>
              <td>gpt-4</td>
              <td>Accuracy: 97%, Hallucination 0.2%, Invalid Format: 0%, Latency: 600ms</td>
              <td>
                <div style={{ minWidth: 300 }}>
                  <a
                    className="btn m-1 bg-slate-200"
                    href="#"
                    onClick={() => navigate('/result-details')}>
                    <HiDocumentReport /> Details
                  </a>
                  <a className="btn m-1 bg-slate-200" href="#" onClick={() => {}}>
                    <FaCloudDownloadAlt /> Download
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PageResults
