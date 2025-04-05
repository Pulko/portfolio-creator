import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access in development mode
        if (process.env.NODE_ENV === 'development') {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/create"],
}; 