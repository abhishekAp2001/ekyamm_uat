import { NextResponse } from 'next/server';

export async function POST(req) {
  const html = `
    <html>
      <head>
        <meta http-equiv="refresh" content="0; url=/patient/payment-failure" />
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
