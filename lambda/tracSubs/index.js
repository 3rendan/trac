const AWS = require('aws-sdk');
const axios = require('axios')
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? JSON.parse(process.env.ALLOWED_ORIGINS) : [];

exports.handler = async (event) => {
  const { headers: { origin }, path } = event;
  const paymentRequest = event.body
  const { paidRequest } = JSON.parse(event.body)
  console.info(path)
    let corsHeaders = {
        'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (path.includes('/create')) {
        return handleCreateRequest(paidRequest, corsHeaders);
    } else if (path.includes('/payments')) {
        console.info(JSON.parse(event.body), corsHeaders)
        return handlePaymentRequest(paymentRequest, corsHeaders);
    } else {
        return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Endpoint not found" })
        };
    }
};

const handleCreateRequest = async(event, corsHeaders) =>{
const requestBody = JSON.parse(event.body);
const primaryKey = `${requestBody.programId}-${requestBody.email}-${requestBody.startDate}`;
const params = {
    TableName: 'trac-subs',
    Item: {
        id: primaryKey,
        ...requestBody
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
}

const handlePaymentRequest = async(data, corsHeaders) => {
    try {
        const response = await axios.post('https://connect.squareupsandbox.com/v2/payments', data, {
            headers: {
                'Authorization': `Bearer ${process.env.SANDBOX_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        return {
            statusCode: error.response ? error.response.status : 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Failed to process payment", error: error.message })
        };
    }
}
