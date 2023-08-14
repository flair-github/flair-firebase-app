import { useState, useEffect } from 'react'
import { db } from './firebase'
import { DocumentData } from '@firebase/firestore-types'

const useFirestoreDoc = <T extends DocumentData>(
  collectionName: string,
  docId: string,
): [T | null, boolean, any] => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const docRef = db.collection(collectionName).doc(docId)

    const unsubscribe = docRef.onSnapshot(
      doc => {
        if (doc.exists) {
          setData(doc.data() as T)
        } else {
          setError(new Error('Document does not exist'))
        }
        setLoading(false)
      },
      err => {
        setError(err)
        setLoading(false)
      },
    )

    // Cleanup listener on unmount
    return () => {
      unsubscribe()
    }
  }, [collectionName, docId])

  return [data, loading, error]
}

export default useFirestoreDoc
