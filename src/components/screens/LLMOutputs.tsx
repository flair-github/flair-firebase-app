import { DocLLMOutput } from 'Types/firebaseStructure'
import usePaginatedFirestore from '~/lib/usePaginatedFirestore'
import { Timestamp } from 'firebase/firestore'
import { ImSpinner9 } from 'react-icons/im'
import { AiOutlineExpand, AiOutlineDownload } from 'react-icons/ai'
import { useState } from 'react'
import DetailModal from '../shared/DetailModal'

export function timestampToLocaleString(
  ts: Timestamp,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = ts.toDate() // Convert Firestore Timestamp to JavaScript Date
  return date.toLocaleString(locale, {
    weekday: 'long', // e.g., "Sunday"
    year: 'numeric', // e.g., "2023"
    month: 'long', // e.g., "August"
    day: 'numeric', // e.g., "1"
    hour: '2-digit', // e.g., "02"
    minute: '2-digit', // e.g., "15"
    ...options, // Allow custom options
  })
}

function downloadObjectAsJson(exportObj: any, fileName: string): void {
  const dataStr =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj, null, 2))
  const downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', fileName + '.json')
  document.body.appendChild(downloadAnchorNode) // Required for Firefox
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}

function LLMOutputs() {
  const { items, loading, hasMore, loadMore } = usePaginatedFirestore<DocLLMOutput>(
    'llm_outputs',
    10,
    [['workflowResultId', '==', 'XwRC2hEAUET4Em2GdCLz']],
  )
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<DocLLMOutput>()

  return (
    <div className="container mx-auto mt-6 border rounded-md mb-9">
      <div className="border-grayscaleDivider flex h-[3rem] border-b">
        <div className="flex-1" />
        <button
          className="btn-disabled btn m-1 h-[2.5rem] min-h-[2.5rem] gap-1"
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
              <th>Workflow</th>
              <th>Column Name</th>
              <th>Prompt</th>
              <th>Instruction</th>
              <th>Context</th>
              <th>Input</th>
              <th>Output</th>
              <th>Answer</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>
                <p className="text-left">Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {items?.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="flex items-center justify-center w-full h-full">
                    <input type="checkbox" className="checkbox" />
                  </div>
                </td>
                <td>
                  <p className="mb-1 line-clamp-2">{item.workflowId}</p>
                  <span className="text-xs badge badge-outline whitespace-nowrap">
                    Request: {item.workflowRequestId}
                  </span>
                </td>
                <td>
                  <p className="mb-1 line-clamp-2">{item.columnName}</p>
                </td>
                <td>
                  <p className="mb-1 line-clamp-2">{item.columnPrompt}</p>
                </td>
                <td>
                  <div className="line-clamp-3 h-14 w-36">{item.instruction}</div>
                </td>
                <td>
                  <div className="line-clamp-3 h-14 w-36">{item.context}</div>
                </td>
                <td>
                  <div className="line-clamp-3 h-14 w-36">{item.input}</div>
                </td>
                <td>
                  <div className="line-clamp-3 h-14 w-36">{item.output}</div>
                </td>
                <td>
                  <div className="line-clamp-3 h-14 w-36">
                    {Array.isArray(item.answer)
                      ? item.answer.join(', ')
                      : typeof item.answer === 'number'
                      ? item.answer.toString()
                      : item.answer}
                  </div>
                </td>
                <td>
                  <p className="line-clamp-3 w-28">
                    {timestampToLocaleString(item.createdTimestamp)}
                  </p>
                </td>
                <td>
                  <p className="line-clamp-3 w-28">
                    {timestampToLocaleString(item.updatedTimestamp)}
                  </p>
                </td>
                <td>
                  <div className="flex min-w-[15rem] items-center justify-start space-x-3">
                    <button
                      className="btn bg-slate-200"
                      onClick={() => {
                        setSelectedRow(item)
                        setIsOpen(true)
                      }}>
                      <AiOutlineExpand /> Details
                    </button>
                    <button
                      className="btn bg-slate-200"
                      onClick={() => {
                        downloadObjectAsJson(item, item.id)
                      }}>
                      <AiOutlineDownload /> Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore ? (
        <button className="block mx-auto my-3 btn w-36" onClick={loadMore}>
          {loading ? <ImSpinner9 className="w-5 h-5 mx-auto animate animate-spin" /> : 'Load More'}
        </button>
      ) : null}
      {selectedRow ? (
        <DetailModal key={selectedRow?.id} open={isOpen} setOpen={setIsOpen} item={selectedRow} />
      ) : null}
    </div>
  )
}

export default LLMOutputs
