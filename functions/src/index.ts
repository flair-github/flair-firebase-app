/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { HttpsError, onCall } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: '', // This is the default and can be omitted
})

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onCall({}, async req => {
  logger.info('Hello logs!', { structuredData: true })

  // Ensure the request is made from an authenticated user
  if (!req.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.')
  }

  try {
    const stream = await openai.beta.chat.completions.stream({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Say this is a test' }],
      stream: true,
    })

    stream.on('content', (delta, snapshot) => {
      process.stdout.write(delta)
    })

    // or, equivalently:
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '')
    }

    const chatCompletion = await stream.finalChatCompletion()
    console.log(chatCompletion)

    return chatCompletion
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    throw new HttpsError('internal', 'Error calling OpenAI API')
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
