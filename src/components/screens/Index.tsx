import React from 'react'
import { Dialog } from '@headlessui/react'
import { useRef, useState } from 'react'
import { SignInButton } from '~/components/domain/auth/SignInButton'
import { SignOutButton } from '~/components/domain/auth/SignOutButton'
import { Head } from '~/components/shared/Head'
import { useAtomValue } from 'jotai'
import { atomUser } from '~/jotai/jotai'

function Index() {
  const [isOpen, setIsOpen] = useState(true)
  const completeButtonRef = useRef(null)

  const user = useAtomValue(atomUser)

  return (
    <>
      <Head title="TOP PAGE" />
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-3xl font-bold">
              <a
                className="link-primary link"
                target="_blank"
                href="https://vitejs.dev/"
                rel="noreferrer">
                Vite
              </a>{' '}
              +{' '}
              <a
                className="link-primary link"
                target="_blank"
                href="https://reactjs.org/"
                rel="noreferrer">
                React
              </a>{' '}
              +{' '}
              <a
                className="link-primary link"
                target="_blank"
                href="https://www.typescriptlang.org/"
                rel="noreferrer">
                TypeScript
              </a>{' '}
              +{' '}
              <a
                className="link-primary link"
                target="_blank"
                href="https://tailwindcss.com/"
                rel="noreferrer">
                TailwindCSS
              </a>{' '}
              Starter
            </h1>
            <p className="mt-4 text-lg">
              For fast <b>prototyping</b>. Already set up{' '}
              <a
                className="link-primary link"
                target="_blank"
                href="https://github.com/firebase/firebase-js-sdk"
                rel="noreferrer">
                Firebase(v9)
              </a>
              ,{' '}
              <a
                className="link-primary link"
                target="_blank"
                href="https://daisyui.com/"
                rel="noreferrer">
                daisyUI
              </a>
              ,{' '}
              <a
                className="link-primary link"
                target="_blank"
                href="https://github.com/eslint/eslint"
                rel="noreferrer">
                ESLint
              </a>
              ,{' '}
              <a
                className="link-primary link"
                target="_blank"
                href="https://github.com/prettier/prettier"
                rel="noreferrer">
                Prettier
              </a>
              .
            </p>
            <div className="mt-4 grid gap-2">
              {!user ? <SignInButton /> : <SignOutButton />}
              <button onClick={() => setIsOpen(true)}>Display Dialog</button>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        className="fixed inset-0 z-10 flex overflow-y-auto"
        initialFocus={completeButtonRef}
        open={isOpen}
        onClose={() => setIsOpen(false)}>
        <div className="flex min-h-screen w-screen items-center justify-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative mx-auto max-w-120 rounded bg-white p-8">
            <Dialog.Title>Dialog Title</Dialog.Title>
            <Dialog.Description>Dialog description</Dialog.Description>
            <button
              ref={completeButtonRef}
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={() => setIsOpen(false)}>
              Got it, thanks!
            </button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default Index
