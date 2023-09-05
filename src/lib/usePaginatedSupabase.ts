import { SupabaseClient } from '@supabase/supabase-js'
import { useAtom } from 'jotai'
import { useState, useEffect, useCallback } from 'react'
import { atomClient } from '~/jotai/jotai'

function usePaginatedSupabase<T>(
  tableName: string,
  pageSize: number,
  conditions: { column: string; operator: 'eq' | 'gte' | 'lte' | 'ilike'; value: any }[],
  orders: { column: string; direction: 'asc' | 'desc' }[],
) {
  const [supabase] = useAtom(atomClient)
  const [items, setItems] = useState<T[]>([])
  const [lastId, setLastId] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const loadMore = useCallback(async () => {
    if (!hasMore) {
      return
    }

    setLoading(true)

    let query = supabase!.from(tableName).select().limit(pageSize)
    // for (const condition of conditions) {
    //   query = query[condition.operator](condition.column, condition.value)
    // }
    for (const order of orders) {
      query = query.order(order.column, { ascending: order.direction === 'asc' })
    }
    // if (lastId) {
    //   query = query.gt('id', lastId)
    // }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
      return
    }

    if (data && data.length) {
      const lastItem = data[data.length - 1]
      setLastId(lastItem.id)
      setItems(prevItems => [...prevItems, ...data])
    } else {
      setHasMore(false)
    }

    setLoading(false)
  }, [hasMore, supabase, tableName, pageSize, orders])

  useEffect(() => {
    ;(async () => {
      setLoading(true)

      let query = supabase!.from(tableName).select().limit(pageSize)
      // for (const condition of conditions) {
      //   query = query[condition.operator](condition.column, condition.value)
      // }
      for (const order of orders) {
        query = query.order(order.column, { ascending: order.direction === 'asc' })
      }
      // if (lastId) {
      //   query = query.gt('id', lastId)
      // }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
        return
      }

      if (data && data.length) {
        const lastItem = data[data.length - 1]
        setLastId(lastItem.id)
        setItems(prevItems => [...prevItems, ...data])
      } else {
        setHasMore(false)
      }

      setLoading(false)
    })()
  }, [orders, pageSize, supabase, tableName])

  return {
    items,
    loading,
    hasMore,
    loadMore,
  }
}

export default usePaginatedSupabase
