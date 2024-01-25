import React, { forwardRef, useState } from 'react'
import { db } from '~/lib/firebase'
import { ImSpinner8, ImSpinner9 } from 'react-icons/im'

export const DeployModal = ({
  deployFlow,
  isDeploying,
  dialogRef,
}: {
  deployFlow: () => Promise<void>
  isDeploying: boolean
  dialogRef: any
}) => {
  const [currentEvery, setCurrentEvery] = useState('1d')

  return (
    <dialog ref={dialogRef} className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="mb-5 text-center text-lg font-bold">Deployment Options</h3>
        <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
        <div className="mb-2 mt-1">
          <label className="label">
            <span className="label-text font-bold">Run Every</span>
          </label>
          <select
            className="select mb-3 w-full border-black"
            value={currentEvery}
            onChange={e => {
              setCurrentEvery(e.target.value)
            }}>
            <option value={'1h'}>1h</option>
            <option value={'2h'}>1d</option>
            <option value={'4h'}>1d</option>
            <option value={'8h'}>8h</option>
            <option value={'1d'}>1d</option>
            <option value={'2d'}>2d</option>
            <option value={'3d'}>3d</option>
            <option value={'7d'}>7d</option>
          </select>
          {(currentEvery === '1d' ||
            currentEvery === '2d' ||
            currentEvery === '3d' ||
            currentEvery === '7d') && (
            <>
              <label className="label">
                <span className="label-text font-bold">at</span>
              </label>
              <select className="select mb-3 w-full border-black">
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
                <option value={'10am'}>10:00 am</option>
                <option value={'11am'}>11:00 am</option>
                <option value={'12pm'}>12:00 pm</option>
                <option value={'1pm'}>1:00 pm</option>
                <option value={'2pm'}>2:00 pm</option>
                <option value={'3pm'}>3:00 pm</option>
                <option value={'4pm'}>4:00 pm</option>
                <option value={'5pm'}>5:00 pm</option>
                <option value={'6pm'}>6:00 pm</option>
                <option value={'7pm'}>7:00 pm</option>
                <option value={'8pm'}>8:00 pm</option>
                <option value={'9pm'}>9:00 pm</option>
                <option value={'10pm'}>10:00 pm</option>
                <option value={'11pm'}>11:00 pm</option>
              </select>
            </>
          )}
          <button
            className="btn btn-primary mx-auto block w-36"
            onClick={async event => {
              event.preventDefault()
              await deployFlow()
              dialogRef?.current?.close()
              // db.collection('workflow_results').add({
              //   docExists: true,
              //   averageEvaluationData: 0.86,
              //   workflowName: 'NPS Survey Tool',
              //   workflowRequestId: '91837235983',
              //   status: 'initiated',
              //   createdTimestamp: new Date(),
              //   model: 'gpt-4',
              //   executorUserId: 'IVqAyQJR4ugRGR8qL9UuB809OX82',
              // })
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

export const RunModal = ({ dialogRef }: { dialogRef: any }) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="mb-5 text-center text-lg font-bold">Running Pipeline</h3>
        {/* <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button> */}
        <div className="mb-2 mt-1">
          <div className="flex h-72 w-full items-center justify-center">
            <ImSpinner8 className="h-16 w-16 animate-spin text-slate-400" />
          </div>
          <div />
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
