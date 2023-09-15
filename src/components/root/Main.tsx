import React from 'react'
import { Router } from '~/components/router/Router'
import { db, setupFirebase } from '~/lib/firebase'
import { useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomUser, atomUserData } from '~/jotai/jotai'
import { DocUser } from 'Types/firebaseStructure'
import { Timestamp, serverTimestamp } from 'firebase/firestore'
import SupabaseRouter from '../router/SupabaseRouter'
import SharedResult from '../screens/SharedResult'

function Main() {
  const [user, setUser] = useAtom(atomUser)
  const userId = user?.uid

  useEffect(() => {
    setupFirebase()

    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, newUser => {
      setUser(newUser)

      const uid = newUser?.uid

      if (typeof uid === 'string') {
        ;(async () => {
          const userDataRef = db.collection('users').doc(uid)
          const snap = await userDataRef.get()

          if (snap.exists) {
            // If user data already exists, do nothing
          } else {
            // If it doesn't exist, create user data
            const newUserData: DocUser = {
              createdTimestamp: serverTimestamp() as Timestamp,
              docExists: true,
              updatedTimestamp: serverTimestamp() as Timestamp,
              userId: uid,
              userName: newUser?.displayName || 'Flair User',
              userPhotoUrl:
                newUser?.photoURL ||
                'https://www.gravatar.com/avatar/' + newUser?.uid + '?d=retro&f=y',
            }
            await userDataRef.set(newUserData)
          }
        })()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [setUser])

  const setUserData = useSetAtom(atomUserData)
  useEffect(() => {
    if (!userId) {
      return
    }

    const unsub = db
      .collection('users')
      .doc(userId)
      .onSnapshot(snap => {
        const newUserData = snap.data() as DocUser
        setUserData(newUserData)
      })

    return () => {
      unsub()
    }
  }, [setUserData, userId])

  const shared_token = new URLSearchParams(window.location.search).get('shared_token')
  if (shared_token) {
    return <SharedResult shared_token={shared_token} />
  }

  return (
    <main>
      {import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_KEY ? (
        <SupabaseRouter />
      ) : (
        <Router />
      )}
    </main>
  )
}

export default Main
