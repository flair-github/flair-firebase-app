import React, { Suspense, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { RiFlowChart, RiLogoutCircleLine } from 'react-icons/ri'
import { AiOutlineDeploymentUnit, AiOutlineSetting, AiTwotoneExperiment } from 'react-icons/ai'
import { CgTranscript } from 'react-icons/cg'
import { VscDebugLineByLine } from 'react-icons/vsc'
import { HiOutlineRocketLaunch } from 'react-icons/hi2'
import { FiChevronRight } from 'react-icons/fi'
import { useAtomValue } from 'jotai'
import { atomUserData } from '~/jotai/jotai'
import { useAuth } from '~/lib/firebase'
import { ImSpinner8, ImSpinner9 } from 'react-icons/im'
import { IconType } from 'react-icons'
import clsx from 'clsx'
import { FaKey } from 'react-icons/fa6'
import { PiKeyDuotone } from 'react-icons/pi'

const navigation: {
  name: string
  href: string
  icon: IconType
  children?: { name: string; href: string }[]
}[] = [
  { name: 'Pipelines', href: '/', icon: RiFlowChart },
  // { name: 'Deployment', href: '/deployment', icon: HiOutlineRocketLaunch },
  { name: 'Executions', href: '/result', icon: AiTwotoneExperiment },
  { name: 'Credentials', href: '/credentials', icon: PiKeyDuotone },
  // {
  //   name: 'Debug',
  //   icon: VscDebugLineByLine,
  //   children: [
  //     { name: 'LLM Output', href: '/llm-outputs' },
  //     { name: 'User Config', href: '/user-config' },
  //   ],
  // },
  // { name: 'Settings', href: '/settings', icon: AiOutlineSetting },
]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const isActive = (currentPath: string, pathId: string) => {
  if (pathId === '/') {
    return currentPath.includes('editor') || currentPath === '/'
  } else {
    return currentPath.includes(pathId)
  }
}

export default function Sidenav() {
  const location = useLocation()
  const navigate = useNavigate()
  const userData = useAtomValue(atomUserData)
  const [isHover, setIsHover] = useState(false)
  const auth = useAuth()
  const handleSignOut = () => {
    auth.signOut()
  }

  const isMini = location.pathname.split('/')[1] === 'editor'

  return (
    <div className="flex h-screen min-h-screen w-full">
      <div
        className={clsx(
          isMini ? 'w-[72px]' : 'w-[16rem]',
          'flex shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white px-6',
        )}>
        <div
          className="mb-2 flex h-16 shrink-0 cursor-pointer items-center"
          onClick={() => {
            navigate('/')
          }}>
          {isMini ? (
            <img className="h-10 w-auto" src="/images/f-logo.svg" alt="Flair Logo" />
          ) : (
            <img className="h-8 w-auto" src="/images/flair-logo.svg" alt="Flair Logo" />
          )}
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map(item => (
                  <li key={item.name}>
                    {!item.children ? (
                      <Link
                        to={item.href}
                        className={classNames(
                          isActive(location.pathname, item.href)
                            ? 'bg-gray-100'
                            : 'hover:bg-gray-100',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700',
                        )}>
                        <item.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                        {!isMini && item.name}
                      </Link>
                    ) : (
                      <Disclosure as="div">
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              className={classNames(
                                isActive(location.pathname, item.href)
                                  ? 'bg-gray-100'
                                  : 'hover:bg-gray-100',
                                'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700',
                              )}>
                              <item.icon
                                className="h-6 w-6 shrink-0 text-gray-400"
                                aria-hidden="true"
                              />
                              {item.name}
                              <FiChevronRight
                                className={classNames(
                                  open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                                  'ml-auto h-5 w-5 shrink-0',
                                )}
                                aria-hidden="true"
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel as="ul" className="mt-1 px-2">
                              {item.children?.map(subItem => (
                                <li key={subItem.name}>
                                  {/* 44px */}
                                  <Disclosure.Button
                                    as={Link}
                                    to={subItem.href}
                                    className={classNames(
                                      isActive(location.pathname, subItem.href)
                                        ? 'bg-gray-100'
                                        : 'hover:bg-gray-100',
                                      'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700',
                                    )}>
                                    {subItem.name}
                                  </Disclosure.Button>
                                </li>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )}
                  </li>
                ))}
              </ul>
            </li>

            <li className="-mx-6 mt-auto">
              <div
                className="flex cursor-pointer items-center gap-x-4 px-5 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={handleSignOut}>
                {isHover ? (
                  <RiLogoutCircleLine className="h-8 w-8" />
                ) : (
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src={userData?.userPhotoUrl}
                    alt="user image"
                  />
                )}
                {!isMini && <span>{isHover ? 'Logout' : userData?.userName || 'Flair User'}</span>}
              </div>
            </li>
          </ul>
        </nav>
      </div>

      <Suspense
        fallback={
          <main className="flex grow items-center justify-center overflow-hidden">
            <ImSpinner8 className="h-16 w-16 animate-spin text-slate-300" />
          </main>
        }>
        <main className="grow overflow-scroll">
          <Outlet />
        </main>
      </Suspense>
    </div>
  )
}
