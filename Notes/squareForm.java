import lotus.domino.*;

//import okio.*;
//import okhttp3.*;
//import com.squareup.square.*;
import com.squareup.square.Environment;
import com.squareup.square.SquareClient;
//import com.squareup.square.api.*;
import com.squareup.square.http.client.HttpCallback;
//import com.squareup.square.http.client.HttpClient;
//import com.squareup.square.http.client.OkClient;
import com.squareup.square.http.Headers;
//import io.apimatic.core.types.CoreApiException;
//import io.apimatic.core.types.*;
//import io.apimatic.coreinterfaces.http.*;
//import io.apimatic.okhttpclient.adapter.*;
//import io.apimatic.okhttpclient.adapter.OkClient;
import com.squareup.square.api.PaymentsApi;
//import com.squareup.square.exceptions.*;
import com.squareup.square.exceptions.ApiException;
//import com.squareup.square.http.client.HttpContext;
import com.squareup.square.models.*;

import org.json.*;

//import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;


//import java.net.URL;
//import java.net.HttpURLConnection;
//import javax.net.ssl.*;
//import javax.net.ssl.HttpsURLConnection;

public class JavaAgent extends AgentBase {
	// Environment variable for a Square Personal Access Token
	// TRAC-SUBS SANDBOX:
	private static final String SQUARE_ACCESS_TOKEN_SANDBOX = "EAAAEPo98hU3Eo7nv9Lh1J9L9FrvWz79jii4gmm5ciZw3f1noIFxMuxdjpGuwjDD";
	// TRAC-SUBS PRODUCTION:
	private static final String SQUARE_ACCESS_TOKEN_PRODUCTION = "EAAAEHL5sKy49GTsjYeoKmfH04kRM51ysR1ovXchWJvK_DYMjzRZaw03YIDqBbJ_";
	
	// =======================================================================================
	// Environment variable for a Square APPLICATION ID
	// TRAC-SUBS SANDBOX:
	private static final String SQUARE_APP_ID_SANDBOX = "sandbox-sq0idb-1Rc6WQaS0GHD8JmvpmaVOg";
	// TRAC-SUBS PRODUCTION:
	private static final String SQUARE_APP_ID_PRODUCTION = "sq0idp-JrWvj_FPn_RjQaxXok13lQ";
	
	// =======================================================================================
	// Environment variable for a Square LOCATION ID
	// Default Test Account (Main) SANDBOX:			The value here corresponds with 1600 Pennsylvania Avenue NW (the White House)
	private static final String SQUARE_LOCATION_ID_SANDBOX = "XK6VJKAS5R1ZM";
	// American Public Television (Main) PRODUCTION:		The value here corresponds with "American Public Television"
	private static final String SQUARE_LOCATION_ID_PRODUCTION = "A5QYEZBZGK4AM";

	public void NotesMain() {
				
		try {
			Session session = getSession();
			AgentContext agentContext = session.getAgentContext();
			Document doc = agentContext.getDocumentContext();
			
			// Fetch parameters
			// First, the nonce, which will look like --> cnon:CBASE[a-zA-Z0-9_-]{22,22}
			// NOTE:  This is NOT Base64, which uses "+" and "/" instead of "_" and "-"
			Vector v6 = session.evaluate("Request_Content", doc);
			String rawJson = v6.firstElement().toString();
//			System.out.println("chargeSquareFM:: JSON is " + rawJson);
			JSONObject json;
			String nonce;
			Long amt;
			
			long timeout = 60;
			Headers additionalHeaders = new Headers();
//			Map<String, AuthManager> authManagers = null;
			HttpCallback httpCallback = null;
			
			json = new JSONObject( rawJson );
			nonce = json.getString("nonce");
			
			/* INFO:  RIGHT HERE WE HAVE A PROBLEM CASTING amount TO THE CORRECT TYPE; THIS CAUSES A MAJOR SCREW UP IN THE ACTUAL HANDLING OF PAYMENT */			
			amt = (long) json.getLong("amount");
//			amt=(long) 100;
			
			String db = json.getString("db");
			String domain = json.getString("domain");
			String memo = json.getString("memo");
			String context = json.getString("where");
			
//			System.out.println("POSTed nonce: " + nonce);
//			System.out.println("POSTed amount: " + amt.toString());
//			System.out.println("POSTed db: " + db);
//			System.out.println("POSTed domain: " + domain);
//			System.out.println("POSTed where: " + context);
			
			Environment squareEnvironment;
			String squareAppId;
			String squareLocationId;
			SquareClient squareClient;
			
			if (context.equalsIgnoreCase("sandbox")) {
				squareEnvironment = Environment.fromString( SQUARE_APP_ID_SANDBOX );
				squareAppId = SQUARE_APP_ID_SANDBOX;
				squareLocationId = SQUARE_LOCATION_ID_SANDBOX;
				
				squareClient = new SquareClient.Builder()
					.environment(Environment.SANDBOX)
					.accessToken(SQUARE_ACCESS_TOKEN_SANDBOX)
					.build();
//				System.out.println("BECAUSE where == SANDBOX WE'RE TALKING TO THE SANDBOX SQUARE ENVIRONMENT");
			} else {
				squareEnvironment = Environment.fromString( SQUARE_APP_ID_PRODUCTION );
				squareAppId = SQUARE_APP_ID_PRODUCTION;
				squareLocationId = SQUARE_LOCATION_ID_PRODUCTION;
				
				squareClient = new SquareClient.Builder()
						.environment(Environment.PRODUCTION)
						.accessToken(SQUARE_ACCESS_TOKEN_PRODUCTION)
						.build();
//				System.out.println("BECAUSE where <> SANDBOX WE'RE TALKING TO THE PRODUCTION SQUARE ENVIRONMENT");
			}
			
//			System.out.println("SquareClient built; next we'll fetch the Right Information...");
			
			// Convert amt parameter into a Money object
			Money money = new Money.Builder()
				.amount(amt)
				.currency("USD")
				.build();
//			System.out.println("Money got built");
			
			String idempotencyKey=UUID.randomUUID().toString();
//			System.out.println("Random key is: "+idempotencyKey);
			
			// 
			CreatePaymentRequest createPaymentRequest = new CreatePaymentRequest.Builder(
					nonce, 
					idempotencyKey)
				.amountMoney(money)
				.autocomplete(true)
				.note(memo)
			//	.locationId(squareLocationId )
				.build();
//			System.out.println("PaymentRequest got built");
			
//			System.out.println("Location id: "+createPaymentRequest.getLocationId());
			
			PaymentsApi paymentsApi = squareClient.getPaymentsApi();
//			System.out.println("PaymentsAPI has been instantiated");
			
			PrintWriter pw = getAgentOutput();

			try {
				
				CreatePaymentResponse response;
				try {
					response = paymentsApi.createPayment(createPaymentRequest);
//					System.out.println("PaymentResponse has been created");
					String paymentStatus = response.getPayment().getStatus();
					
//					System.out.println(paymentStatus);
					
					pw.println("Content-type: application/json");
					pw.println("Cache-control: max-age=1209600");
					if (paymentStatus.equals("COMPLETED")) {
						JSONObject jsonOutput = new JSONObject();
						
						jsonOutput.put("id", response.getPayment().getId());
						jsonOutput.put("amount", response.getPayment().getAmountMoney().getAmount());
						jsonOutput.put("sourceType", response.getPayment().getSourceType());
						jsonOutput.put("orderId", response.getPayment().getOrderId());
						jsonOutput.put("note", response.getPayment().getNote());
						jsonOutput.put("receiptURL", response.getPayment().getReceiptUrl());
						jsonOutput.put("status", paymentStatus);
	//					jsonOutput.put("", response.getPayment());`
						pw.println(jsonOutput.toString());
					} else if (paymentStatus.equals("FAILED")) {
						pw.println(response.getErrors().toString());
					}
			
				} catch (ApiException apiE) {
					// TODO Auto-generated catch block
//					e.printStackTrace();
					System.out.println("createPayment borked:");
					JSONObject jsonHttp = new JSONObject();
					List errorsList = (List) apiE.getErrors();
					Object[] errors = errorsList.toArray();
					String[] stringErrorArray = new String[errors.length];
					for (int a = 0; a < errors.length; a++) {
						String errorString = errors[a].toString();
						stringErrorArray[a] = errorString;
					}
					JSONArray jsonErrorArray = new JSONArray(stringErrorArray);
					
					jsonHttp.put("errors", jsonErrorArray);
					pw.println(jsonHttp.toString());
				}
			} catch (Exception exception) {
				System.out.println("NUTS!  CreatePaymentResponse not returned for payment request");
				System.out.println(exception.getMessage());
				// e === an instance of ApiException class from Square, so let's pull its details & kick those out
				JSONObject jsonHttp = new JSONObject();
				jsonHttp.put("response", exception.getMessage());
//				jsonHttp.put("response", e1.getResponseCode());
//				List errorsList = e1.getErrors();
				List errorsList = (List) exception.getCause();
				Object[] errors = errorsList.toArray();

				String[] stringErrorArray = new String[errors.length];
				for (int a = 0; a < errors.length; a++) {
					String errorString = errors[a].toString();
					stringErrorArray[a] = errorString;
				}
				JSONArray jsonErrorArray = new JSONArray(stringErrorArray);
				
				jsonHttp.put("errors", jsonErrorArray);
				pw.println(jsonHttp.toString());
//				e1.printStackTrace();
			}
		} catch(Exception e) {
			System.out.println("GENERAL ERROR; see below:");
			e.printStackTrace();
		}
	}
}