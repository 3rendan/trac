const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); // Import the UUID function
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    try {
        // Parse the incoming data
        const requestJSON = JSON.parse(event.body);

        // Generate a unique ID and add it to the item
        const itemId = uuidv4();
        const item = {
            ...requestJSON,
            id: itemId // Assuming the ID field in DynamoDB is 'id'
        };

        // DynamoDB put operation
        await dynamoDB.put({
            TableName: "trac-subs",
            Item: item
        }).promise();

        body = `Data written to DynamoDB with ID ${itemId}: ${JSON.stringify(item)}`;
    } catch (error) {
        statusCode = 400;
        body = error.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};
