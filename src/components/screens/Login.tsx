import React from 'react'
import { Dialog } from '@headlessui/react'
import { useRef, useState } from 'react'
import { SignInButton } from '~/components/domain/auth/SignInButton'
import { SignOutButton } from '~/components/domain/auth/SignOutButton'
import { Head } from '~/components/shared/Head'
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth'
import { useAuth } from '~/lib/firebase'

function PageLogin() {
  const auth = useAuth()

  const handleGoogleLoginClick = () => {
    const provider = new GoogleAuthProvider()

    signInWithRedirect(auth, provider)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-300">
      <div className="flex w-96 flex-col rounded-md bg-white px-4 py-8 shadow-md sm:px-6 md:px-8 lg:px-10">
        <div className="flex justify-center">
          <img src="images/flair-ai.svg" width={120} height={32} className="" />
        </div>
        <button
          onClick={handleGoogleLoginClick}
          className="relative mt-6 rounded-md border bg-gray-100 py-2 text-sm text-gray-800 hover:bg-gray-200">
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  )
}

export default PageLogin
