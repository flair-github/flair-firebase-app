import React, { useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { useRef, useState } from 'react'
import { SignInButton } from '~/components/domain/auth/SignInButton'
import { SignOutButton } from '~/components/domain/auth/SignOutButton'
import { Head } from '~/components/shared/Head'
import { useAtomValue } from 'jotai'
import { atomUser } from '~/jotai/jotai'

function Index() {
  const [isOpen, setIsOpen] = useState(true)
  const completeButtonRef = useRef(null)

  const user = useAtomValue(atomUser)

  return (
    <>
      <Head title="Home" />
    </>
  )
}

export default Index
