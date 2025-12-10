const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb")

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

    // Check if ticket exists
    const existing = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      }),
    )

    if (!existing.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Ticket not found" }),
      }
    }

    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
      }),
    )

    return {
      statusCode: 204,
      headers,
      body: "",
    }
  } catch (error) {
    console.error("Error deleting ticket:", error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    }
  }
}
