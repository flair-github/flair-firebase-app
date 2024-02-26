/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as logger from 'firebase-functions/logger'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { chat } from './modules/chat'
import { dataSourceS3 } from './modules/dataSourceS3'
import { llmProcessorOpenAI } from 'modules/llmProcessorOpenAI'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onCall(
  {
    region: 'us-central1',
  },
  async req => {
    logger.info('Hello logs!', { structuredData: true })

    // Ensure the request is made from an authenticated user
    if (!req.auth) {
      throw new HttpsError('unauthenticated', 'The function must be called while authenticated.')
    }

    if (typeof req.data.content !== 'string') {
      throw new HttpsError('invalid-argument', 'No query.')
    }

    const res = await chat(req.data.content)

    return res
  },
)

export const awsLlmSheetsDemo = onCall(
  {
    region: 'us-central1',
  },
  async req => {
    logger.info('Hello logs!', { structuredData: true })

    // Ensure the request is made from an authenticated user
    if (!req.auth) {
      throw new HttpsError('unauthenticated', 'The function must be called while authenticated.')
    }

    if (typeof req.data.content !== 'string') {
      throw new HttpsError('invalid-argument', 'No query.')
    }

    const frontendConfig = JSON.parse(req.data.frontendConfig)

    let llmConfig: any
    for (const node of frontendConfig.nodes) {
      if (node.type === 'LLMProcessorHop') {
        llmConfig = node.data
      }
    }

    const step1 = dataSourceS3()
    const step2 = await llmProcessorOpenAI(step1, llmConfig)

    return step2
  },
)
