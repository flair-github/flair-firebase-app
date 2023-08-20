import { useState, useEffect, useCallback } from 'react'
import { db } from './firebase' // Your Firestore config and initialization
import { DocumentData, QueryDocumentSnapshot } from '@firebase/firestore-types'
import { WhereFilterOp } from 'firebase/firestore'

function usePaginatedFirestore<T extends DocumentData>(
  collectionName: string,
  pageSize: number,
  where: [string, WhereFilterOp, string][],
) {
  const [items, setItems] = useState<T[]>([])
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<T> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const loadMore = useCallback(async () => {
    if (!hasMore) {
      return
    }

    setLoading(true)

    let query = db.collection(collectionName).limit(pageSize)
    for (const clause of where) {
      query = query.where(...clause)
    }
    query = query.orderBy('createdTimestamp', 'desc')

    if (lastVisible) {
      query = query.startAfter(lastVisible)
    }
    const snapshot = await query.get()

    if (!snapshot.empty) {
      const lastItem = snapshot.docs[snapshot.docs.length - 1] as QueryDocumentSnapshot<T>
      setLastVisible(lastItem)
      setHasMore(true)
    } else {
      setLastVisible(null)
      setHasMore(false)
    }
    setItems(prevItems => [...prevItems, ...snapshot.docs.map((doc: any) => doc.data() as T)])
    setLoading(false)
  }, [collectionName, hasMore, lastVisible, pageSize, where])

  useEffect(() => {
    ;(async () => {
      setLoading(true)

      let query = db.collection(collectionName).limit(pageSize)
      for (const clause of where) {
        query = query.where(...clause)
      }
      query = query.orderBy('createdTimestamp', 'desc')
      const snapshot = await query.get()

      if (!snapshot.empty) {
        const lastItem = snapshot.docs[snapshot.docs.length - 1] as QueryDocumentSnapshot<T>
        setLastVisible(lastItem)
        setHasMore(true)
      } else {
        setLastVisible(null)
        setHasMore(false)
      }
      setItems(snapshot.docs.map((doc: any) => doc.data() as T))
      setLoading(false)
    })()
  }, [collectionName, pageSize, where])

  return {
    items,
    loading,
    hasMore,
    loadMore,
  }
}

export default usePaginatedFirestore
