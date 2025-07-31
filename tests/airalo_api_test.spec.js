// This file contains Playwright API tests for the Airalo Partner API.
const { test, expect } = require('@playwright/test')

// --- Configuration ---should not be hardcoded in realtime
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_BASE_URL = process.env.API_BASE_URL;
console.log("API_BASE_URL:", API_BASE_URL); 
console.log("CLIENT_SECRET:", CLIENT_SECRET); 
console.log("CLIENT_ID:", CLIENT_ID); 
// Airalo API Endpoints
const TOKEN_URL = `${API_BASE_URL}/token`
const ORDER_ESIMS_URL = `${API_BASE_URL}/orders`
const GET_ESIMS_URL = `${API_BASE_URL}/sims`

// --- Global Variable to Store Access Token ---
let accessToken;

  test.beforeEach(async ({ request }) => {
    
    // Post Request for retrieving access token
    const response = await request.post(TOKEN_URL, {
      form: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
      headers: {
        'Accept': 'application/json', 
      },
    });

    // Assertion for HTTP status code for the token request
    expect(response.status()).toBe(200);
    console.log(`Token request status: ${response.status()}`)

    const responseBody = await response.json()
    console.log('Token Response Body:', JSON.stringify(responseBody, null, 2))

    // Assert the response body and content of the token response body
    expect(responseBody).toHaveProperty('data')
    expect(responseBody.data).toHaveProperty('token_type', 'Bearer')
    expect(responseBody.data).toHaveProperty('expires_in')
    expect(typeof responseBody.data.expires_in).toBe('number')
    expect(responseBody.data.expires_in).toBeGreaterThan(0)
    expect(responseBody.data).toHaveProperty('access_token')
    expect(typeof responseBody.data.access_token).toBe('string')
    expect(responseBody.data.access_token.length).toBeGreaterThan(0)
    expect(responseBody).toHaveProperty('meta')
    expect(responseBody.meta).toHaveProperty('message', 'success')

    // Store the obtained access token for use in subsequent tests
    accessToken = responseBody.data.access_token;
    console.log('---OAuth2 token obtained successfully---');
  });

  // --- Test Case 1: Verify Token is generated ---
  test('Should successfully obtain an OAuth2 access token', async () => {
    expect(accessToken).toBeDefined()
    expect(typeof accessToken).toBe('string')
    expect(accessToken.length).toBeGreaterThan(0)
    console.log('Test: Successfully obtained access token.')

    console.log('----------------------------------------------------------------------------')
  });

  // --- Test Case 2: POST an order for 6 "merhaba-7days-1gb" eSIMs and GET the eSims List---
  test('POST an order for 6 "merhaba-7days-1gb" eSIMs', async ({ request }) => {
    // Skip this test if the access token was not obtained
    test.skip(!accessToken, 'Skipping order POST test: Access token not available')

    const quantity = 6;
    const packageId = 'merhaba-7days-1gb';
    const description = `PlaceOrder for ${quantity} ${packageId} eSIMs`

    console.log(`--- Starting Order POST Request to: ${ORDER_ESIMS_URL} ---`)

    console.log(`Attempting to POST order for 6 "merhaba-7days-1gb" eSIMs to: ${ORDER_ESIMS_URL}`)

  const response = await request.post(ORDER_ESIMS_URL, {
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`, 
  },
  form: { 
    quantity: String(quantity), 
    package_id: packageId, 
    //type: 'sim',
    description: description, 
    //brand_settings_name: 'our perfect brand',
  },
});

//Assertion of HTTP status code
expect(response.status()).toBe(200)
console.log(`Order POST request status: ${response.status()}`)

//Parse the JSON response body
const responseBody = await response.json()
console.log('Order POST Response Body:', JSON.stringify(responseBody, null, 2))

//Assertions
expect(responseBody).toHaveProperty('data')
expect(responseBody).toHaveProperty('meta')
expect(responseBody.meta).toHaveProperty('message', 'success')

//Assertion of order details
expect(responseBody.data).toHaveProperty('id')
expect(typeof responseBody.data.id).toBe('number')

expect(responseBody.data).toHaveProperty('code')
expect(typeof responseBody.data.code).toBe('string')

expect(responseBody.data).toHaveProperty('currency', 'USD')
expect(responseBody.data).toHaveProperty('package_id', packageId)
expect(responseBody.data).toHaveProperty('quantity', 6)
expect(responseBody.data).toHaveProperty('type', 'sim')
expect(responseBody.data).toHaveProperty('description', description)
expect(responseBody.data).toHaveProperty('esim_type', 'Prepaid')
expect(responseBody.data).toHaveProperty('validity', 7)
expect(responseBody.data).toHaveProperty('package', 'Merhaba-1 GB - 7 Days')
expect(responseBody.data).toHaveProperty('data', '1 GB')
expect(responseBody.data).toHaveProperty('price', 4.5)
expect(responseBody.data).toHaveProperty('created_at')
expect(typeof responseBody.data.created_at).toBe('string')

expect(responseBody.data).toHaveProperty('manual_installation')
expect(typeof responseBody.data.manual_installation).toBe('string')
expect(responseBody.data.manual_installation).toContain('To manually activate the eSIM')

expect(responseBody.data).toHaveProperty('qrcode_installation')
expect(typeof responseBody.data.qrcode_installation).toBe('string')
expect(responseBody.data.qrcode_installation).toContain('To activate the eSIM by scanning the QR code') 

expect(responseBody.data).toHaveProperty('installation_guides')
expect(typeof responseBody.data.installation_guides).toBe('object')
expect(responseBody.data.installation_guides).toHaveProperty('en', 'https://www.airalo.com/help/getting-started-with-airalo');

expect(responseBody.data).toHaveProperty('text', null)
expect(responseBody.data).toHaveProperty('voice', null)
expect(responseBody.data).toHaveProperty('net_price', 3.6)
expect(responseBody.data).toHaveProperty('brand_settings_name', null)

// Assertions for sim properties
expect(responseBody.data).toHaveProperty('sims')
expect(Array.isArray(responseBody.data.sims)).toBe(true)
expect(responseBody.data.sims.length).toBe(quantity)

for (const esim of responseBody.data.sims) {
  expect(esim).toHaveProperty('id');
  expect(typeof esim.id).toBe('number')
  expect(esim).toHaveProperty('created_at')
  expect(typeof esim.created_at).toBe('string')

  expect(esim).toHaveProperty('iccid')
  expect(typeof esim.iccid).toBe('string')

  expect(esim).toHaveProperty('lpa', 'lpa.airalo.com')
  expect(esim).toHaveProperty('imsis', null)
  expect(esim).toHaveProperty('matching_id', 'TEST')
  expect(esim).toHaveProperty('qrcode')
  expect(typeof esim.qrcode).toBe('string')
  expect(esim.qrcode).toContain('LPA:1$lpa.airalo.com$TEST')

  expect(esim).toHaveProperty('qrcode_url')
  expect(typeof esim.qrcode_url).toBe('string')
  expect(esim.qrcode_url).toContain('https://sandbox.airalo.com/qr?')

  expect(esim).toHaveProperty('airalo_code', null)
  expect(esim).toHaveProperty('apn_type', 'manual')
  expect(esim).toHaveProperty('apn_value', 'airalo2')
  expect(esim).toHaveProperty('is_roaming', true)
  expect(esim).toHaveProperty('confirmation_code', null)

  expect(esim).toHaveProperty('apn')
  expect(typeof esim.apn).toBe('object')
  expect(esim.apn).toHaveProperty('ios')
  expect(esim.apn.ios).toHaveProperty('apn_type', 'manual')
  expect(esim.apn.ios).toHaveProperty('apn_value', 'airalo2')
  expect(esim.apn).toHaveProperty('android')
  expect(esim.apn.android).toHaveProperty('apn_type', 'manual')
  expect(esim.apn.android).toHaveProperty('apn_value', 'airalo2')

  expect(esim).toHaveProperty('msisdn', null);

  expect(esim).toHaveProperty('direct_apple_installation_url')
  expect(typeof esim.direct_apple_installation_url).toBe('string')
  expect(esim.direct_apple_installation_url).toContain('https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=LPA:1$lpa.airalo.com$TEST');
}

console.log('All order response assertions passed successfully!')

console.log('Order POST test for 6 "merhaba-7days-1gb" eSIMs passed.')
console.log('----------------------------------------------------------------------------')

 });
// --- Test Case 3: Get the list of eSims ordered for  "merhaba-7days-1gb" ---
  test('Get The eSims List of "merhaba-7days-1gb" eSIMs ', async ({ request }) => {
    // Skip this test if the access token was not obtained
    test.skip(!accessToken, 'Skipping order POST test: Access token not available')

    const quantity = 6;
    const packageId = 'merhaba-7days-1gb';
    const description = `PlaceOrder for ${quantity} ${packageId} eSIMs`

    console.log(`--- Starting Order POST Request to: ${ORDER_ESIMS_URL} ---`)

    console.log(`Attempting to POST order for 6 "merhaba-7days-1gb" eSIMs to: ${ORDER_ESIMS_URL}`)

  const response = await request.post(ORDER_ESIMS_URL, {
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`, 
  },
  form: { 
    quantity: String(quantity), 
    package_id: packageId, 
    //type: 'sim',
    description: description, 
    //brand_settings_name: 'our perfect brand',
  },
});

//Assertion of HTTP status code
expect(response.status()).toBe(200)
console.log(`Order POST request status: ${response.status()}`)

//Parse the JSON response body
const responseBody = await response.json()
console.log('Order POST Response Body:', JSON.stringify(responseBody, null, 2))

//Assertions
expect(responseBody).toHaveProperty('data')
expect(responseBody).toHaveProperty('meta')
expect(responseBody.meta).toHaveProperty('message', 'success')

//Assertion of order details
expect(responseBody.data).toHaveProperty('id')
expect(typeof responseBody.data.id).toBe('number')

expect(responseBody.data).toHaveProperty('code')
expect(typeof responseBody.data.code).toBe('string')

expect(responseBody.data).toHaveProperty('currency', 'USD')
expect(responseBody.data).toHaveProperty('package_id', packageId)
expect(responseBody.data).toHaveProperty('quantity', 6)
expect(responseBody.data).toHaveProperty('type', 'sim')
expect(responseBody.data).toHaveProperty('description', description)
expect(responseBody.data).toHaveProperty('esim_type', 'Prepaid')
expect(responseBody.data).toHaveProperty('validity', 7)
expect(responseBody.data).toHaveProperty('package', 'Merhaba-1 GB - 7 Days')
expect(responseBody.data).toHaveProperty('data', '1 GB')
expect(responseBody.data).toHaveProperty('price', 4.5)
expect(responseBody.data).toHaveProperty('created_at')
expect(typeof responseBody.data.created_at).toBe('string')

expect(responseBody.data).toHaveProperty('manual_installation')
expect(typeof responseBody.data.manual_installation).toBe('string')
expect(responseBody.data.manual_installation).toContain('To manually activate the eSIM')

expect(responseBody.data).toHaveProperty('qrcode_installation')
expect(typeof responseBody.data.qrcode_installation).toBe('string')
expect(responseBody.data.qrcode_installation).toContain('To activate the eSIM by scanning the QR code') 

expect(responseBody.data).toHaveProperty('installation_guides')
expect(typeof responseBody.data.installation_guides).toBe('object')
expect(responseBody.data.installation_guides).toHaveProperty('en', 'https://www.airalo.com/help/getting-started-with-airalo');

expect(responseBody.data).toHaveProperty('text', null)
expect(responseBody.data).toHaveProperty('voice', null)
expect(responseBody.data).toHaveProperty('net_price', 3.6)
expect(responseBody.data).toHaveProperty('brand_settings_name', null)

// Assertions for sim properties
expect(responseBody.data).toHaveProperty('sims')
expect(Array.isArray(responseBody.data.sims)).toBe(true)
expect(responseBody.data.sims.length).toBe(quantity)

for (const esim of responseBody.data.sims) {
  expect(esim).toHaveProperty('id');
  expect(typeof esim.id).toBe('number')
  expect(esim).toHaveProperty('created_at')
  expect(typeof esim.created_at).toBe('string')

  expect(esim).toHaveProperty('iccid')
  expect(typeof esim.iccid).toBe('string')

  expect(esim).toHaveProperty('lpa', 'lpa.airalo.com')
  expect(esim).toHaveProperty('imsis', null)
  expect(esim).toHaveProperty('matching_id', 'TEST')
  expect(esim).toHaveProperty('qrcode')
  expect(typeof esim.qrcode).toBe('string')
  expect(esim.qrcode).toContain('LPA:1$lpa.airalo.com$TEST')

  expect(esim).toHaveProperty('qrcode_url')
  expect(typeof esim.qrcode_url).toBe('string')
  expect(esim.qrcode_url).toContain('https://sandbox.airalo.com/qr?')

  expect(esim).toHaveProperty('airalo_code', null)
  expect(esim).toHaveProperty('apn_type', 'manual')
  expect(esim).toHaveProperty('apn_value', 'airalo2')
  expect(esim).toHaveProperty('is_roaming', true)
  expect(esim).toHaveProperty('confirmation_code', null)

  expect(esim).toHaveProperty('apn')
  expect(typeof esim.apn).toBe('object')
  expect(esim.apn).toHaveProperty('ios')
  expect(esim.apn.ios).toHaveProperty('apn_type', 'manual')
  expect(esim.apn.ios).toHaveProperty('apn_value', 'airalo2')
  expect(esim.apn).toHaveProperty('android')
  expect(esim.apn.android).toHaveProperty('apn_type', 'manual')
  expect(esim.apn.android).toHaveProperty('apn_value', 'airalo2')

  expect(esim).toHaveProperty('msisdn', null);

  expect(esim).toHaveProperty('direct_apple_installation_url')
  expect(typeof esim.direct_apple_installation_url).toBe('string')
  expect(esim.direct_apple_installation_url).toContain('https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=LPA:1$lpa.airalo.com$TEST');
}

console.log('All order response assertions passed successfully!')

console.log('Order POST test for 6 "merhaba-7days-1gb" eSIMs passed.')
console.log('----------------------------------------------------------------------------')
//Get the list of eSim Details Posted by previous request

      const orderCreatedAtDate = responseBody.data.created_at.split(' ')[0] // Extracting YYYY-MM-DD
      const orderId = responseBody.data.id
      const orderedSimsICCIDs = responseBody.data.sims.map((sim) => sim.iccid)
  
      console.log(`--- Retrieving eSIMs list, filtering by order date: ${orderCreatedAtDate} ---`)
      console.log(`Expected ICCIDs from previous order: ${orderedSimsICCIDs.join(', ')}`)
  
  
      const getSimsResponse = await request.get(GET_ESIMS_URL, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          'filter[created_at]': `${orderCreatedAtDate} - ${orderCreatedAtDate}`,
          'include': 'order',
          'limit': quantity, 
          'page': 1,
        },
      });
  
      expect(getSimsResponse.status()).toBe(200)
      const getSimsResponseBody = await getSimsResponse.json()
      console.log('GET eSIMs List Response Body:', JSON.stringify(getSimsResponseBody, null, 2))
  
      // Assertions of 'meta' 
      expect(getSimsResponseBody).toHaveProperty('meta')
      expect(getSimsResponseBody.meta).toHaveProperty('message', 'success')
      expect(getSimsResponseBody.meta).toHaveProperty('current_page')
      expect(getSimsResponseBody.meta).toHaveProperty('total')
  
      // Assertions for 'links'
      expect(getSimsResponseBody).toHaveProperty('links')
      expect(typeof getSimsResponseBody.links).toBe('object')
  
  
      // Assertion for 'data' 
      expect(getSimsResponseBody).toHaveProperty('data')
      expect(Array.isArray(getSimsResponseBody.data)).toBe(true)
  
      // Filter retrieved eSIMs to check the specific order
      const filteredSims = getSimsResponseBody.data.filter((sim) =>
        sim.simable && 
        sim.simable.id === orderId && // Match the order ID
        sim.simable.package_id === packageId && // Match the package ID
        orderedSimsICCIDs.includes(sim.iccid) // Match one of the ICCIDs from our order
      );
  
      // Assertions for thr the 6 eSIMs ffrom the post order
      expect(filteredSims.length).toBe(quantity)
      console.log(`Found ${filteredSims.length} eSIMs matching the criteria from the POSTed order.`)
  
      // Assertion for esim details for each of the 6 found eSIMs
      for (const esim of filteredSims) {
        expect(esim).toHaveProperty('id')
        expect(typeof esim.id).toBe('number')
        expect(esim).toHaveProperty('created_at')
        expect(typeof esim.created_at).toBe('string')
        expect(esim).toHaveProperty('iccid')
        expect(orderedSimsICCIDs).toContain(esim.iccid)
  
        expect(esim).toHaveProperty('lpa', 'lpa.airalo.com')
        expect(esim).toHaveProperty('imsis', null)
        expect(esim).toHaveProperty('matching_id', 'TEST')
        expect(esim).toHaveProperty('qrcode')
        expect(esim).toHaveProperty('qrcode_url')
        expect(esim.qrcode_url).toContain('https://sandbox.airalo.com/qr?')
  
        expect(esim).toHaveProperty('direct_apple_installation_url')
        expect(typeof esim.direct_apple_installation_url).toBe('string')
        expect(esim.direct_apple_installation_url).toContain('https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=')
  
        expect(esim).toHaveProperty('voucher_code', null)
        expect(esim).toHaveProperty('airalo_code', null)
        expect(esim).toHaveProperty('apn_type')
        expect(esim).toHaveProperty('is_roaming', true)
        expect(esim).toHaveProperty('confirmation_code', null)
        
        expect(esim).toHaveProperty('brand_settings_name')
  
       
        expect(esim).toHaveProperty('simable')
        expect(typeof esim.simable).toBe('object')
        expect(esim.simable).toHaveProperty('id', orderId) // check the match POSTed order ID
        expect(esim.simable).toHaveProperty('created_at')
        expect(esim.simable).toHaveProperty('code')
        expect(esim.simable).toHaveProperty('description')
        expect(esim.simable).toHaveProperty('type', 'sim')
        expect(esim.simable).toHaveProperty('package_id', packageId) // check the match of package ID
        expect(esim.simable).toHaveProperty('quantity', quantity) 
        expect(esim.simable).toHaveProperty('package')
        expect(esim.simable).toHaveProperty('esim_type', 'Prepaid')
        expect(esim.simable).toHaveProperty('validity')
        expect(esim.simable).toHaveProperty('price')
        expect(esim.simable).toHaveProperty('data')
        expect(esim.simable).toHaveProperty('currency', 'USD')
        expect(esim.simable).toHaveProperty('manual_installation')
        expect(esim.simable).toHaveProperty('qrcode_installation')
        expect(esim.simable).toHaveProperty('installation_guides')
      
      }
    
      console.log('\n--- Both order POST and eSIMs GET verification passed successfully. ---')
    });
 
