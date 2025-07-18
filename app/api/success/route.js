import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  let body = {};
  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    body = await req.json();
  } else if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const formData = await req.formData();
    formData.forEach((value, key) => {
      body[key] = value.toString();
    });
  } else {
    console.log('Unsupported Content-Type:', contentType);
  }

  const {
    key = '',
    txnid = '',
    amount = '',
    productinfo = '',
    firstname = '',
    email = '',
    status = '',
    hash = '',
  } = body;

  const hashString = `${process.env.PAYU_HOSTED_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const generatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
  const hashIsValid = generatedHash === hash;
  const params = new URLSearchParams({
    ...body,
    hashIsValid: hashIsValid ? '1' : '0',
  }).toString();

  const url = `/patient/payment-success?${params}`;

  const html = `
    <html>
      <head>
        <meta http-equiv="refresh" content="0; url=${url}" />
      </head>
      <body>
        Redirecting to confirmation page...
      </body>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
