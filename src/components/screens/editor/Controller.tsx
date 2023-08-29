import React from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { LuSave } from 'react-icons/lu'

function Controller({
  controls,
  title,
  setTitle,
  saveTitle,
}: {
  controls: {
    title: string
    Icon: any
    handleOnClick: React.MouseEventHandler<HTMLButtonElement>
  }[]
  title: string
  setTitle: (title: string) => void
  saveTitle: () => void
}) {
  return (
    <div className="absolute right-3 top-3 z-10 flex flex-col items-end space-y-3">
      <div className="join bg-white shadow">
        <input
          className="input join-item input-bordered"
          placeholder="Workflow name"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
        <div className="tooltip tooltip-info tooltip-left" data-tip={'Save'}>
          <button
            className="btn btn-outline join-item"
            onClick={() => {
              saveTitle()
            }}>
            <LuSave className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="join join-vertical w-fit bg-white shadow">
        {controls.map(({ title: controlTitle, Icon, handleOnClick }) => (
          <div
            key={controlTitle}
            className="tooltip tooltip-info tooltip-left"
            data-tip={controlTitle}>
            <button className="btn btn-outline join-item" onClick={handleOnClick}>
              <Icon className="h-6 w-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Controller
