import React, { ForwardedRef, MutableRefObject, Ref, RefObject, forwardRef, useState } from 'react'
import { ImSpinner9 } from 'react-icons/im'

function ExecuteModal(
  {
    title,
    saveTitle,
    isDeploying,
  }: { title: string; saveTitle: (newTitle: string) => Promise<void>; isDeploying: boolean },
  ref: any,
) {
  const [newTitle, setNewTitle] = useState(title)
  return (
    <dialog ref={ref} className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="mb-5 text-center text-lg font-bold">Edit Form</h3>
        <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Workflow Name</span>
          </label>
          <input
            className="max-w-xs input mb-3 w-full border-black"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
          />
          <button
            className="btn btn-primary mx-auto block w-36"
            onClick={async event => {
              event.preventDefault()
              await saveTitle(newTitle)
              ref?.current?.close()
            }}>
            {isDeploying ? <ImSpinner9 className="animate mx-auto h-5 w-5 animate-spin" /> : 'Save'}
          </button>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default forwardRef(ExecuteModal)
