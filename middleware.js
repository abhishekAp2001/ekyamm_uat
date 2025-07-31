import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const patientProtectedPaths = ['/patient/dashboard', '/patient/edit-profile', '/patient/patient-profile', '/patient/pay-for-sessions', '/patient/payment', '/patient/payment-confirmation', '/patient/psychiatrist-profile', '/patient/reschedule-session', '/patient/schedule-session', '/patient/select-package', '/patient/sessions-synopsis', '/patient/upcoming-sessions'];
    
    const channelPartnerProtectedPaths = ['/channel-partner/:path*/otp_send','/channel-partner/:path*/patient-registration','/channel-partner/:path*/patient-history','/channel-partner/:path*/sessions-selection','/channel-partner/:path*/invoice-sent','/channel-partner/:path*/pay-for-sessions','/channel-partner/:path*/payment','/channel-partner/:path*/payment-confirmation']

    if (pathname.startsWith('/sales')) {
        const userCookie = request.cookies.get('user');

        if (!userCookie) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }
    if (patientProtectedPaths.some(path => pathname.startsWith(path))) {
        const userCookie = request.cookies.get('patientSessionData');
        if (!userCookie) {
            const loginUrl = new URL('/patient/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    if(channelPartnerProtectedPaths.some(path => pathname.startsWith(path))) {
        const userCookie = request.cookies.get('channelPartnerData');
        if (!userCookie) {
            const loginUrl = new URL('/', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }
    return NextResponse.next();
}
