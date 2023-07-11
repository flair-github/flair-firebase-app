import { MutableRefObject } from 'react'
import { AwsUploaderNode, AwsUploaderNodeContent } from './AwsUploaderNode'
import { DataExtractorNode, DataExtractorNodeContent } from './DataExtractorNode'
import { DataSourceNode, DataSourceNodeContent } from './DataSourceNode'
import { EvaluatorNode, EvaluatorNodeContent } from './EvaluatorNode'
import { LLMProcessorNode, LLMProcessorNodeContent } from './LLMProcessorNode'
import { Edge, type Node } from 'reactflow'
import { DataIndexerNode, DataIndexerNodeContent } from './DataIndexer'
import { DataRetrieverNode, DataRetrieverNodeContent } from './DataRetriever'

export const nodeTypes = {
  DataSourceNode,
  DataExtractorNode,
  AwsUploaderNode,
  EvaluatorNode,
  LLMProcessorNode,
  DataIndexerNode,
  DataRetrieverNode,
}

export type NodeContent =
  | { nodeType: 'init' }
  | DataSourceNodeContent
  | DataExtractorNodeContent
  | AwsUploaderNodeContent
  | EvaluatorNodeContent
  | LLMProcessorNodeContent
  | DataIndexerNodeContent
  | DataRetrieverNodeContent

export interface NodeData {
  nodeId: string
  initialContents: NodeContent
}

export type Nodes = Array<Node<NodeData>>
export type Edges = Edge[]

export const nodeContents: MutableRefObject<{ [nodeId: string]: NodeContent }> = {
  current: {},
}
