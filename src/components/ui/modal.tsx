import React from 'react'
React
import clsx from 'clsx'
import { FC } from 'react'

export const Modal: FC<{
  shown: boolean
  onClickBackdrop?: () => void
  children?: React.ReactNode
  size?: 'sm' | 'md'
}> = ({ shown, onClickBackdrop, children, size = 'sm' }) => {
  return (
    <div className={clsx(['modal', shown && 'modal-open'])}>
      <div className={clsx('modal-box', size === 'md' && 'w-[1024px] max-w-[100vw]')}>
        {onClickBackdrop && (
          <button
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
            onClick={onClickBackdrop}>
            ✕
          </button>
        )}
        {children}
      </div>
      <div className="modal-backdrop" onClick={onClickBackdrop} />
    </div>
  )
}
