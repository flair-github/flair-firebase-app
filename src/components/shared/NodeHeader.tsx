import { useAtom } from 'jotai'
import React, { useMemo } from 'react'
import { IconType } from 'react-icons'
import { CgClose } from 'react-icons/cg'
import { nodesAtom } from '../screens/FlowEditor'

export interface INodeHeaderProps {
  color: string
  Icon?: IconType
  title: string
  withFlair?: boolean
  nodeId?: string
}

export function NodeHeader({ color, Icon, title, withFlair, nodeId }: INodeHeaderProps) {
  const [_, setNodes] = useAtom(nodesAtom)

  // Don't remove below switch operation, it's necessary for tailwind to know needed classes
  const cssColor = useMemo(() => {
    switch (color) {
      case 'rose':
        return 'bg-rose-200'
      case 'teal':
        return 'bg-teal-200'
      case 'blue':
        return 'bg-blue-200'
      case 'green':
        return 'bg-green-200'
      case 'orange':
        return 'bg-orange-200'
      case 'purple':
        return 'bg-purple-200'
      case 'pink':
        return 'bg-pink-200'
      default:
        return 'bg-teal-200'
    }
  }, [color])
  return (
    <header className={'mb-3 flex items-center rounded-t-md px-5 py-5 ' + cssColor}>
      {Icon && <Icon className="mr-3 h-7 w-7" />}
      <h4 className="grow text-2xl font-bold">{title}</h4>
      {withFlair && <img src="/images/powered-by-flair.png" width={135} height={28} />}
      {nodeId && (
        <button
          className="ml-3 scale-90 opacity-75 hover:scale-100 hover:opacity-100"
          onClick={event => {
            event.stopPropagation()
            setNodes(prev => {
              return [...prev.filter(node => node.id !== nodeId)]
            })
          }}>
          <CgClose className="h-7 w-7" />
        </button>
      )}
    </header>
  )
}
