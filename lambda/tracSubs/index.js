const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? JSON.parse(process.env.ALLOWED_ORIGINS) : [];

exports.handler = async (event) => {
  let { headers: { origin } } = event;
  let corsHeaders = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
    const requestBody = JSON.parse(event.body);

    // Concatenating programId, email, and startDate to form the primary key
    const primaryKey = `${requestBody.programId}-${requestBody.email}-${requestBody.startDate}`;

    const params = {
        TableName: 'trac-subs',
        Item: {
            id: primaryKey,
            programId: requestBody.programId,
            name: requestBody.name,
            company: requestBody.company,
            title: requestBody.title,
            phone: requestBody.phone,
            email: requestBody.email,
            subscriptionDuration: requestBody.subscriptionDuration,
            startDate: requestBody.startDate,  // Now using startDate instead of subscriptionBeginDate
            paymentToken: requestBody.paymentToken
        }
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Data inserted successfully" })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Failed to insert data", error: error.message })
        };
    }
};
