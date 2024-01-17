import React, { forwardRef } from 'react'
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
        <h3 className="mb-5 text-center text-lg font-bold">font-bold</h3>
        <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text">Frequency Settings</span>
          </label>
          <select className="select mb-3 w-full border-black">
            <option value={'one-time'}>Once</option>
            <option value={'1d'}>Daily</option>
            <option value={'7d'}>Weekly</option>
          </select>
          <label className="label">
            <span className="label-text">at</span>
          </label>
          <select className="select mb-3 w-full border-black">
            <option value={'now'}>Now</option>
            <option value={'12am'}>12:00 am</option>
            <option value={'1am'}>1:00 am</option>
            <option value={'2am'}>2:00 am</option>
            <option value={'3am'}>3:00 am</option>
            <option value={'4am'}>4:00 am</option>
            <option value={'5am'}>5:00 am</option>
            <option value={'6am'}>6:00 am</option>
            <option value={'7am'}>7:00 am</option>
            <option value={'8am'}>8:00 am</option>
            <option value={'9am'}>9:00 am</option>
          </select>
          <button
            className="btn btn-primary mx-auto block w-36"
            onClick={async event => {
              event.preventDefault()
              await executeFlow()
              ref?.current?.close()
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
