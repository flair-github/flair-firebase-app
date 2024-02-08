import { DocUser } from 'Types/firebaseStructure'
import { User } from 'firebase/auth'
import { atom, useAtom } from 'jotai'

export const atomUser = atom<User | null | undefined>(undefined)
export const atomUserData = atom<DocUser | undefined>(undefined)

export const atomNodeExportedKeys = atom<Record<string, Record<string, boolean>>>({})
