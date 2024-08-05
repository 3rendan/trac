# Where it's at

* payments can be created and processed from the FE
  * note is input in payment with program title, duration, name and start date
* **What needs to happen now**
  * successful payment triggers a write to DynamoDB
    * formData about the request
      * program.id, name, company, position, phone, email, duration, and start date
    * data about the payment
      * id, order_id, receipt_url, note, amount
      * this all comes from the return for payment *make sure to get from  the lambda fxnction return*