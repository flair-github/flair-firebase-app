import { MutableRefObject } from 'react'
import { Edge, type Node } from 'reactflow'
import { AwsUploaderNodeContent } from './AwsUploaderNode'
import { DataExporterFlairNodeContent } from './DataExporterFlair'
import { DataExtractorNodeContent } from './DataExtractorNode'
import { DataIndexerNodeContent } from './DataIndexer'
import { DataRetrieverNodeContent } from './DataRetriever'
import { DataSourceLocalFilesNodeContent } from './DataSourceLocalFiles'
import { DataSourceNodeContent } from './DataSourceNode'
import { EvaluatorNodeContent } from './EvaluatorNode'
import { LLMProcessorNodeContent } from './LLMProcessorNode'
import { atom } from 'jotai'
import { DataSourceS3NodeContent } from './DataSourceS3'
import { DataSourceGCPNodeContent } from './DataSourceGCP'
import { DataSourceAzureNodeContent } from './DataSourceAzure'

export type NodeContent =
  | { nodeType: 'init' }
  | DataSourceNodeContent
  | DataSourceS3NodeContent
  | DataSourceGCPNodeContent
  | DataSourceAzureNodeContent
  | DataExtractorNodeContent
  | AwsUploaderNodeContent
  | EvaluatorNodeContent
  | LLMProcessorNodeContent
  | DataIndexerNodeContent
  | DataRetrieverNodeContent
  | DataSourceLocalFilesNodeContent
  | DataExporterFlairNodeContent

export interface NodeData {
  nodeId: string
  initialContents: NodeContent
}

export type Nodes = Array<Node<NodeData>>
export type Edges = Edge[]

export const nodeContents: MutableRefObject<{ [nodeId: string]: NodeContent }> = {
  current: {},
}

export const jotaiAllowInteraction = atom(true)
