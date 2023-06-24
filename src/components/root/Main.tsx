import React from 'react'
import { Router } from '~/components/router/Router'
import { setupFirebase } from '~/lib/firebase'
import { useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useSetAtom } from 'jotai'
import { atomUser } from '~/jotai/jotai'

function Main() {
  const setUser = useSetAtom(atomUser)

  useEffect(() => {
    setupFirebase()

    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user)
    })

    return () => {
      unsubscribe()
    }
  }, [setUser])

  return (
    <main>
      <Router />
    </main>
  )
}

export default Main
