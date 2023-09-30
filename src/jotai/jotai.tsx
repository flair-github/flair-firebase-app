import { DocUser } from 'Types/firebaseStructure'
import { User } from 'firebase/auth'
import { atom, useAtom } from 'jotai'
import { createClient } from '@supabase/supabase-js'
import { Database } from '~/supabase'

export const atomUser = atom<User | null | undefined>(undefined)
export const atomUserData = atom<DocUser | undefined>(undefined)
export const atomClient = atom(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_KEY
    ? createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)
    : undefined,
)
export const atomNodeKeys = atom<Record<string, string[]>>({})
