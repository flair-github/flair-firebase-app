import * as React from 'react'
import { RiFlowChart } from 'react-icons/ri'
import { useParams } from 'react-router-dom'
import { BarChart } from './deployment/BarChart'
import Results from './Results'
import { PieChart } from './deployment/PieChart'
import { GiCheckMark, GiChecklist, GiSandsOfTime } from 'react-icons/gi'

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

      <Results />
    </>
  )
}

export default DeploymentDetails
