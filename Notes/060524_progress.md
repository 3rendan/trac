# Paul says to focus on other priorities

## Where it's at

* serveless lambda function is working to take a post to '/payments', post it to Square, and recieve a return id along with other info
  * the id can probably be passed in the form to record the payment

## What is needed?

1. the front end needs to POST info to the API Gateway endpoint
   1. amount
   2. source id
   3. idempotencyKey
2. a successful response on payment should trigger the form to submit with the id to record the payment
   1. the form submission needs to include the payment id/ token