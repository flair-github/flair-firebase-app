import React from 'react'
import clsx from 'clsx'
import { useState } from 'react'
import { Head } from '~/components/shared/Head'
import { Description, Field, FieldGroup, Fieldset, Label, Legend } from '../../catalyst/fieldset'
import { Input } from '../../catalyst/input'
import { Select } from '../../catalyst/select'
import { Text } from '../../catalyst/text'
import { Textarea } from '../../catalyst/textarea'
import { useAtom, useAtomValue } from 'jotai'
import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { atomUser, atomUserData } from '~/jotai/jotai'

const Settings: React.FC<{}> = () => {
  const [activeTab, setActiveTab] = useState('My Account')
  const userData = useAtomValue(atomUserData)
  const user = useAtomValue(atomUser)

  const tabs = [
    { name: 'My Account', current: activeTab === 'My Account' },
    { name: 'Billing', current: activeTab === 'Billing' },
  ]

  const handleTabClick = (tabName: string) => {
    window.scrollTo(0, 0)
    setActiveTab(tabName)
  }

  return (
    <>
      <Head title="Settings" />
      <div className="flex w-full">
        {/* Main View */}
        <div className="flex h-screen flex-1 flex-col overflow-hidden">
          {/* Row: Header */}
          <div className="flex h-[68px] flex-none items-center border-b bg-slate-50 px-[20px]">
            <div className="text-[20px] font-medium">Settings</div>
            <div className="flex-1" />
          </div>
          {/* Row: Content */}
          <div className="flex flex-1 overflow-scroll">
            <div className="mx-auto mt-6 w-full max-w-[1024px] px-4">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map(tab => (
                    <div
                      key={tab.name}
                      onClick={() => handleTabClick(tab.name)}
                      className={clsx(
                        tab.current
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'cursor-pointer whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
                      )}
                      aria-current={tab.current ? 'page' : undefined}>
                      {tab.name}
                    </div>
                  ))}
                </nav>
              </div>
              {/* Content */}
              {activeTab === 'My Account' && (
                <div className="my-5">
                  <Fieldset>
                    <FieldGroup>
                      <Field>
                        <Label>Name</Label>
                        <Input name="name" disabled value={userData?.userName || ''} />
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <Label>Email</Label>
                        <Input name="email" disabled value={user?.email || ''} />
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <Label>Organization</Label>
                        <Input name="email" disabled value={'company' || ''} />
                      </Field>
                    </FieldGroup>
                  </Fieldset>
                </div>
              )}

              {activeTab === 'Billing' && <Pricing />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings

const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' },
] as const

const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    href: '#',
    price: { monthly: '$0', annually: '$0' },
    description: "The essentials to try Flair's power.",
    features: ['1 Data Source', '1 pipeline', '100 rows per month'],
    featured: false,
    cta: 'Current Plan',
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '#',
    price: { monthly: '$200', annually: '$2200' },
    description: 'A plan that scales with your rapidly growing business.',
    features: [
      'Unlimited data sources',
      'Unlimited pipelines',
      'Unlimited data destinations',
      '1000 rows per month',
      'Slack channel support',
    ],
    featured: false,
    cta: 'Buy plan',
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    price: 'Custom',
    description: 'Dedicated support and infrastructure for your company.',
    features: [
      'Unlimited data processing',
      'Unlimited AI agents',
      'Custom onboarding',
      'Priority support',
    ],
    featured: false,
    cta: 'Contact sales',
  },
]

function Pricing() {
  const [frequency, setFrequency] = useState(frequencies[0])

  return (
    <div className="bg-white py-6">
      <div className="max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-7 max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pricing plans for teams of&nbsp;all&nbsp;sizes
          </p>
        </div>

        <div className="flex justify-center">
          <RadioGroup
            value={frequency}
            onChange={setFrequency}
            className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200">
            <RadioGroup.Label className="sr-only">Payment frequency</RadioGroup.Label>
            {frequencies.map(option => (
              <RadioGroup.Option
                key={option.value}
                value={option}
                className={({ checked }) =>
                  clsx(
                    checked ? 'bg-blue-600 text-white' : 'text-gray-500',
                    'cursor-pointer rounded-full px-2.5 py-1',
                  )
                }>
                <span>{option.label}</span>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map(tier => (
            <div
              key={tier.id}
              className={clsx(
                tier.featured ? 'bg-gray-900 ring-gray-900' : 'ring-gray-200',
                'rounded-3xl p-8 ring-1 xl:p-10',
              )}>
              <h3
                id={tier.id}
                className={clsx(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-lg font-semibold leading-8',
                )}>
                {tier.name}
              </h3>
              <p
                className={clsx(
                  tier.featured ? 'text-gray-300' : 'text-gray-600',
                  'mt-4 text-sm leading-6',
                )}>
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span
                  className={clsx(
                    tier.featured ? 'text-white' : 'text-gray-900',
                    'text-4xl font-bold tracking-tight',
                  )}>
                  {typeof tier.price === 'string' ? tier.price : tier.price[frequency.value]}
                </span>
                {typeof tier.price !== 'string' ? (
                  <span
                    className={clsx(
                      tier.featured ? 'text-gray-300' : 'text-gray-600',
                      'text-sm font-semibold leading-6',
                    )}>
                    {frequency.priceSuffix}
                  </span>
                ) : null}
              </p>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={clsx(
                  tier.featured
                    ? 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white'
                    : 'bg-blue-600 text-white shadow-sm hover:bg-blue-500 focus-visible:outline-blue-600',
                  'mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                )}>
                {tier.cta}
              </a>
              <ul
                role="list"
                className={clsx(
                  tier.featured ? 'text-gray-300' : 'text-gray-600',
                  'mt-8 space-y-3 text-sm leading-6 xl:mt-10',
                )}>
                {tier.features.map(feature => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className={clsx(
                        tier.featured ? 'text-white' : 'text-blue-600',
                        'h-6 w-5 flex-none',
                      )}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
