import React, { useCallback, useEffect, useState } from 'react'
import ResultDetails from './ResultDetails'
import { db } from '../../lib/firebase'

function useGetWorkflowResultIdByToken(shared_token: string) {
  const [workflowResultId, setWorkflowResultId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getWorkflowResultIdByToken = useCallback(async (sharedToken: string): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      // Query the Firestore collection to find the document with the given shared_token
      const querySnapshot = await db
        .collection('workflow_results')
        .where('shared_token', '==', sharedToken)
        .get()

      if (!querySnapshot.empty) {
        // Retrieve the first matching document's ID (workflowResultId)
        const doc = querySnapshot.docs[0]
        console.log(doc)

        setWorkflowResultId(doc.id)
      } else {
        setError('No matching document found for the shared token.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getWorkflowResultIdByToken(shared_token)
  }, [getWorkflowResultIdByToken, shared_token])

  return { workflowResultId, loading, error }
}

interface ISharedResultProps {
  shared_token: string
}

const SharedResult: React.FunctionComponent<ISharedResultProps> = ({ shared_token }) => {
  const { workflowResultId, loading, error } = useGetWorkflowResultIdByToken(shared_token)

  if (loading || error || !workflowResultId) {
    return <p className="h-full w-full p-4 text-center">Loading...</p>
  }

  return <ResultDetails id={workflowResultId!} />
}

export default SharedResult
