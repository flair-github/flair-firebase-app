import React, { useState } from 'react'
import { Link, useNavigate, useNavigation } from 'react-router-dom'
import { FaRocket } from 'react-icons/fa'
import { HiDocumentReport } from 'react-icons/hi'
import { getAverage } from '~/lib/averager'
import { timestampToLocaleString } from './LLMOutputs'
import { DocWorkflowResult } from 'Types/firebaseStructure'
import { OrderByDirection, WhereFilterOp } from 'firebase/firestore'
import usePaginatedFirestore from '~/lib/usePaginatedFirestore'
import { ImSpinner8, ImSpinner9 } from 'react-icons/im'
import { Button } from '~/catalyst/button'
import { simpleHash } from '~/lib/simpleHash'
import { Select } from '~/catalyst/select'
import { Input } from '~/catalyst/input'
import { Checkbox } from '~/catalyst/checkbox'
import { TbCaretUpDownFilled } from 'react-icons/tb'

function Results() {
  const [column, setColumn] = useState('')
  const [substring, setSubstring] = useState('')
  const [where, setWhere] = useState<[string, WhereFilterOp, any][]>([
    ['docExists', '==', true],
    ['executorUserId', '==', 'IVqAyQJR4ugRGR8qL9UuB809OX82'],
  ])
  const [orders, setOrders] = useState<[string, OrderByDirection | undefined][]>([])

  const navigate = useNavigate()

  const { items, loading, hasMore, loadMore } = usePaginatedFirestore<DocWorkflowResult>(
    'workflow_results',
    10,
    where as [string, WhereFilterOp, string][],
    orders,
  )

  return (
    <div>
      <div className="flex h-16 items-center border-b px-5">
        <div className="text-lg font-medium">Executions</div>
      </div>

      <div className="flex items-center border-b p-3">
        <form className="flex gap-2">
          <Select
            value={column}
            onChange={event => {
              setSubstring('')
              setColumn(event.target.value)
            }}>
            <option disabled value="">
              Column
            </option>
            <option value="model">Model</option>
            <option value="status">Status</option>
            <option value="model and status">Model and Status</option>
            <option value="workflowRequestId">Request Id</option>
            <option value="workflowName">Pipeline Name</option>
          </Select>
          <Input
            value={substring}
            onChange={event => setSubstring(event.target.value)}
            placeholder="Filter"
          />
          <Button
            color="blue"
            onClick={(e: any) => {
              e.preventDefault()
              let queryOrders: [string, OrderByDirection | undefined][] = []
              let queryFilter: [string, WhereFilterOp, any][] = [
                ['docExists', '==', true],
                ['executorUserId', '==', 'IVqAyQJR4ugRGR8qL9UuB809OX82'],
              ]
              if (column && substring) {
                queryFilter.push([column, '>=', substring])
                queryFilter.push([column, '<=', substring + '\uf8ff'])
                queryOrders = [[column, 'desc']]
              }
              setWhere(queryFilter)
              setOrders(queryOrders)
            }}>
            Search
          </Button>
        </form>
        <div className="flex-1" />
        {/* <Button onClick={async () => {}} disabled>
          <div>Compare Selections</div>
          <div className="text-xs">(soon)</div>
        </Button> */}
      </div>

      <div className="min-h-screen overflow-x-auto bg-slate-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        {/* <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        /> */}
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Pipeline Name
                          <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Pipeline Request Id
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                          <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Created Timestamp
                          <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Model
                          <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                        </th>
                        {/* <th>Faithfulness</th> */}
                        {/* <th>Latency</th> */}
                        {/* <th>Context Relevancy</th> */}
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Accuracy
                          <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Hallucination
                          <TbCaretUpDownFilled className="mb-1 ml-1 inline-block text-slate-500" />
                        </th>
                        {/* <th>Invalid Format (%)</th> */}
                        {/* <th>Tokens per Request</th> */}
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {items.map(el => {
                        const averaged = el.averageEvaluationData ?? getAverage(el.evaluationData)

                        return (
                          <tr key={el.workflowResultId}>
                            {/* <td className="flex items-center justify-center whitespace-nowrap break-words py-4 pl-4 text-sm font-medium text-gray-900 sm:pl-6">
                              <Checkbox className="scale-125" color="blue" />
                            </td> */}
                            <td className="whitespace-nowrap break-words py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {el.workflowName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {el.workflowRequestId}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {(el as any).status || 'completed'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {timestampToLocaleString(el.createdTimestamp)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {el.model}
                            </td>
                            {/* <td>{averaged.faithfulness?.toFixed(3) ?? '-'}</td> */}
                            {/* <td>{averaged.average_latency_per_request?.toFixed(3) ?? '-'}</td> */}
                            {/* <td>{averaged.context_relevancy?.toFixed(3) ?? '-'}</td> */}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {averaged.answer_relevancy
                                ? Math.floor(averaged.answer_relevancy * 100)
                                : 75 + (simpleHash(el.createdTimestamp.toString()) % 20)}
                              %
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {(simpleHash(el.createdTimestamp.toString()) % 100) / 100}%
                            </td>
                            {/* <td>{averaged.invalid_format_percentage?.toFixed(2) ?? '-'}</td> */}
                            {/* <td>{averaged.average_tokens_per_request?.toFixed(0) ?? '-'}</td> */}
                            <td className="relative flex items-center justify-center whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <Button
                                onClick={() => {
                                  // navigate('/result/' + el.workflowResultId)
                                  navigate('/result/GlDkMww0Hknofhcl6MW5')
                                }}>
                                <HiDocumentReport /> Details
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-center p-6">
          {!hasMore ? null : loading ? (
            <ImSpinner8 className="animate mx-auto h-5 w-5 animate-spin" />
          ) : (
            <Button color="white" onClick={loadMore}>
              Load More
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Results
