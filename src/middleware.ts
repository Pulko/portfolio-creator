import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return process.env.NODE_ENV === 'development' || !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/create"],
}; 