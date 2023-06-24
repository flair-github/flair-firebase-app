import React from 'react'
import { Router } from '~/components/router/Router'
import { db, setupFirebase } from '~/lib/firebase'
import { useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useSetAtom } from 'jotai'
import { atomUser } from '~/jotai/jotai'
import { DocUserData } from 'Types/firebaseStructure'
import { Timestamp, serverTimestamp } from 'firebase/firestore'

function Main() {
  const setUser = useSetAtom(atomUser)

  useEffect(() => {
    setupFirebase()

    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user)

      const uid = user?.uid

      if (typeof uid === 'string') {
        ;(async () => {
          const userDataRef = db.collection('user_data').doc(uid)
          const snap = await userDataRef.get()

          if (snap.exists) {
            // If user data already exists, do nothing
          } else {
            // If it doesn't exist, create user data
            const newUserData: DocUserData = {
              createdTimestamp: serverTimestamp() as Timestamp,
              docExists: true,
              updatedTimestamp: serverTimestamp() as Timestamp,
              userId: uid,
              userName: user?.displayName || 'Flair User',
              userPhotoUrl:
                user?.photoURL || 'https://www.gravatar.com/avatar/' + user?.uid + '?d=retro&f=y',
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

  return (
    <main>
      <Router />
    </main>
  )
}

export default Main
