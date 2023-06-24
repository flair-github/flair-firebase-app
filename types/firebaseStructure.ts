interface FSCollections {
  [collectionName: string]: {
    [documentId: string]: {
      /** Documentの構造 */
      document: any;
      /** そのDocument内のSubcollectionのリスト */
      collections: FSCollections;
    };
  };
}

/**
 * Firebase Realtime Database構造
 */
export interface FirestoreStruct extends FSCollections {
  user_data: {
    [userId: string]: {
      document: {
        userId: string;
        userName: string
      };
      collections: {};
    };
  };
  flow_data: {
    [flowDataId: string] : {
      document: {
        ownerUserId: string;
        flowJson: string;
      };
      collections: {};
    }
  };
  flow_execution_requests: {
    [flowExecutionRequestId: string] : {
      document: {
        date: number;
        executorUserId: string;
        flowDataId: string;
        flowJson: string;
      };
      collections: {};
    }
  };
  flow_execution_results: {
    [flowExecutionRequestId: string] : {
      document: {
        date: number;
        flowExecutionRequestId: string;
        executorUserId: string;
        flowDataId: string;
        /** history */
        flowJson: string;

        resultData: string;
      };
      collections: {};
    }
  };
}