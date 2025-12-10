const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, ScanCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb")

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
    const status = event.queryStringParameters?.status
    let result

    if (status) {
      // Query by status using GSI
      result = await docClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: "StatusIndex",
          KeyConditionExpression: "#status = :status",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":status": status,
          },
          ScanIndexForward: false, // Sort by createdAt descending
        }),
      )
    } else {
      // Scan all tickets
      result = await docClient.send(
        new ScanCommand({
          TableName: TABLE_NAME,
        }),
      )
      // Sort by createdAt descending
      result.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items),
    }
  } catch (error) {
    console.error("Error getting tickets:", error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    }
  }
}
