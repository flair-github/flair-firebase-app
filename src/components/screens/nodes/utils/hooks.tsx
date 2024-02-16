import { useAtom } from 'jotai'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { NodeContent, allNodeContentsAtom, nodeContents } from '../Registry'
import { ancestorsDataAtom } from '../../FlowEditor'

export const useNodeContent = <T extends NodeContent>({
  nodeId,
  initialContent,
  defaultContent,
}: {
  nodeId: string
  initialContent: T
  defaultContent: T
}) => {
  const [nodeContent, setNodeContent] = useState<T>(defaultContent)

  // Initial data
  useEffect(() => {
    if (initialContent?.nodeType === defaultContent.nodeType) {
      setNodeContent(cloneDeep(defaultContent))
    }
  }, [defaultContent, initialContent, setNodeContent])

  // Copy node data to cache
  const [allNodeContents, setAllNodeContents] = useAtom(allNodeContentsAtom)
  useEffect(() => {
    const cache = cloneDeep(nodeContent)
    nodeContents.current[nodeId] = cache
    setAllNodeContents({ ...nodeContents.current })
  }, [nodeId, nodeContent, setAllNodeContents])

  const [ancestorsData] = useAtom(ancestorsDataAtom)

  return { nodeContent, setNodeContent, ancestorsData }
}
