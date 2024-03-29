import React, { type MutableRefObject, useEffect, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { Handle, Position } from 'reactflow'
import { type NodeData, nodeContents } from './Registry'
import { NodeHeader } from '~/components/shared/NodeHeader'
import clsx from 'clsx'

export interface DataExtractorNodeContent {
  nodeType: 'data-extractor'
  keyPromptPairs: Record<string, string>
}

export const inputNodeContents: MutableRefObject<{ [id: string]: DataExtractorNodeContent }> = {
  current: {},
}

export const DataExtractorNode = ({ data }: { data: NodeData }) => {
  const [keyPromptPairArr, setKeyPromptPairArr] = useState<
    Array<{ uniqueId: string; key: string; prompt: string }>
  >([])

  // Initial data
  useEffect(() => {
    if ('keyPromptPairs' in data.initialContents) {
      let i = 0

      const init: typeof keyPromptPairArr = []
      for (const [key, prompt] of Object.entries(data.initialContents.keyPromptPairs)) {
        init.push({
          uniqueId: String(Date.now()) + '-' + String(i),
          key,
          prompt,
        })
        i += 1
      }

      setKeyPromptPairArr(init)
    }
  }, [data.initialContents])

  // Copy node data to cache
  useEffect(() => {
    const newCache: DataExtractorNodeContent = {
      nodeType: 'data-extractor',
      keyPromptPairs: {},
    }

    keyPromptPairArr.forEach(el => {
      newCache.keyPromptPairs[el.key] = el.prompt
    })

    nodeContents.current[data.nodeId] = newCache
  }, [data.nodeId, keyPromptPairArr])

  const [isCollapsed, setIsCollapse] = useState(true)

  return (
    <div
      style={{
        background: 'white',
        borderWidth: '1px',
        borderColor: 'black',
        borderRadius: '5px',
        padding: '20px',
        width: 800,
      }}>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        style={{
          width: 16,
          height: 16,
          left: -8,
        }}
      />

      <div>
        <NodeHeader
          title="Data Extractor"
          color="blue"
          withFlair
          isCollapsed={isCollapsed}
          toggleCollapse={() => {
            setIsCollapse(x => !x)
          }}
        />

        <div className={clsx(isCollapsed && 'hidden')}>
          <div className="mb-1 flex">
            {/* Col */}
            <div className="mr-2 flex w-14 items-center" />

            {/* Key */}
            <div className="mr-2 w-28 font-bold">Header</div>

            {/* Prompt */}
            <div className="flex-1 font-bold">Prompt</div>

            <div className="ml-2 flex w-10 items-center justify-center" />
          </div>
          {keyPromptPairArr.map((el, index) => (
            <div key={el.uniqueId} className="mb-1 flex">
              {/* Col */}
              <div className="mr-2 flex w-14 items-center font-bold">
                <div>Col {index + 1}</div>
              </div>

              {/* Key */}
              <div className="mr-2 w-28">
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={2}
                  value={el.key}
                  onChange={e => {
                    const newKey = e.target.value

                    if (typeof newKey !== 'string') {
                      return
                    }

                    const newKeyValPair = {
                      uniqueId: el.uniqueId,
                      key: newKey,
                      prompt: el.prompt,
                    }

                    setKeyPromptPairArr(prev => {
                      const newKeyPromptPairs = [...prev]
                      newKeyPromptPairs[index] = newKeyValPair
                      return newKeyPromptPairs
                    })
                  }}
                  style={{ borderColor: 'black', resize: 'none' }}
                />
              </div>

              {/* Prompt */}
              <div className="flex-1">
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={2}
                  value={el.prompt}
                  onChange={e => {
                    const newPrompt = e.target.value

                    if (typeof newPrompt !== 'string') {
                      return
                    }

                    const newKeyPromptPair = {
                      uniqueId: el.uniqueId,
                      key: el.key,
                      prompt: newPrompt,
                    }

                    setKeyPromptPairArr(prev => {
                      const newKeyPromptPairs = [...prev]
                      newKeyPromptPairs[index] = newKeyPromptPair

                      return newKeyPromptPairs
                    })
                  }}
                  style={{ borderColor: 'black', resize: 'none' }}
                />
              </div>

              <div
                className="ml-2 flex w-10 items-center justify-center"
                onClick={() => {
                  setKeyPromptPairArr(prev => prev.filter(val => val.uniqueId !== el.uniqueId))
                }}>
                <div className="flex items-center justify-center" style={{ width: 22, height: 32 }}>
                  <GrFormClose style={{ color: '#6c757d' }} />
                </div>
              </div>
            </div>
          ))}
          <button
            className="btn"
            onClick={() => {
              setKeyPromptPairArr(prev => [
                ...prev,
                {
                  uniqueId: String(Date.now()),
                  key: '',
                  prompt: '',
                },
              ])
            }}>
            Add
          </button>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{
          width: 16,
          height: 16,
          right: -8,
        }}
      />
    </div>
  )
}
