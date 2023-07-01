import React, { useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { useRef, useState } from 'react'
import { SignInButton } from '~/components/domain/auth/SignInButton'
import { SignOutButton } from '~/components/domain/auth/SignOutButton'
import { Head } from '~/components/shared/Head'
import { useAtomValue } from 'jotai'
import { atomUserData } from '~/jotai/jotai'
import { db } from '~/lib/firebase'

function Settings() {
  const userData = useAtomValue(atomUserData)

  useEffect(() => {
    if (!userData?.userId) {
      return
    }

    // TODO: Load own credentials document
    return () => {}
  }, [userData?.userId])

  return <></>
}

export default Settings
