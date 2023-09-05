import { SupabaseClient } from '@supabase/supabase-js'
import { useAtom } from 'jotai'
import { useState, useEffect, useCallback, useRef } from 'react'
import { atomClient } from '~/jotai/jotai'

function usePaginatedSupabase<T>(
  tableName: string,
  pageSize: number,
  conditions: { column: string; operator: 'eq' | 'gte' | 'lte' | 'ilike'; value: any }[],
  orders: { column: string; direction: 'asc' | 'desc' }[],
) {
  const [supabase] = useAtom(atomClient)
  const [items, setItems] = useState<T[]>([])
  const [lastIdx, setLastIdx] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const loadMore = useCallback(async () => {
    if (!hasMore) {
      return
    }

    setLoading(true)

    let query = supabase!
      .from(tableName)
      .select()
      .range(lastIdx, lastIdx + pageSize - 1)
    for (const condition of conditions) {
      switch (condition.operator) {
        case 'eq':
          query = query.eq(condition.column, condition.value)
          break
        case 'gte':
          query = query.gte(condition.column, condition.value)
          break
        case 'lte':
          query = query.lte(condition.column, condition.value)
          break
        case 'ilike':
          query = query.ilike(condition.column, condition.value)
          break
      }
    }
    for (const order of orders) {
      query = query.order(order.column, { ascending: order.direction === 'asc' })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
      return
    }

    if (data && data.length) {
      setLastIdx(lastIdx + data.length)
      setItems(prevItems => [...prevItems, ...data])
    } else {
      setHasMore(false)
    }

    setLoading(false)
  }, [hasMore, supabase, tableName, pageSize, lastIdx, conditions, orders])

  useEffect(() => {
    const ac = new AbortController()

    ;(async () => {
      setLoading(true)

      let query = supabase!
        .from(tableName)
        .select()
        .range(0, pageSize - 1)
      console.log(conditions)
      for (const condition of conditions) {
        switch (condition.operator) {
          case 'eq':
            query = query.eq(condition.column, condition.value)
            break
          case 'gte':
            query = query.gte(condition.column, condition.value)
            break
          case 'lte':
            query = query.lte(condition.column, condition.value)
            break
          case 'ilike':
            query = query.ilike(condition.column, condition.value)
            break
        }
      }
      for (const order of orders) {
        query = query.order(order.column, { ascending: order.direction === 'asc' })
      }
      query.abortSignal(ac.signal)
      const { data, error } = await query

      if (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
        return
      }

      if (data && data.length) {
        setLastIdx(pageSize)
        setItems(prevItems => [...prevItems, ...data])
      } else {
        setHasMore(false)
      }

      setLoading(false)
    })()

    return () => {
      ac.abort()
      setItems([])
    }
  }, [conditions, orders, pageSize, supabase, tableName])

  return {
    items,
    loading,
    hasMore,
    loadMore,
  }
}

export default usePaginatedSupabase
