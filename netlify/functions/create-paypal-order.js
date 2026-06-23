const https = require('https');

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
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
        'Content-Length': postData.length
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data).access_token));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { amount, currency, packageName } = JSON.parse(event.body);
    const accessToken = await getAccessToken();

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
          'Content-Length': orderData.length
        }
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.write(orderData);
      req.end();
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(order)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
