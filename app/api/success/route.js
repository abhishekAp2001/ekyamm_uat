// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   let body = {};
//   const contentType = req.headers.get('content-type') || '';

//   if (contentType.includes('application/json')) {
//     body = await req.json();
//   } else if (
//     contentType.includes('application/x-www-form-urlencoded') ||
//     contentType.includes('multipart/form-data')
//   ) {
//     const formData = await req.formData();
//     formData.forEach((value, key) => {
//       body[key] = value.toString();
//     });
//   } else {
//     console.log('Unsupported Content-Type:', contentType);
//   }

//   console.log('Received body:', body);

//   const params = new URLSearchParams(body).toString();
//   const url = `/patient/payment-success?${params}`;

//   const html = `
//     <html>
//       <head>
//         <meta http-equiv="refresh" content="0; url=${url}" />
//       </head>
//       <body>
//         Redirecting to confirmation page...
//       </body>
//     </html>
//   `;

//   return new NextResponse(html, {
//     status: 200,
//     headers: { 'Content-Type': 'text/html' },
//   });
// }


import { NextResponse } from 'next/server';
 
export const runtime = 'nodejs'; // Needed for full formData support
 
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
 
  const params = new URLSearchParams(body).toString();
  const url = `/patient/payment-success?${params}`;
 
  return NextResponse.redirect(new URL(url, req.url), 302);
}