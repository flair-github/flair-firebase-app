import React, { useState } from 'react'
import { Link, useNavigate, useNavigation } from 'react-router-dom'
import { FaRocket } from 'react-icons/fa'
import { HiDocumentReport } from 'react-icons/hi'
import { getAverage } from '~/lib/averager'
import { timestampToLocaleString } from './LLMOutputs'
import { DocWorkflowResult } from 'Types/firebaseStructure'
import { OrderByDirection, WhereFilterOp } from 'firebase/firestore'
import usePaginatedFirestore from '~/lib/usePaginatedFirestore'
import { ImSpinner8, ImSpinner9 } from 'react-icons/im'
import { Button } from '~/catalyst/button'
import { simpleHash } from '~/lib/simpleHash'
import { Select } from '~/catalyst/select'
import { Input } from '~/catalyst/input'
import { Checkbox } from '~/catalyst/checkbox'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

const statuses: Record<string, string> = {
  Paid: 'text-green-700 bg-green-50 ring-green-600/20',
  Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
}
const clients = [
  {
    id: 1,
    name: 'production-s3',
    service: 'AWS S3',
    imageUrl: '/images/data-sources/s3.svg',
    lastUsage: {
      date: 'December 1, 2022',
    },
  },
  {
    id: 1,
    name: 'staging-s3',
    service: 'AWS S3',
    imageUrl: '/images/data-sources/s3.svg',
    lastUsage: {
      date: 'December 30, 2022',
    },
  },
  {
    id: 1,
    name: 'main-gcp',
    service: 'Google Cloud Service',
    imageUrl: '/images/data-sources/gcp.svg',
    lastUsage: {
      date: 'December 15, 2022',
    },
  },
  {
    id: 1,
    name: 'sub-gcp',
    service: 'Google Cloud Service',
    imageUrl: '/images/data-sources/gcp.svg',
    lastUsage: {
      date: 'December 24, 2022',
    },
  },
  {
    id: 1,
    name: 'sms-server',
    service: 'Twilio',
    imageUrl: '/images/data-sources/twilio.svg',
    lastUsage: {
      date: 'December 24, 2022',
    },
  },
  {
    id: 1,
    name: 'index-db',
    service: 'Postgres DB',
    imageUrl: '/images/data-sources/postgres.svg',
    lastUsage: {
      date: 'December 24, 2022',
    },
  },
]

function Credentials() {
  return (
    <div className="bg-slate-50">
      <div className="flex h-16 items-center border-b bg-white px-5">
        <div className="text-lg font-medium">Credentials</div>
      </div>

      <div className="min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mt-8 flow-root overflow-hidden rounded-lg border">
            <div className="border-gray-200 bg-white px-4 py-5 sm:px-6">
              <div className="-ml-4 -mt-2 mb-5 flex flex-wrap items-center justify-between border-b pb-5 sm:flex-nowrap">
                <div className="ml-4 mt-2 shrink-0">
                  <button
                    type="button"
                    className="relative inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    Add Credential
                  </button>
                </div>
                <div className="ml-4 mt-2">
                  {/* <h3 className="text-base font-semibold leading-6 text-gray-900">Job Postings</h3> */}
                </div>
              </div>
              <ul
                role="list"
                className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
                {clients.map(client => (
                  <li key={client.id} className="overflow-hidden rounded-xl border border-gray-200">
                    <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                      <img
                        src={client.imageUrl}
                        alt={client.name}
                        className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-900">{client.service}</div>
                      </div>
                      <Menu as="div" className="relative ml-auto">
                        <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                          <span className="sr-only">Open options</span>
                          <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95">
                          <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={clsx(
                                    active ? 'bg-gray-50' : '',
                                    'block px-3 py-1 text-sm leading-6 text-gray-900',
                                  )}>
                                  View<span className="sr-only">, {client.name}</span>
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={clsx(
                                    active ? 'bg-gray-50' : '',
                                    'block px-3 py-1 text-sm leading-6 text-gray-900',
                                  )}>
                                  Edit<span className="sr-only">, {client.name}</span>
                                </a>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                    <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                      <div className="flex justify-between gap-x-4 py-3">
                        <dt className="text-gray-500">Last usage</dt>
                        <dd className="text-gray-700">
                          <time>{client.lastUsage.date}</time>
                        </dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Credentials
