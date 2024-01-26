import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { findPercentagePosition } from '~/lib/utils'
import { borderPosAtom } from '../../FlowEditor'

export const dummyRunners = { current: new Set<() => void>() }

export const useRightIconMode = (yPos: number) => {
  const borderPos = useAtomValue(borderPosAtom)
  const [rightIconMode, setRightIconMode] = useState<'ellipsis' | 'spinner' | 'check'>('ellipsis')
  const run = useCallback(async () => {
    if (!borderPos) {
      setRightIconMode('ellipsis')
      return
    }

    const percentage = findPercentagePosition(yPos, borderPos.topMostY, borderPos.bottomMostY)
    const spinnerDuration = 2000 + percentage * 8000
    const checkDuration = 12000 - spinnerDuration

    setRightIconMode('spinner')
    await new Promise(resolve => setTimeout(resolve, spinnerDuration))
    setRightIconMode('check')
    await new Promise(resolve => setTimeout(resolve, checkDuration))
    setRightIconMode('ellipsis')
  }, [borderPos, yPos])

  useEffect(() => {
    dummyRunners.current.add(run)

    return () => {
      dummyRunners.current.delete(run)
    }
  }, [run])

  return { rightIconMode }
}
