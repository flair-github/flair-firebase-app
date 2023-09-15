import { Dialog } from '@headlessui/react'
import { useAtom } from 'jotai'
import React from 'react'
import Modal from '~/components/ui/modal'
import { edgesAtom, nodesAtom } from '../FlowEditor'

function JSONImporterModal({
  isJsonImportModalShown,
  setIsJsonImportModalShown,
  jsonConfigImport,
  setJsonConfigImport,
}: {
  isJsonImportModalShown: boolean
  setIsJsonImportModalShown: React.Dispatch<React.SetStateAction<boolean>>
  jsonConfigImport: string
  setJsonConfigImport: React.Dispatch<React.SetStateAction<string>>
}) {
  const [_nodes, setNodes] = useAtom(nodesAtom)
  const [_edges, setEdges] = useAtom(edgesAtom)

  return (
    <Modal
      isOpen={isJsonImportModalShown}
      onClose={() => {
        setIsJsonImportModalShown(false)
      }}>
      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
        Import JSON Configuration File
      </Dialog.Title>

      <div>
        {/* <Form.Control
            as="textarea"
            rows={8}
            value={jsonConfigImport}
            onChange={e => {
              const text = e.target.value
              setJsonConfigImport(text)
            }}
            style={{ borderColor: 'black' }}
          /> */}
      </div>

      <div className="mt-4 flex">
        <button
          type="button"
          className="t-border inline-flex justify-center rounded-md border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          onClick={() => {
            setJsonConfigImport('')
            setIsJsonImportModalShown(false)
          }}>
          Close
        </button>
        <div className="flex-1" />
        <button
          type="button"
          className="t-border mr-1 inline-flex justify-center rounded-md border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          onClick={() => {
            const { nodes: newNodes, edges: newEdges } = JSON.parse(jsonConfigImport)

            setNodes(newNodes)
            setEdges(newEdges)

            setJsonConfigImport('')
            setIsJsonImportModalShown(false)
          }}>
          Import
        </button>
      </div>
    </Modal>
  )
}

export default JSONImporterModal
