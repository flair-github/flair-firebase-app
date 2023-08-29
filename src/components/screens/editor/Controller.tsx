import React from 'react'

function Controller({
  controls,
}: {
  controls: {
    title: string
    Icon: any
    handleOnClick: React.MouseEventHandler<HTMLButtonElement>
  }[]
}) {
  return (
    <div className="join join-vertical absolute right-3 top-3 z-10 bg-white shadow">
      {controls.map(({ title, Icon, handleOnClick }) => (
        <div key={title} className="tooltip tooltip-info tooltip-left" data-tip={title}>
          <button className="btn btn-outline join-item" onClick={handleOnClick}>
            <Icon className="h-6 w-6" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Controller
