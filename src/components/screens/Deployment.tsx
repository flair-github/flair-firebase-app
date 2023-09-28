import React from 'react'
import { Link } from 'react-router-dom'
import { HiDocumentReport } from 'react-icons/hi'
import { ImSpinner9 } from 'react-icons/im'
import { RiFlowChart } from 'react-icons/ri'
import { BiLogoAws, BiLogoGoogle, BiLogoMicrosoft } from 'react-icons/bi'
import { TbCircleDotFilled } from 'react-icons/tb'

const dummyItems = [
  {
    id: '15264519',
    interval: 'Weekly',
    last_run: 'Sept 2 2023',
    next_run: 'Sept 9 2023',
    source: 'AWS S3',
    export: 'AWS S3',
    status: 'Running',
  },
  {
    id: '98765432',
    interval: 'Daily',
    last_run: 'Sept 3 2023',
    next_run: 'Sept 4 2023',
    source: 'Google Cloud Storage',
    export: 'Google Cloud Storage',
    status: 'Completed',
  },
  {
    id: '54321678',
    interval: 'Monthly',
    last_run: 'Sept 1 2023',
    next_run: 'Oct 1 2023',
    source: 'Azure Blob Storage',
    export: 'Azure Blob Storage',
    status: 'Pending',
  },
  {
    id: '12345678',
    interval: 'Weekly',
    last_run: 'Sept 2 2023',
    next_run: 'Sept 9 2023',
    source: 'AWS S3',
    export: 'AWS S3',
    status: 'Running',
  },
  {
    id: '87654321',
    interval: 'Daily',
    last_run: 'Sept 3 2023',
    next_run: 'Sept 4 2023',
    source: 'Google Cloud Storage',
    export: 'Google Cloud Storage',
    status: 'Completed',
  },
  {
    id: '98765432',
    interval: 'Monthly',
    last_run: 'Sept 1 2023',
    next_run: 'Oct 1 2023',
    source: 'Azure Blob Storage',
    export: 'Azure Blob Storage',
    status: 'Pending',
  },
  {
    id: '56789012',
    interval: 'Weekly',
    last_run: 'Sept 2 2023',
    next_run: 'Sept 9 2023',
    source: 'AWS S3',
    export: 'AWS S3',
    status: 'Running',
  },
  {
    id: '34567890',
    interval: 'Daily',
    last_run: 'Sept 3 2023',
    next_run: 'Sept 4 2023',
    source: 'Google Cloud Storage',
    export: 'Google Cloud Storage',
    status: 'Completed',
  },
  {
    id: '23456789',
    interval: 'Monthly',
    last_run: 'Sept 1 2023',
    next_run: 'Oct 1 2023',
    source: 'Azure Blob Storage',
    export: 'Azure Blob Storage',
    status: 'Pending',
  },
  {
    id: '56789012',
    interval: 'Weekly',
    last_run: 'Sept 2 2023',
    next_run: 'Sept 9 2023',
    source: 'AWS S3',
    export: 'AWS S3',
    status: 'Running',
  },
  {
    id: '34567890',
    interval: 'Daily',
    last_run: 'Sept 3 2023',
    next_run: 'Sept 4 2023',
    source: 'Google Cloud Storage',
    export: 'Google Cloud Storage',
    status: 'Completed',
  },
  {
    id: '23456789',
    interval: 'Monthly',
    last_run: 'Sept 1 2023',
    next_run: 'Oct 1 2023',
    source: 'Azure Blob Storage',
    export: 'Azure Blob Storage',
    status: 'Pending',
  },
  {
    id: '56789012',
    interval: 'Weekly',
    last_run: 'Sept 2 2023',
    next_run: 'Sept 9 2023',
    source: 'AWS S3',
    export: 'AWS S3',
    status: 'Running',
  },
  {
    id: '34567890',
    interval: 'Daily',
    last_run: 'Sept 3 2023',
    next_run: 'Sept 4 2023',
    source: 'Google Cloud Storage',
    export: 'Google Cloud Storage',
    status: 'Completed',
  },
  {
    id: '23456789',
    interval: 'Monthly',
    last_run: 'Sept 1 2023',
    next_run: 'Oct 1 2023',
    source: 'Azure Blob Storage',
    export: 'Azure Blob Storage',
    status: 'Pending',
  },
  {
    id: '56789012',
    interval: 'Weekly',
    last_run: 'Sept 2 2023',
    next_run: 'Sept 9 2023',
    source: 'AWS S3',
    export: 'AWS S3',
    status: 'Running',
  },
  {
    id: '34567890',
    interval: 'Daily',
    last_run: 'Sept 3 2023',
    next_run: 'Sept 4 2023',
    source: 'Google Cloud Storage',
    export: 'Google Cloud Storage',
    status: 'Completed',
  },
  {
    id: '23456789',
    interval: 'Monthly',
    last_run: 'Sept 1 2023',
    next_run: 'Oct 1 2023',
    source: 'Azure Blob Storage',
    export: 'Azure Blob Storage',
    status: 'Pending',
  },
]

function getRandomBooleanArray(length: number): boolean[] {
  const booleanArray: boolean[] = []
  for (let i = 0; i < length; i++) {
    const randomBoolean = Math.random() < 0.5 // Generates true or false with 50% probability
    booleanArray.push(randomBoolean)
  }
  return booleanArray
}

const name2Icon = (name: string) => {
  const loweredName = name.toLowerCase()
  if (loweredName.includes('aws')) {
    return <BiLogoAws className="mx-auto h-6 w-6" />
  } else if (loweredName.includes('google')) {
    return <BiLogoGoogle className="mx-auto h-6 w-6" />
  } else {
    return <BiLogoMicrosoft className="mx-auto h-6 w-6" />
  }
}

function Deployment() {
  return (
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
            <option value="model">Deployment ID</option>
            <option value="status">Workflow Name</option>
            <option value="status">Interval</option>
            {/* <option value="model and status">Model and Status</option> */}
            <option value="workflowRequestId">Source</option>
            <option value="workflowName">Export</option>
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
        <button className="btn btn-disabled gap-1" onClick={async () => {}}>
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
              <th>Deployment ID</th>
              <th>Workflow Name</th>
              <th>Interval</th>
              <th>Last Run Status</th>
              <th>Next Run At</th>
              <th>Data Source</th>
              <th>Data Export</th>
              {/* <th>Status</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyItems.map(el => {
              return (
                <tr key={el.id}>
                  <td>
                    <div className="flex h-full w-full items-center justify-center">
                      <input type="checkbox" className="checkbox" />
                    </div>
                  </td>
                  <td>
                    <div className="w-24 break-words">{el.id}</div>
                  </td>
                  <td>
                    <div className="w-24 break-words">{'My Workflow Name'}</div>
                  </td>
                  <td>
                    <div className="w-24 break-words">{el.interval}</div>
                  </td>
                  <td>
                    <div className="flex w-24 flex-wrap break-words">
                      {getRandomBooleanArray(Math.random() * 6).map((bool, idx) => (
                        <TbCircleDotFilled
                          key={idx}
                          className={'h-4 w-4 ' + (bool ? 'text-green-400' : 'text-red-600')}
                        />
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="w-24 break-words">{el.next_run}</div>
                  </td>
                  <td>
                    <div className="w-24 break-words text-center">
                      {name2Icon(el.source)} {el.source}
                    </div>
                  </td>
                  <td>
                    <div className="w-24 break-words text-center">
                      {name2Icon(el.export)} {el.export}
                    </div>
                  </td>
                  {/* <td>
                    <div className="w-24 break-words">{el.status}</div>
                  </td> */}

                  <td>
                    <div style={{ minWidth: 250 }}>
                      <Link className="btn m-1 bg-slate-200" to={'/deployment/' + el.id}>
                        <HiDocumentReport /> Details
                      </Link>
                      <button className="btn m-1 bg-slate-200" onClick={() => {}}>
                        <RiFlowChart /> View Flow
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
            {false ? <ImSpinner9 className="animate mx-auto h-5 w-5 animate-spin" /> : 'Load More'}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default Deployment
