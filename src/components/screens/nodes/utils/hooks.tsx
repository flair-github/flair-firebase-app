import { useAtom } from 'jotai'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { NodeContent, allExportedColumnsAtom, allNodeContentsAtom, nodeContents } from '../Registry'
import { ancestorsDataAtom } from '../../FlowEditor'

export const useNodeContent = <T extends NodeContent>({
  nodeId,
  initialContent,
  defaultContent,
  exportedColumnsGen,
}: {
  nodeId: string
  initialContent: T
  defaultContent: T
  exportedColumnsGen?: (content: T) => Record<string, any>
}) => {
  const [nodeContent, setNodeContent] = useState<T>(defaultContent)

  // Initial data
  useEffect(() => {
    if (initialContent?.nodeType === defaultContent.nodeType) {
      setNodeContent(cloneDeep(initialContent))
    }
  }, [defaultContent, initialContent, setNodeContent])

  // Copy node data to cache
  const [allNodeContents, setAllNodeContents] = useAtom(allNodeContentsAtom)
  useEffect(() => {
    const cache = cloneDeep(nodeContent)
    nodeContents.current[nodeId] = cache
    setAllNodeContents({ ...nodeContents.current })
  }, [nodeId, nodeContent, setAllNodeContents])

  // Get exported columns
  const [exportedColumns, setExportedColumns] = useState<string[]>([])
  const [allExportedColumns, setAllExportedColumns] = useAtom(allExportedColumnsAtom)
  useEffect(() => {
    if (!exportedColumnsGen) {
      setExportedColumns([])
      setAllExportedColumns(prev => ({
        ...prev,
        [nodeId]: {},
      }))
      return
    }

    let pairs: Record<string, any>

    try {
      pairs = exportedColumnsGen(nodeContent)
    } catch (e) {
      pairs = {}
    }

    setExportedColumns(Object.keys(pairs))
    setAllExportedColumns(prev => ({
      ...prev,
      [nodeId]: pairs,
    }))
  }, [exportedColumnsGen, nodeContent, nodeId, setAllExportedColumns])

  // Get imported columns
  const [ancestorsData] = useAtom(ancestorsDataAtom)
  const importedColumns = useMemo(() => {
    const ancestors = ancestorsData[nodeId]

    if (!ancestors) {
      return []
    }

    const newImportedColumns = new Set<string>()

    for (const ancestorNodeId of ancestors) {
      if (ancestorNodeId === nodeId) {
        continue
      }

      if (!allExportedColumns[ancestorNodeId]) {
        continue
      }

      for (const columnName of Object.keys(allExportedColumns[ancestorNodeId])) {
        newImportedColumns.add(columnName)
      }
    }

    return [...newImportedColumns]
  }, [allExportedColumns, ancestorsData, nodeId])

  return { nodeContent, setNodeContent, importedColumns, exportedColumns }
}
