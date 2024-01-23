import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaRocket } from 'react-icons/fa'
import { HiDocumentReport } from 'react-icons/hi'

function PageResults() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto border-x">
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
              <th>Job Id</th>
              <th>Pipeline</th>
              <th>Request Date</th>
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
            <tr>
              <td>
                <div className="flex h-full w-full items-center justify-center">
                  <input type="checkbox" className="checkbox" />
                </div>
              </td>
              <td>#1831</td>
              <td>
                Customer Call Pipeline <br />
                <span className="badge badge-outline whitespace-nowrap text-xs">
                  Pipeline Id: #12
                </span>
              </td>
              <td>2023-06-25 10:45:30</td>
              <td>15 minutes</td>
              <td>gpt-4</td>
              <td>98%</td>
              <td>1.2%</td>
              <td>0%</td>
              <td>200ms</td>
              <td>
                <div style={{ minWidth: 300 }}>
                  <a
                    className="btn m-1 bg-slate-200"
                    href="#"
                    onClick={() => navigate('/result-details')}>
                    <HiDocumentReport /> Details
                  </a>
                  <a className="btn m-1 bg-slate-200" href="#" onClick={() => {}}>
                    <FaRocket /> Deploy
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
                Customer Call Pipeline
                <br />
                <span className="badge badge-outline whitespace-nowrap text-xs">
                  Pipeline Id: #12
                </span>
              </td>
              <td>2023-06-24 14:30:00</td>
              <td>8 minutes</td>
              <td>gpt-3.5</td>
              <td>95%</td>
              <td>2.4%</td>
              <td>2%</td>
              <td>500ms</td>
              <td>
                <div style={{ minWidth: 300 }}>
                  <a
                    className="btn m-1 bg-slate-200"
                    href="#"
                    onClick={() => navigate('/result-details')}>
                    <HiDocumentReport /> Details
                  </a>
                  <a className="btn m-1 bg-slate-200" href="#" onClick={() => {}}>
                    <FaRocket /> Deploy
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
                Supply Chain Optimization Pipeline <br />
                <span className="badge badge-outline whitespace-nowrap text-xs">
                  Pipeline Id: #3
                </span>
              </td>
              <td>2023-06-24 12:00:00</td>
              <td>30 minutes</td>
              <td>Falcon</td>
              <td>90%</td>
              <td>0.2%</td>
              <td>5%</td>
              <td>800ms</td>
              <td>
                <div style={{ minWidth: 300 }}>
                  <a
                    className="btn m-1 bg-slate-200"
                    href="#"
                    onClick={() => navigate('/result-details')}>
                    <HiDocumentReport /> Details
                  </a>
                  <a className="btn m-1 bg-slate-200" href="#" onClick={() => {}}>
                    <FaRocket /> Deploy
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
                Product Launch Process Pipeline
                <br />
                <span className="badge badge-outline whitespace-nowrap text-xs">
                  Pipeline Id: #5
                </span>
              </td>
              <td>2023-06-23 16:15:00</td>
              <td>45 minutes</td>
              <td>gpt-3.5</td>
              <td>93%</td>
              <td>0.2%</td>
              <td>1%</td>
              <td>550ms</td>
              <td>
                <div style={{ minWidth: 300 }}>
                  <a
                    className="btn m-1 bg-slate-200"
                    href="#"
                    onClick={() => navigate('/result-details')}>
                    <HiDocumentReport /> Details
                  </a>
                  <a className="btn m-1 bg-slate-200" href="#" onClick={() => {}}>
                    <FaRocket /> Deploy
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
                  Pipeline Id: #6
                </span>
              </td>
              <td>2023-06-23 09:30:00</td>
              <td>20 minutes</td>
              <td>gpt-4</td>
              <td>97%</td>
              <td>0.2%</td>
              <td>0%</td>
              <td>600ms</td>
              <td>
                <div style={{ minWidth: 300 }}>
                  <a
                    className="btn m-1 bg-slate-200"
                    href="#"
                    onClick={() => navigate('/result-details')}>
                    <HiDocumentReport /> Details
                  </a>
                  <a className="btn m-1 bg-slate-200" href="#" onClick={() => {}}>
                    <FaRocket /> Deploy
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
