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

export const REAL_ESTATE_PIPELINE = `{
  "nodes": [
    {
      "id": "data-source-s3-hop-3fa15137-8a76-4857-b638-75e17c300e1a",
      "type": "DataSourceS3Hop",
      "data": {
        "nodeId": "data-source-s3-hop-3fa15137-8a76-4857-b638-75e17c300e1a",
        "initialContents": {
          "nodeType": "data-source-s3-hop",
          "eventType": "New CSV file",
          "importedKeys": {},
          "fileType": "mp3",
          "bucket": "call-recordings",
          "path": "path/to/data"
        }
      },
      "position": {
        "x": 222.83934731806295,
        "y": 243.71285058097112
      },
      "width": 400,
      "height": 78,
      "selected": false,
      "positionAbsolute": {
        "x": 222.83934731806295,
        "y": 243.71285058097112
      },
      "dragging": false
    },
    {
      "id": "llm-processor-hop-4ee9baca-bc49-4a5d-81cb-cc7432526803",
      "type": "LLMProcessorHop",
      "data": {
        "nodeId": "llm-processor-hop-4ee9baca-bc49-4a5d-81cb-cc7432526803",
        "initialContents": {
          "nodeType": "llm-processor-hop",
          "columns": [
            {
              "columnId": "2dba9a2d-b769-4ea0-8d73-dd8241e4bb39",
              "type": "text",
              "promptStrategy": "Chain-of-Thought",
              "model": "gpt-4",
              "instruction": "You are a seasoned real estate call center manager reviewing calls with prospects. Analyze the provided call transcript and identify the following key attributes:",
              "name": "motivation",
              "prompt": "What reasons are the prospect looking to buy or sell a home? Identify intents and motivations around home search mentioned by the prospect. (e.g., moving for work, retiring, down-sizing, looking for land)",
              "context": "",
              "importedKeys": {}
            },
            {
              "columnId": "4ef130ab-2847-496b-9cd7-9e723eadc0f1",
              "type": "text",
              "promptStrategy": "default",
              "model": "gpt-4",
              "instruction": "",
              "name": "summary",
              "prompt": "Provide a summary of the conversation, including primary intent of the prospect, home search details or information mentioned and any follow-ups.",
              "context": "",
              "importedKeys": {}
            },
            {
              "columnId": "39aa2be7-2ca3-46c4-8917-caf88db74b42",
              "type": "category",
              "promptStrategy": "default",
              "model": "gpt-4",
              "instruction": "You are a call center manager reviewing call recordings for disposition. You're goal is to identify whether the call was a pick up or voicemail with high accuracy given a possibly malformatted transcripts with misspellings and typos. ",
              "name": "outcome",
              "prompt": "Was the call picked up by the prospect or did the agent leave a voicemail? For example, if the call contains 'please leave your message for' or similar automated message, the call is a voicemail. (Answer Pick-up or Voicemail)",
              "context": "",
              "importedKeys": {},
              "options": "Pick-up, Voicemail"
            },
            {
              "columnId": "8782970f-352a-4a67-97c4-b5fc899323ba",
              "type": "text",
              "promptStrategy": "Chain-of-Thought",
              "model": "gpt-4",
              "instruction": "",
              "name": "sentiment",
              "prompt": "Analyze the emotions displayed by the prospect throughout the conversation. What is the prospect's overall emotion? For example, if the prospect mentioned they are eager to move into a new home the sentiment may be 'Enthusiastic'.",
              "context": "",
              "importedKeys": {}
            },
            {
              "columnId": "93700229-ef47-4a78-b49b-b72bb0ad4485",
              "type": "text",
              "promptStrategy": "Chain-of-Thought",
              "model": "gpt-3.5-turbo",
              "instruction": "",
              "name": "location",
              "prompt": "List the locations where the prospect is interested in buying or selling, if mentioned. Be sure to include specific addresses (e.g. 6831 Glen Lane). Let's think step by step. (Provide a comma-separated list)",
              "context": "",
              "importedKeys": {}
            },
            {
              "columnId": "ae14542e-85e5-4b6d-a017-8a1ea7732727",
              "type": "number",
              "promptStrategy": "Chain-of-Thought",
              "model": "gpt-4",
              "instruction": "",
              "name": "bed_count",
              "prompt": "What is the number of bedrooms the prospect is interested in, or 'NA' if not specified? Let's think step by step. (Provide a single number)",
              "context": "",
              "importedKeys": {},
              "min": 0,
              "max": 10
            },
            {
              "columnId": "c16353ce-c2a4-404c-8821-0e6e68df430f",
              "type": "number",
              "promptStrategy": "Chain-of-Thought",
              "model": "gpt-3.5-turbo",
              "instruction": "",
              "name": "bath_count",
              "prompt": "What is the number of baths the prospect is interested in, or 'NA' if not specified? Let's think step by step. (Provide a single number)",
              "context": "",
              "importedKeys": {},
              "min": 0,
              "max": 10
            },
            {
              "columnId": "7767e666-534e-4b76-b91a-529cb34e9467",
              "type": "category",
              "promptStrategy": "Chain-of-Thought",
              "model": "gpt-4",
              "instruction": "",
              "name": "property_type",
              "prompt": "What type of property is the prospect looking for? Let's think step by step. (Answer with a single word - e.g. single, family, apartment, condo, town, mobile, land, lot)",
              "context": "",
              "importedKeys": {},
              "options": "single, family, apartment, condo, town, mobile, land, lot"
            },
            {
              "columnId": "ad3efcc0-dbe6-4107-bdca-1681b1e0067c",
              "type": "list",
              "promptStrategy": "Chain-of-Thought",
              "model": "gpt-4",
              "instruction": "",
              "name": "follow_ups",
              "prompt": "Identify follow-up actions the agent should take after the call, including any dates mentioned. If the call is a voicemail, do not include any follow-ups.",
              "context": "",
              "importedKeys": {}
            }
          ],
          "exportedKeys": {}
        }
      },
      "position": {
        "x": 278.2192894426406,
        "y": 446.32886799439063
      },
      "width": 400,
      "height": 102,
      "selected": true,
      "positionAbsolute": {
        "x": 278.2192894426406,
        "y": 446.32886799439063
      },
      "dragging": false
    },
    {
      "id": "data-destination-gmail-hop-00f1d38c-c0fd-4d81-bfd7-2167dd47679d",
      "type": "DataDestinationGmailHop",
      "data": {
        "nodeId": "data-destination-gmail-hop-00f1d38c-c0fd-4d81-bfd7-2167dd47679d",
        "initialContents": {
          "nodeType": "data-destination-gmail-hop",
          "to": "",
          "subject": "Your mortgage offer",
          "prompt": "You are a chief marketing officer for a real estate agency with a goal of upselling potential clients interested in buying a home on mortgage opportunities. "
        }
      },
      "position": {
        "x": 432.25952536376053,
        "y": 913.4664978230054
      },
      "width": 800,
      "height": 78,
      "selected": false,
      "positionAbsolute": {
        "x": 432.25952536376053,
        "y": 913.4664978230054
      },
      "dragging": false
    },
    {
      "id": "data-destination-sheets-hop-25e57220-4126-4307-99ac-f309aedff374",
      "type": "DataDestinationSheetsHop",
      "data": {
        "nodeId": "data-destination-sheets-hop-25e57220-4126-4307-99ac-f309aedff374",
        "initialContents": {
          "nodeType": "data-destination-sheets-hop",
          "path": "",
          "columnMapping": "Auto-map"
        }
      },
      "position": {
        "x": 64.19434291283454,
        "y": 686.8238491843515
      },
      "width": 400,
      "height": 78,
      "selected": false,
      "positionAbsolute": {
        "x": 64.19434291283454,
        "y": 686.8238491843515
      },
      "dragging": false
    },
    {
      "id": "conditional-hop-c271dd17-0038-4bb2-a500-05d99cffae86",
      "type": "ConditionalHop",
      "data": {
        "nodeId": "conditional-hop-c271dd17-0038-4bb2-a500-05d99cffae86",
        "initialContents": {
          "nodeType": "conditional-hop",
          "conditions": []
        }
      },
      "position": {
        "x": 597.0229188153844,
        "y": 671.9770811846156
      },
      "width": 400,
      "height": 102,
      "selected": false,
      "positionAbsolute": {
        "x": 597.0229188153844,
        "y": 671.9770811846156
      },
      "dragging": false
    }
  ],
  "edges": [
    {
      "source": "data-source-s3-hop-3fa15137-8a76-4857-b638-75e17c300e1a",
      "sourceHandle": "out",
      "target": "llm-processor-hop-4ee9baca-bc49-4a5d-81cb-cc7432526803",
      "targetHandle": "in",
      "id": "reactflow__edge-data-source-s3-hop-3fa15137-8a76-4857-b638-75e17c300e1aout-llm-processor-hop-4ee9baca-bc49-4a5d-81cb-cc7432526803in",
      "selected": false
    },
    {
      "source": "llm-processor-hop-4ee9baca-bc49-4a5d-81cb-cc7432526803",
      "sourceHandle": "out",
      "target": "data-destination-sheets-hop-25e57220-4126-4307-99ac-f309aedff374",
      "targetHandle": "in",
      "id": "reactflow__edge-llm-processor-hop-4ee9baca-bc49-4a5d-81cb-cc7432526803out-data-destination-sheets-hop-25e57220-4126-4307-99ac-f309aedff374in",
      "selected": false
    },
    {
      "source": "llm-processor-hop-4ee9baca-bc49-4a5d-81cb-cc7432526803",
      "sourceHandle": "out",
      "target": "conditional-hop-c271dd17-0038-4bb2-a500-05d99cffae86",
      "targetHandle": "in",
      "id": "reactflow__edge-llm-processor-hop-4ee9baca-bc49-4a5d-81cb-cc7432526803out-conditional-hop-c271dd17-0038-4bb2-a500-05d99cffae86in"
    },
    {
      "source": "conditional-hop-c271dd17-0038-4bb2-a500-05d99cffae86",
      "sourceHandle": "out-true",
      "target": "data-destination-gmail-hop-00f1d38c-c0fd-4d81-bfd7-2167dd47679d",
      "targetHandle": "in",
      "id": "reactflow__edge-conditional-hop-c271dd17-0038-4bb2-a500-05d99cffae86out-true-data-destination-gmail-hop-00f1d38c-c0fd-4d81-bfd7-2167dd47679din"
    }
  ]
}`
