import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { findPercentagePosition } from '~/lib/utils'
import { borderPosAtom } from '../../FlowEditor'
import { NodeContent } from '../Registry'

//
// For dummy runners
//

interface RunnerSet {
  nodeType: NodeContent['nodeType']
  run: ({ duration }: { duration: 'standard' | 'forever' }) => Promise<void>
  stop: () => Promise<void>
}

export const dummyRunners = { current: new Set<RunnerSet>() }

export const useRightIconMode = (yPos: number, nodeType: NodeContent['nodeType']) => {
  const borderPos = useAtomValue(borderPosAtom)
  const [didRunOnce, setDidOnceRun] = useState(false)
  const [rightIconMode, setRightIconMode] = useState<'ellipsis' | 'spinner' | 'check'>('ellipsis')

  const run: RunnerSet['run'] = useCallback(
    async ({ duration }: { duration: 'standard' | 'forever' }) => {
      if (!borderPos) {
        setRightIconMode('ellipsis')
        return
      }

      const percentage = findPercentagePosition(yPos, borderPos.topMostY, borderPos.bottomMostY)
      const spinnerDuration = 2000 + percentage * 8000
      const checkDuration = 12000 - spinnerDuration

      setRightIconMode('spinner')

      if (duration === 'forever') {
        return
      }

      await new Promise(resolve => setTimeout(resolve, spinnerDuration))
      setRightIconMode('check')
      setDidOnceRun(true)
      await new Promise(resolve => setTimeout(resolve, checkDuration))
      setRightIconMode('ellipsis')
    },
    [borderPos, yPos],
  )

  const stop: RunnerSet['stop'] = useCallback(async () => {
    setRightIconMode('check')
    setDidOnceRun(true)
    await new Promise(resolve => setTimeout(resolve, 4000))
    setRightIconMode('ellipsis')
  }, [])

  useEffect(() => {
    if (nodeType === 'init') {
      return
    }

    const runnerSet: RunnerSet = {
      nodeType,
      run,
      stop,
    }

    dummyRunners.current.add(runnerSet)

    return () => {
      dummyRunners.current.delete(runnerSet)
    }
  }, [run, stop, nodeType])

  return { rightIconMode, didRunOnce }
}
