const https = require('https');

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  
  if (!clientId || !secret) {
    throw new Error('Missing PayPal credentials');
  }
  
  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

  return new Promise((resolve, reject) => {
    const postData = 'grant_type=client_credentials';
    const options = {
      hostname: 'api-m.paypal.com',
      path: '/v1/oauth2/token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log('PayPal token response:', JSON.stringify(parsed));
          if (parsed.access_token) {
            resolve(parsed.access_token);
          } else {
            reject(new Error('No access token: ' + JSON.stringify(parsed)));
          }
        } catch(e) {
          reject(new Error('Token parse error: ' + data));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { amount, currency, packageName } = JSON.parse(event.body);
    console.log('Creating order:', { amount, currency, packageName });
    
    const accessToken = await getAccessToken();
    console.log('Got access token');

    const orderData = JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: { currency_code: currency || 'USD', value: amount },
        description: packageName
      }]
    });

    const order = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api-m.paypal.com',
        path: '/v2/checkout/orders',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(orderData)
        }
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            console.log('Order response:', JSON.stringify(parsed));
            resolve(parsed);
          } catch(e) {
            reject(new Error('Order parse error: ' + data));
          }
        });
      });
      req.on('error', reject);
      req.write(orderData);
      req.end();
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    };
  } catch (err) {
    console.error('Error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
