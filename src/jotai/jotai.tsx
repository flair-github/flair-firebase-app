import { User } from 'firebase/auth'
import { atom, useAtom } from 'jotai'

export const atomUser = atom<User | null | undefined>(undefined)
