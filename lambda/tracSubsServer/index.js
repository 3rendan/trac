const { Client, Environment } = require('square');

exports.handler = async (event) => {
  const client = new Client({
    accessToken: process.env.SQUARE_SANDBOX_ACCESS_TOKEN,
    environment: Environment.Sandbox // Change to Production as needed
  });

  const paymentsApi = client.paymentsApi;

  try {
    const body = JSON.parse(event.body);
    const response = await paymentsApi.createPayment({
      sourceId: body.sourceId,
      idempotencyKey: body.idempotencyKey,
      amountMoney: {
        amount: body.amount,
        currency: 'USD'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.result, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value  // Convert BigInt to String
      ),
    };
  } catch (error) {
    console.error('Failed to make payment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value  // Convert BigInt to String
      ),
    };
  }
};
