import clsx from 'clsx'
import React, { useState } from 'react'
import { IconType } from 'react-icons'

const classificationColor2colorClasses = (classificationColor: string): string[] => {
  let colorClasses
  switch (classificationColor) {
    case 'purple':
      colorClasses = [
        ' bg-purple-200 hover:bg-purple-300 ',
        ' bg-purple-100 group-hover:bg-purple-200 ',
      ]
      break
    case 'green':
      colorClasses = [
        ' bg-green-200 hover:bg-green-300 ',
        ' bg-green-100 group-hover:bg-green-200 ',
      ]
      break
    case 'orange':
      colorClasses = [
        ' bg-orange-200 hover:bg-orange-300 ',
        ' bg-orange-100 group-hover:bg-orange-200 ',
      ]
      break
    case 'blue':
      colorClasses = [' bg-blue-200 hover:bg-blue-300 ', ' bg-blue-100 group-hover:bg-blue-200 ']
      break
    case 'teal':
      colorClasses = [' bg-teal-200 hover:bg-teal-300 ', ' bg-teal-100 group-hover:bg-teal-200 ']
      break
    case 'rose':
      colorClasses = [' bg-rose-200 hover:bg-rose-300 ', ' bg-rose-100 group-hover:bg-rose-200 ']
      break
    case 'pink':
      colorClasses = [' bg-pink-200 hover:bg-pink-300 ', ' bg-pink-100 group-hover:bg-pink-200 ']
      break
    default:
      colorClasses = [' bg-gray-200 hover:bg-gray-300 ', ' bg-gray-100 group-hover:bg-gray-200 ']
      break
  }
  return colorClasses
}

export interface IAsideProps {
  nodeClassifications: {
    title: string
    subtitle: string
    color: string
    members: {
      title: string
      handleOnClick: () => void
      disabled?: boolean
      icon: IconType | string
    }[]
  }[]
}

export default function Menu({ nodeClassifications }: IAsideProps) {
  const [set, setSet] = useState(new Set())

  return (
    <menu className="grow overflow-y-scroll rounded-lg bg-white shadow outline outline-1">
      {/* Data Connectors */}
      <div className="join join-vertical w-full">
        {nodeClassifications.map((classification, i) => {
          const colorClasses = classificationColor2colorClasses(classification.color)
          return (
            <div
              key={classification.title}
              className={clsx(
                set.has(i) && 'collapse-open',
                'collapse join-item collapse-arrow border border-base-300',
              )}>
              <div
                className="collapse-title text-xl font-medium"
                onClick={() => {
                  setSet(x => {
                    const setAfter = new Set([...x])
                    setAfter.has(i) ? setAfter.delete(i) : setAfter.add(i)
                    return setAfter
                  })
                }}>
                {classification.title} <br />
                <div className="mt-1 text-sm font-normal text-gray-500">
                  {classification.subtitle}
                </div>
              </div>
              <div className="collapse-content rounded-none border-t bg-gray-50 shadow-inner">
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {classification.members.map(member => {
                    return (
                      <button
                        key={member.title}
                        disabled={member.disabled}
                        className={
                          'btn flex-col gap-0 h-28 p-0 shadow hover:shadow-md group transition-colors ' +
                          (member.disabled ? ' btn-disabled ' : colorClasses[0])
                        }
                        onClick={member.handleOnClick}>
                        <div
                          className={
                            'flex h-16 w-full items-center justify-center rounded-none transition-colors ' +
                            colorClasses[1]
                          }>
                          {typeof member.icon === 'string' ? (
                            <img
                              src={member.icon}
                              width={75}
                              height={75}
                              className="h-12 w-12"
                              // style={{ filter: 'grayscale(100%)' }}
                            />
                          ) : (
                            <member.icon className="h-12 w-12" />
                          )}
                        </div>
                        <div className="line-clamp-2 flex grow items-center justify-center">
                          <p> {member.title + (member.disabled ? ' (soon)' : '')}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </menu>
  )
}
