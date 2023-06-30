export const FLOW_SAMPLE_2 = `
{
  "nodes": [
    {
      "id": "evaluator-1686634553146",
      "type": "EvaluatorNode",
      "data": {
        "nodeId": "evaluator-1686634553146",
        "initialContents": {
          "strategy": "rmse"
        }
      },
      "position": {
        "x": 1039.8001389451329,
        "y": 164.80000385958704
      },
      "width": 400,
      "height": 252,
      "selected": false,
      "positionAbsolute": {
        "x": 1039.8001389451329,
        "y": 164.80000385958704
      },
      "dragging": false
    },
    {
      "id": "data-extractor-1686634553855",
      "type": "DataExtractorNode",
      "data": {
        "nodeId": "data-extractor-1686634553855",
        "initialContents": {
          "keyPromptPairs": {
            "Intents": "What was the customer's main intention or goal during the conversation?",
            "Frustations": "What are some customer frustrations found within the conversation?",
            "Sentiment": "Based on the tone and content of the conversation, what was the overall sentiment expressed by the customer?",
            "Summaries": "Can you provide a brief summary of the key points and resolutions from the conversation?",
            "Score (1-5)": "Based on the customer's satisfaction and the effectiveness of the interaction, how would you rate this conversation on a scale from 1 to 5, where 1 is unsatisfactory and 5 is excellent?"
          }
        }
      },
      "position": {
        "x": 68.03385966000883,
        "y": -199.93998601800106
      },
      "width": 800,
      "height": 486,
      "selected": false,
      "positionAbsolute": {
        "x": 68.03385966000883,
        "y": -199.93998601800106
      },
      "dragging": false
    },
    {
      "id": "data-source-1686634560481",
      "type": "DataSourceNode",
      "data": {
        "nodeId": "data-source-1686634560481",
        "initialContents": {
          "source": "aws",
          "dataType": "mp3",
          "apiKey": "wxyz",
          "path": "/data/truth"
        }
      },
      "position": {
        "x": 462.5010595093245,
        "y": 347.46727350740326
      },
      "width": 400,
      "height": 386,
      "selected": false,
      "positionAbsolute": {
        "x": 462.5010595093245,
        "y": 347.46727350740326
      },
      "dragging": false
    },
    {
      "id": "data-source-1686634584985",
      "type": "DataSourceNode",
      "data": {
        "nodeId": "data-source-1686634584985",
        "initialContents": {
          "source": "aws",
          "dataType": "mp3",
          "apiKey": "xyz",
          "path": "/data/source"
        }
      },
      "position": {
        "x": -482.731803935862,
        "y": 13.460064156630281
      },
      "width": 400,
      "height": 386,
      "selected": false,
      "positionAbsolute": {
        "x": -482.731803935862,
        "y": 13.460064156630281
      },
      "dragging": false
    },
    {
      "id": "aws-uploader-1686634614620",
      "type": "AwsUploaderNode",
      "data": {
        "nodeId": "aws-uploader-1686634614620",
        "initialContents": {
          "path": "/data/result",
          "period": "daily",
          "apiKey": "abcd"
        }
      },
      "position": {
        "x": 1034.4344483321534,
        "y": -377.79998456165185
      },
      "width": 400,
      "height": 308,
      "selected": false,
      "positionAbsolute": {
        "x": 1034.4344483321534,
        "y": -377.79998456165185
      },
      "dragging": false
    },
    {
      "id": "aws-uploader-1686634628985",
      "type": "AwsUploaderNode",
      "data": {
        "nodeId": "aws-uploader-1686634628985",
        "initialContents": {
          "path": "/data/evaluator-result",
          "period": "daily",
          "apiKey": "abcd"
        }
      },
      "position": {
        "x": 1597.8344599109146,
        "y": 89.5998070206488
      },
      "width": 400,
      "height": 308,
      "selected": false,
      "positionAbsolute": {
        "x": 1597.8344599109146,
        "y": 89.5998070206488
      },
      "dragging": false
    }
  ],
  "edges": [
    {
      "source": "data-extractor-1686634553855",
      "sourceHandle": "out",
      "target": "evaluator-1686634553146",
      "targetHandle": "in-ai-data",
      "id": "reactflow__edge-data-extractor-1686634553855out-evaluator-1686634553146in-ai-data"
    },
    {
      "source": "data-source-1686634560481",
      "sourceHandle": "out",
      "target": "evaluator-1686634553146",
      "targetHandle": "in-truth-data",
      "id": "reactflow__edge-data-source-1686634560481out-evaluator-1686634553146in-truth-data"
    },
    {
      "source": "data-source-1686634584985",
      "sourceHandle": "out",
      "target": "data-extractor-1686634553855",
      "targetHandle": "in",
      "id": "reactflow__edge-data-source-1686634584985out-data-extractor-1686634553855in"
    },
    {
      "source": "data-extractor-1686634553855",
      "sourceHandle": "out",
      "target": "aws-uploader-1686634614620",
      "targetHandle": "in",
      "id": "reactflow__edge-data-extractor-1686634553855out-aws-uploader-1686634614620in"
    },
    {
      "source": "evaluator-1686634553146",
      "sourceHandle": "out",
      "target": "aws-uploader-1686634628985",
      "targetHandle": "in",
      "id": "reactflow__edge-evaluator-1686634553146out-aws-uploader-1686634628985in"
    }
  ]
}
`
