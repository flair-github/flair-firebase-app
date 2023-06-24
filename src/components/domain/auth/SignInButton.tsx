import React from 'react'
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth'
import { useAuth } from '~/lib/firebase'

export const SignInButton = () => {
  const auth = useAuth()

  const handleClick = () => {
    const provider = new GoogleAuthProvider()
    // @see https://firebase.google.com/docs/auth/web/google-signin
    auth.languageCode = 'ja'

    signInWithRedirect(auth, provider)
  }

  return (
    <button onClick={handleClick} type="button" className="btn-primary btn min-w-60 normal-case">
      Sign In With Google
    </button>
  )
}
