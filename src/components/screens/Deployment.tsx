import React, { RefObject, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiDocumentReport } from 'react-icons/hi'
import { ImSpinner9 } from 'react-icons/im'
import { RiFlowChart } from 'react-icons/ri'
import {
  BiGitBranch,
  BiLogoAws,
  BiLogoGmail,
  BiLogoGoogle,
  BiLogoMicrosoft,
  BiLogoMongodb,
  BiLogoPostgresql,
  BiLogoSlack,
} from 'react-icons/bi'
import { FaCloudUploadAlt, FaSalesforce } from 'react-icons/fa'
import { SiPowerbi, SiZendesk, SiAirtable, SiGooglesheets, SiTwilio } from 'react-icons/si'
import { TbCircleDotFilled } from 'react-icons/tb'
import { GiChecklist, GiMoneyStack, GiSandsOfTime } from 'react-icons/gi'

const dummyItems = [
  {
    id: '15264519',
    name: 'Real Estate Lead Data',
    interval: '1d',
    last_run: 'Sept 2 2023',
    next_run: 'Jan 5 2024',
    source: 'AWS S3',
    export: 'Airtable',
    status: 'Running',
  },
  {
    id: '98765432',
    name: 'Customer Support Ticket Generation',
    interval: '1d',
    last_run: 'Sept 3 2023',
    next_run: 'Jan 3 2024',
    source: 'AWS S3',
    export: 'SMS',
    status: 'Completed',
  },
  {
    id: '54321678',
    name: 'Customer Support Survey Results',
    interval: '2d',
    last_run: 'Sept 1 2023',
    next_run: 'Jan 2 2024',
    source: 'Azure Blob Storage',
    export: 'Airtable',
    status: 'Pending',
  },
  {
    id: '12345678',
    name: 'Email Invoice Processing',
    interval: '7d',
    last_run: 'Sept 2 2023',
    next_run: 'Jan 9 2023',
    source: 'Azure Blob Storage',
    export: 'Salesforce',
    status: 'Running',
  },
  {
    id: '87654321',
    name: 'PDF document processing',
    interval: '1d',
    last_run: 'Sept 3 2023',
    next_run: 'Jan 4 2023',
    source: 'AWS S3',
    export: 'Google Sheets',
    status: 'Completed',
  },
  {
    id: '98765432',
    name: 'Voicemail Detection',
    interval: '1d',
    last_run: 'Sept 1 2023',
    next_run: 'Jan 8 2023',
    source: 'Gmail',
    export: 'Salesforce',
    status: 'Pending',
  },
  // {
  //   id: '56789012',
  //   interval: 'Weekly',
  //   last_run: 'Sept 2 2023',
  //   next_run: 'Sept 9 2023',
  //   source: 'AWS S3',
  //   export: 'AWS S3',
  //   status: 'Running',
  // },
  // {
  //   id: '34567890',
  //   interval: 'Daily',
  //   last_run: 'Sept 3 2023',
  //   next_run: 'Sept 4 2023',
  //   source: 'Google Cloud Storage',
  //   export: 'Google Cloud Storage',
  //   status: 'Completed',
  // },
  // {
  //   id: '23456789',
  //   interval: 'Monthly',
  //   last_run: 'Sept 1 2023',
  //   next_run: 'Oct 1 2023',
  //   source: 'Azure Blob Storage',
  //   export: 'Azure Blob Storage',
  //   status: 'Pending',
  // },
  // {
  //   id: '56789012',
  //   interval: 'Weekly',
  //   last_run: 'Sept 2 2023',
  //   next_run: 'Sept 9 2023',
  //   source: 'AWS S3',
  //   export: 'AWS S3',
  //   status: 'Running',
  // },
  // {
  //   id: '34567890',
  //   interval: 'Daily',
  //   last_run: 'Sept 3 2023',
  //   next_run: 'Sept 4 2023',
  //   source: 'Google Cloud Storage',
  //   export: 'Google Cloud Storage',
  //   status: 'Completed',
  // },
  // {
  //   id: '23456789',
  //   interval: 'Monthly',
  //   last_run: 'Sept 1 2023',
  //   next_run: 'Oct 1 2023',
  //   source: 'Azure Blob Storage',
  //   export: 'Azure Blob Storage',
  //   status: 'Pending',
  // },
  // {
  //   id: '56789012',
  //   interval: 'Weekly',
  //   last_run: 'Sept 2 2023',
  //   next_run: 'Sept 9 2023',
  //   source: 'AWS S3',
  //   export: 'AWS S3',
  //   status: 'Running',
  // },
  // {
  //   id: '34567890',
  //   interval: 'Daily',
  //   last_run: 'Sept 3 2023',
  //   next_run: 'Sept 4 2023',
  //   source: 'Google Cloud Storage',
  //   export: 'Google Cloud Storage',
  //   status: 'Completed',
  // },
  // {
  //   id: '23456789',
  //   interval: 'Monthly',
  //   last_run: 'Sept 1 2023',
  //   next_run: 'Oct 1 2023',
  //   source: 'Azure Blob Storage',
  //   export: 'Azure Blob Storage',
  //   status: 'Pending',
  // },
  // {
  //   id: '56789012',
  //   interval: 'Weekly',
  //   last_run: 'Sept 2 2023',
  //   next_run: 'Sept 9 2023',
  //   source: 'AWS S3',
  //   export: 'AWS S3',
  //   status: 'Running',
  // },
  // {
  //   id: '34567890',
  //   interval: 'Daily',
  //   last_run: 'Sept 3 2023',
  //   next_run: 'Sept 4 2023',
  //   source: 'Google Cloud Storage',
  //   export: 'Google Cloud Storage',
  //   status: 'Completed',
  // },
  // {
  //   id: '23456789',
  //   interval: 'Monthly',
  //   last_run: 'Sept 1 2023',
  //   next_run: 'Oct 1 2023',
  //   source: 'Azure Blob Storage',
  //   export: 'Azure Blob Storage',
  //   status: 'Pending',
  // },
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
  } else if (loweredName.includes('salesforce')) {
    return <FaSalesforce className="mx-auto h-6 w-6" />
  } else if (loweredName.includes('gmail')) {
    return <BiLogoGoogle className="mx-auto h-6 w-6" />
  } else if (loweredName.includes('airtable')) {
    return <SiAirtable className="mx-auto h-6 w-6" />
  } else if (loweredName.includes('sheets')) {
    return <SiGooglesheets className="mx-auto h-6 w-6" />
  } else if (loweredName.includes('sms')) {
    return <SiTwilio className="mx-auto h-6 w-6" />
  } else {
    return <BiLogoMicrosoft className="mx-auto h-6 w-6" />
  }
}

function Deployment() {
  return (
    <>
      {/* <div className="container mx-4 my-5 w-[calc(100%-2rem)] rounded-md">
        <div className="stats w-full rounded-md border">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <GiSandsOfTime className="h-10 w-10" />
            </div>
            <div className="stat-title">Time Saved</div>
            <div className="stat-value">98 hours</div>
            <div className="stat-desc">Compared to manual labor</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <GiMoneyStack className="h-10 w-10" />
            </div>
            <div className="stat-title">Money Saved</div>
            <div className="stat-value">1412 $</div>
            <div className="stat-desc">Compared to manual labor</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <GiChecklist className="h-10 w-10" />
            </div>
            <div className="stat-title">Data Processed</div>
            <div className="stat-value">1243 rows</div>
            <div className="stat-desc">8 GigaByte(s)</div>
          </div>
        </div>
      </div> */}

      <div className="flex h-16 items-center border-b px-5">
        <div className="text-lg font-medium">Deployment</div>
      </div>
      {/* <div className="container mx-4 mb-9 mt-0 w-[calc(100%-2rem)] rounded-md">
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
      </div> */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr className="text-sm">
              <th />
              <th>Deployment ID</th>
              <th>Workflow Name</th>
              <th>Frequency</th>
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
                    <div className="w-24 break-words">{el.name}</div>
                  </td>
                  <td>
                    <div className="w-24 break-words">{el.interval}</div>
                  </td>
                  <td>
                    <div className="flex w-24 flex-wrap break-words">
                      {getRandomBooleanArray(Math.random() * 6).map((bool, idx) => (
                        <TbCircleDotFilled
                          key={idx}
                          // className={'h-4 w-4 ' + (bool ? 'text-green-400' : 'text-red-600')}
                          className={'h-4 w-4 ' + 'text-green-400'}
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
                      <Link
                        className="btn m-1 bg-slate-200"
                        to={'/editor/' + 'nBA6Nlx1HetqYzixWKAw' + '/' + '008wYclghfxk1MC1Jbug'}>
                        <RiFlowChart /> View Flow
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
            {false ? <ImSpinner9 className="animate mx-auto h-5 w-5 animate-spin" /> : 'Load More'}
          </button>
        ) : null}
      </div>
    </>
  )
}

export default Deployment
