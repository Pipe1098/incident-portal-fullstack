const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb")

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const TABLE_NAME = process.env.TABLE_NAME

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type,X-Api-Key,Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH,DELETE",
}

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters

    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      }),
    )

    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Ticket not found" }),
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item),
    }
  } catch (error) {
    console.error("Error getting ticket:", error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    }
  }
}
