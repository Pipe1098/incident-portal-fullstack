const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb")

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const TABLE_NAME = process.env.TABLE_NAME

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type,X-Api-Key,Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH,DELETE",
}

const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]
const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters
    const body = JSON.parse(event.body)

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

    // Validate status if provided
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        }),
      }
    }

    // Validate priority if provided
    if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(", ")}`,
        }),
      }
    }

    // Build update expression dynamically
    const updateExpressions = ["#updatedAt = :updatedAt"]
    const expressionAttributeNames = { "#updatedAt": "updatedAt" }
    const expressionAttributeValues = { ":updatedAt": new Date().toISOString() }

    if (body.status) {
      updateExpressions.push("#status = :status")
      expressionAttributeNames["#status"] = "status"
      expressionAttributeValues[":status"] = body.status
    }

    if (body.priority) {
      updateExpressions.push("#priority = :priority")
      expressionAttributeNames["#priority"] = "priority"
      expressionAttributeValues[":priority"] = body.priority
    }

    if (body.assignedTo !== undefined) {
      updateExpressions.push("#assignedTo = :assignedTo")
      expressionAttributeNames["#assignedTo"] = "assignedTo"
      expressionAttributeValues[":assignedTo"] = body.assignedTo || null
    }

    if (body.description) {
      updateExpressions.push("#description = :description")
      expressionAttributeNames["#description"] = "description"
      expressionAttributeValues[":description"] = body.description
    }

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      }),
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Attributes),
    }
  } catch (error) {
    console.error("Error updating ticket:", error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    }
  }
}
