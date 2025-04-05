import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: 'repo',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback:', {
        user: user?.name,
        hasAccount: !!account,
        hasAccessToken: !!account?.access_token,
        scopes: account?.scope,
        profileName: profile?.name,
      });
      return true;
    },
    async jwt({ token, account, user }) {
      console.log('JWT callback:', {
        hasToken: !!token,
        hasAccount: !!account,
        hasAccessToken: !!account?.access_token,
        scopes: account?.scope,
        tokenType: account?.token_type,
        user: user?.name,
      });
      
      if (account) {
        token.accessToken = account.access_token;
        console.log('Access token set in JWT:', !!token.accessToken);
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log('Session callback:', {
        hasSession: !!session,
        hasToken: !!token,
        hasAccessToken: !!token.accessToken,
        tokenType: typeof token.accessToken,
        user: user?.name,
      });
      
      session.accessToken = (token as { accessToken?: string }).accessToken;
      console.log('Final session state:', {
        hasAccessToken: !!session.accessToken,
        user: session.user?.name,
      });
      return session;
    },
  },
  debug: true, // Enable debug logs in production
  logger: {
    error(code, metadata) {
      console.error('NextAuth error:', { code, metadata });
    },
    warn(code) {
      console.warn('NextAuth warning:', code);
    },
    debug(code, metadata) {
      console.log('NextAuth debug:', { code, metadata });
    },
  },
});

export { handler as GET, handler as POST }; 