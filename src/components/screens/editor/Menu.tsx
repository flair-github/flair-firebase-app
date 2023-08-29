import React from 'react'

const classificationColor2colorClasses = (classificationColor: string): string => {
  let colorClasses = ''
  switch (classificationColor) {
    case 'purple':
      colorClasses = ' bg-purple-200 hover:bg-purple-300 '
      break
    case 'green':
      colorClasses = ' bg-green-200 hover:bg-green-300 '
      break
    case 'orange':
      colorClasses = ' bg-orange-200 hover:bg-orange-300 '
      break
    case 'blue':
      colorClasses = ' bg-blue-200 hover:bg-blue-300 '
      break
    case 'teal':
      colorClasses = ' bg-teal-200 hover:bg-teal-300 '
      break
    case 'rose':
      colorClasses = ' bg-rose-200 hover:bg-rose-300 '
      break
    case 'pink':
      colorClasses = ' bg-pink-200 hover:bg-pink-300 '
      break
    default:
      colorClasses = ' bg-green-200 hover:bg-green-300 '
      break
  }
  return colorClasses
}

export interface IAsideProps {
  nodeClassifications: {
    title: string
    subtitle: string
    color: string
    members: (
      | {
          title: string
          handleOnClick: () => void
          disabled?: undefined
        }
      | {
          title: string
          handleOnClick: () => void
          disabled: boolean
        }
    )[]
  }[]
}

export default function Menu({ nodeClassifications }: IAsideProps) {
  return (
    <menu className="grow overflow-y-scroll rounded-lg bg-white shadow outline outline-1">
      {/* Data Connectors */}
      <div className="join join-vertical w-full">
        {nodeClassifications.map(classification => {
          const colorClasses = classificationColor2colorClasses(classification.color)
          return (
            <div
              key={classification.title}
              className={'collapse-arrow collapse' + ' join-item border border-base-300'}>
              <input type="checkbox" name="my-accordion-4" />
              <div className="collapse-title text-xl font-medium">
                {classification.title} <br />
                <div className="mt-1 text-sm font-normal text-gray-500">
                  {classification.subtitle}
                </div>
              </div>
              <div className="collapse-content rounded-none border-t bg-gray-50 shadow-inner">
                <div className="mt-4">
                  {classification.members.map(member => {
                    return (
                      <button
                        key={member.title}
                        disabled={member.disabled}
                        className={
                          'btn m-2' + (member.disabled ? ' gap-1 btn-disabled ' : colorClasses)
                        }
                        onClick={member.handleOnClick}>
                        <p>{member.title}</p>
                        {member.disabled && <div className="text-xs">(soon)</div>}
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
