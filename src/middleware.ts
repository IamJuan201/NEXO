import { NextRequest, NextResponse } from "next/server";


export function middleware(request: NextRequest) {
    const response  = NextResponse.next();

    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Origin', 'Content-Type, Authorization');

    if (request.method === 'OPTIONS') {
        return new NextResponse(null, { status: 204, headers: response.headers});
    }
    return response
}

export const config = {
    matcher: '/api/:patch*',
}