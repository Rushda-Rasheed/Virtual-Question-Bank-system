
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; 

export function middleware(req) {
  const token = req.cookies.get('accessToken')?.value;
  const registered = req.cookies.get('registered')?.value;
  const url = req.nextUrl.clone();

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const role = decoded.role;

      if (role === 'admin') {
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
      } else if (role === 'user') {
        url.pathname = '/user/dashboard';
        return NextResponse.redirect(url);
      } else {
       
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('JWT verification failed:', error);
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  } else {
    if (registered === 'true') {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    } else {
      url.pathname = '/register';
      return NextResponse.redirect(url);
    }
  }

  
  return NextResponse.next();
}

export const config = {
  matcher: '/', 
};
