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
// import firebase from 'firebase-admin'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onCall(context => {
  logger.info('Hello logs!', { structuredData: true })

  if (context.auth) {
    return
  }

  // Billings
  // usage
  // analytics

  // Call API
  // [uid]

  // // User ID
  // context.auth?.uid

  // // Payload
  // context.data

  // const db = firebase.firestore()

  // db.collection('').doc(context.auth?.uid)

  return {
    uid: context.auth?.uid,
    name: context.data.name,
    age: 12,
  }

  // response.send('Hello from Firebase!')

  // request.

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
