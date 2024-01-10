import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRocket } from 'react-icons/fa'
import { HiDocumentReport } from 'react-icons/hi'
import { getAverage } from '~/lib/averager'
import { AverageEvaluationData, EvaluationData } from 'Types/firebaseStructure'
import { ImSpinner9 } from 'react-icons/im'
import usePaginatedSupabase from '~/lib/usePaginatedSupabase'
import { Tables } from '~/supabase'

const defaultWhere = [
  { column: 'docExists', operator: 'eq', value: true },
  { column: 'executorUserId', operator: 'eq', value: 'IVqAyQJR4ugRGR8qL9UuB809OX82' },
]
const defaultOrders = [{ column: 'createdTimestamp', direction: 'desc' }]

export function transformDateString(inputDate: string): string {
  try {
    // Split the input date string into parts
    const [datePart, timePart] = inputDate.split('T')
    const [year, month, day] = datePart.split('-')
    const [time, timeZone] = timePart.split('+')[0].split('.')
    const [hour, minute, second] = time.split(':')

    // Convert month from numeric to its full name
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const monthName = months[parseInt(month, 10) - 1]

    // Convert the 24-hour time to 12-hour format
    const ampm = parseInt(hour, 10) < 12 ? 'AM' : 'PM'
    const formattedHour = (parseInt(hour, 10) % 12).toString().padStart(2, '0')

    // Assemble the transformed date string
    const transformedDate = `${monthName} ${parseInt(
      day,
      10,
    )}, ${year} at ${formattedHour}:${minute} ${ampm}`

    return transformedDate
  } catch (error) {
    // Handle invalid date format or other errors
    console.error('Error transforming date:', error)
    return 'Invalid Date'
  }
}

const useSupabaseResults = (
  where: { column: string; operator: 'eq' | 'ilike' | 'gte' | 'lte'; value: any }[],
) => {
  const { items, loading, hasMore, loadMore } = usePaginatedSupabase<Tables<'workflow_results'>>(
    'workflow_results',
    10,
    where,
    defaultOrders as { column: string; direction: 'asc' | 'desc' }[],
  )

  return { items, hasMore, loadMore, loading }
}

function PageResults() {
  const [column, setColumn] = useState('')
  const [substring, setSubstring] = useState('')
  const [where, setWhere] = useState(defaultWhere)

  const { items, hasMore, loadMore, loading } = useSupabaseResults(
    where as { column: string; operator: 'eq' | 'ilike' | 'gte' | 'lte'; value: any }[],
  )

  return (
    <div className="container mx-auto mb-9 mt-6 rounded-md border">
      <div className="flex items-center border-b p-3">
        <form className="join">
          <select
            className={' join-item ' + 'select select-bordered '}
            value={column}
            onChange={event => setColumn(event.target.value)}>
            <option disabled value="">
              Column
            </option>
            <option value="model">Model</option>
            <option value="status">Status</option>
            {/* <option value="model and status">Model and Status</option> */}
            <option value="workflowRequestId">Request Id</option>
            <option value="workflowName">Workflow Name</option>
          </select>
          <input
            className="input join-item input-bordered"
            value={substring}
            onChange={event => setSubstring(event.target.value)}
            placeholder="Filter"
          />
          <button
            className="btn join-item"
            onClick={e => {
              e.preventDefault()
              const queryFilter = [...defaultWhere]
              if (column && substring) {
                queryFilter.push({
                  column: column,
                  operator: 'ilike',
                  value: '%' + substring + '%',
                })
              }
              setWhere(queryFilter)
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
              <th>Workflow Name</th>
              <th>Workflow Request Id</th>
              <th>Status</th>
              <th>Created</th>
              <th>Model</th>
              {/* <th>Faithfulness</th> */}
              <th>Latency</th>
              {/* <th>Context Relevancy</th> */}
              <th>Accuracy</th>
              <th>Invalid Format (%)</th>
              <th>Tokens per Request</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(el => {
              const averaged =
                (el.averageEvaluationData as AverageEvaluationData | null) ??
                getAverage(el.evaluationData as EvaluationData)

              return (
                <tr key={el.workflowResultId}>
                  <td>
                    <div className="flex h-full w-full items-center justify-center">
                      <input type="checkbox" className="checkbox" />
                    </div>
                  </td>
                  <td>
                    <div className="w-24 break-words">{el.workflowName}</div>
                  </td>
                  <td>
                    <div className="w-24 break-words">{el.workflowRequestId}</div>
                  </td>
                  <td>
                    <div className="w-24 break-words">{(el as any).status || 'completed'}</div>
                  </td>
                  <td>
                    <div className="w-36">
                      {el.createdTimestamp ? transformDateString(el.createdTimestamp) : '-'}
                    </div>
                  </td>
                  <td>
                    <div className="w-24">{el.model}</div>
                  </td>
                  {/* <td>{averaged.faithfulness?.toFixed(3) ?? '-'}</td> */}
                  <td>{averaged.average_latency_per_request?.toFixed(3) ?? '-'}</td>
                  {/* <td>{averaged.context_relevancy?.toFixed(3) ?? '-'}</td> */}
                  <td>{averaged.answer_relevancy?.toFixed(3) ?? '-'}</td>
                  <td>{averaged.invalid_format_percentage?.toFixed(2) ?? '-'}</td>
                  <td>{averaged.average_tokens_per_request?.toFixed(0) ?? '-'}</td>
                  <td>
                    <div style={{ minWidth: 250 }}>
                      <Link
                        className="btn m-1 bg-slate-200"
                        to={'/result-details/' + el.workflowResultId}>
                        <HiDocumentReport /> Details
                      </Link>
                      <a className="btn m-1 bg-slate-200" href="#" onClick={() => {}}>
                        <FaRocket /> Deploy
                      </a>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {hasMore ? (
          <button className="btn mx-auto my-3 block w-36" onClick={loadMore}>
            {loading ? (
              <ImSpinner9 className="animate mx-auto h-5 w-5 animate-spin" />
            ) : (
              'Load More'
            )}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default PageResults
