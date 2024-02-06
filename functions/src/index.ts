/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onCall({}, req => {
  logger.info('Hello logs!', { structuredData: true })

  return {
    message: 'Hello from Firebase!',
    queryLength: req.data.query?.length || 0,
  }

  // Call flairchain API
  // {
  //   /** Document Id */
  //   workflowRequestId: string

  //   executorUserId: string
  //   workflowId: string

  //   status: 'requested' | 'initiated' | 'completed'

  //   requestTimestamp: Timestamp

  //   frontendConfig: string
  //   generatedConfig: string
  // }
})
