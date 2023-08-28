import React, { LegacyRef, forwardRef, useRef } from 'react'
import { ImSpinner9 } from 'react-icons/im'

function ExecuteModal(
  {
    executeFlow,
    isDeploying,
  }: {
    executeFlow: () => Promise<void>
    isDeploying: boolean
  },
  ref: any,
) {
  return (
    <dialog ref={ref} className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="mb-5 text-center text-lg font-bold">Deployment Options</h3>
        <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Frequency</span>
          </label>
          <select className="max-w-xs select mb-3 w-full border-black">
            <option value={'one-time'}>One time</option>
            <option value={'1d'}>1d</option>
            <option value={'7d'}>7d</option>
            <option value={'30d'}>30d</option>
          </select>
          <button
            className="btn btn-primary mx-auto block w-36"
            onClick={async event => {
              event.preventDefault()
              await executeFlow()
              executeModalRef.current?.close()
            }}>
            {isDeploying ? (
              <ImSpinner9 className="animate mx-auto h-5 w-5 animate-spin" />
            ) : (
              'Deploy'
            )}
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
