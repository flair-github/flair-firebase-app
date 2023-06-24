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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-300">
      <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-96 max-w-md">
       <div className="flex justify-center">
        <img src="images/flair-ai.svg" width={120} height={32} className="" />
       </div>
        <button onClick={handleGoogleLoginClick} className="relative mt-6 border rounded-md py-2 text-sm text-gray-800 bg-gray-100 hover:bg-gray-200">
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  );
}

export default PageLogin
