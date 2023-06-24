import { Timestamp } from 'firebase/firestore'

interface FSCollections {
  [collectionName: string]: {
    [documentId: string]: {
      document: any
      collections: FSCollections
    }
  }
}

export interface FirestoreStruct extends FSCollections {
  user_data: {
    [userId: string]: {
      document: DocUserData
      collections: {}
    }
  }
  flow_data: {
    [flowDataId: string]: {
      document: DocFlowData
      collections: {}
    }
  }
  flow_exec_requests: {
    [flowExecRequestId: string]: {
      document: DocFlowData
      collections: {}
    }
  }
  flow_exec_results: {
    [flowExecRequestId: string]: {
      document: DocFlowExecResult
      collections: {}
    }
  }
}

export interface DocRoot {
  docExists: boolean
  createdTimestamp: Timestamp
  updatedTimestamp: Timestamp
}

export interface DocUserData extends DocRoot {
  /** Document Id */
  userId: string

  userName: string
  userPhotoUrl: string
}

export interface DocFlowData extends DocRoot {
  /** Document Id */
  flowDataId: string

  ownerUserId: string
  flowDataJson: string
}

export interface DocFlowExecRequest extends DocRoot {
  /** Document Id */
  flowExecRequestId: Timestamp

  executorUserId: string
  flowDataId: string

  requestTimestamp: Timestamp
  flowDataJson: string
}

export interface DocFlowExecResult extends DocRoot {
  /** Document Id */
  flowExecResultId: string

  flowExecRequestId: string
  executorUserId: string

  resultTimestamp: Timestamp
  resultStatus: string
  resultData: any
}
