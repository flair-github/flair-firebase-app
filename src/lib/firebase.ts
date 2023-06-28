import { FirebaseApp, initializeApp } from 'firebase/app'
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectStorageEmulator, getStorage } from 'firebase/storage'
import firebase from 'firebase/compat/app'
// Required for side-effects
import 'firebase/compat/firestore'
import 'firebase/compat/functions'

let firebaseApp: FirebaseApp
const useEmulator = () => import.meta.env.VITE_USE_FIREBASE_EMULATOR

const getFirebaseOptions = () => ({
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASEURL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
})

firebase.initializeApp(getFirebaseOptions())
export const db = firebase.firestore()
export const functions = firebase.functions()

export const setupFirebase = () => {
  try {
    firebaseApp = initializeApp(getFirebaseOptions())
  } catch (error) {
    console.error({ error })
  }
}

let auth: Auth
let firestore: ReturnType<typeof getFirestore>
let storage: ReturnType<typeof getStorage>

export const useAuth = () => {
  const isEmulator = useEmulator()
  auth = getAuth(firebaseApp)

  if (isEmulator) {
    connectAuthEmulator(auth, 'http://localhost:9099')
  }
  return auth
}

export const useFirestore = () => {
  const isEmulator = useEmulator()

  if (!firestore) {
    firestore = getFirestore()
    if (isEmulator) {
      connectFirestoreEmulator(firestore, 'localhost', 8080)
    }
  }
  return firestore
}

export const useStorage = () => {
  const isEmulator = useEmulator()

  if (!storage) {
    storage = getStorage()
    if (isEmulator) {
      connectStorageEmulator(storage, 'localhost', 9199)
    }
  }
  return storage
}
