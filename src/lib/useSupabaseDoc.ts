import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { atomClient } from '~/jotai/jotai'

const useSupabaseDoc = <T extends object>(
  tableName: string,
  rowId: string,
): [T | null, boolean, any] => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const [supabase] = useAtom(atomClient)

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const { data: doc, error: localError } = await supabase!
          .from(tableName)
          .select('*')
          .eq('id', rowId)
          .single()

        if (localError) {
          throw localError
        }

        if (doc) {
          setData(doc)
        } else {
          setError(new Error('Row does not exist'))
        }

        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }

    fetchDoc()

    return () => {
      // Cleanup on unmount
    }
  }, [tableName, rowId, supabase])

  return [data, loading, error]
}

export default useSupabaseDoc
