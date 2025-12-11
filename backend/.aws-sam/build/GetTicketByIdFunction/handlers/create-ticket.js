const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb")
const { v4: uuidv4 } = require("uuid")

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
    const body = JSON.parse(event.body)

    // Validation
    if (!body.title || !body.description || !body.createdBy) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing required fields: title, description, createdBy",
        }),
      }
    }

    const now = new Date().toISOString()
    const ticket = {
      id: uuidv4(),
      title: body.title,
      description: body.description,
      status: "OPEN",
      priority: body.priority || "MEDIUM",
      createdAt: now,
      updatedAt: now,
      createdBy: body.createdBy,
      assignedTo: body.assignedTo || null,
    }

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: ticket,
      }),
    )

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(ticket),
    }
  } catch (error) {
    console.error("Error creating ticket:", error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    }
  }
}

