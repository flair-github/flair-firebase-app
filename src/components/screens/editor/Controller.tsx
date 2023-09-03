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
    <div className="absolute right-3 top-3 z-10 flex flex-col items-end space-y-3">
      <div className="join w-fit bg-white shadow">
        {controls.map(({ title: controlTitle, Icon, handleOnClick }) => (
          <button key={controlTitle} className="btn btn-outline join-item" onClick={handleOnClick}>
            <Icon className="h-6 w-6" />
            {controlTitle}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Controller
