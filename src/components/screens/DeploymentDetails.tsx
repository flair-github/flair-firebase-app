import * as React from 'react'
import { RiFlowChart } from 'react-icons/ri'
import { useParams } from 'react-router-dom'
import { BarChart } from './deployment/BarChart'
import Results from './Results'
import { PieChart } from './deployment/PieChart'

interface DeploymentDetailsProps {}

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

        <div className="mb-8 mt-3 grid grid-cols-2 gap-3">
          <div className="">
            <h4 className="text-lg font-medium">Usage</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae voluptate fugiat
              laudantium, ea consequuntur tenetur quasi necessitatibus repellat sapiente officiis
            </p>
          </div>
          <div className="">
            <h4 className="text-lg font-medium">Usage This Month</h4>
            <article className="flex w-full justify-between">
              <p>700.000</p>
              <p>1.000.000</p>
            </article>
            <progress className="progress w-full" value="70" max="100" />
          </div>
        </div>

        <div className="stats w-full rounded-md border shadow-sm">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="stat-title">Usage this month</div>
            <div className="stat-value">31K</div>
            <div className="stat-desc">Jan 1st - Feb 1st</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <div className="stat-title">Usage Breakdown</div>
            <div className="stat-value">4,200</div>
            <div className="stat-desc">↗︎ 400 (22%)</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
            <div className="stat-title">Success Rate</div>
            <div className="stat-value">1,200</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-6">
          <BarChart />
          <PieChart />
        </div>
      </div>

      <Results />
    </>
  )
}

export default DeploymentDetails
