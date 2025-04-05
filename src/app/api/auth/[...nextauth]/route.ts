import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

interface Token {
  accessToken?: string;
  [key: string]: any;
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: 'repo user',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 SignIn callback:', {
        user: user?.name,
        hasAccount: !!account,
        hasAccessToken: !!account?.access_token,
        scopes: account?.scope,
        profileName: profile?.name,
        accountType: account?.type,
        tokenType: account?.token_type,
      });
      return true;
    },
    async jwt({ token, account, user }) {
      const typedToken = token as Token;
      console.log('🔑 JWT callback:', {
        hasToken: !!typedToken,
        hasAccount: !!account,
        hasAccessToken: !!account?.access_token,
        scopes: account?.scope,
        tokenType: account?.token_type,
        user: user?.name,
        currentToken: typedToken,
      });
      
      if (account) {
        typedToken.accessToken = account.access_token;
        console.log('✅ Access token set in JWT:', {
          hasToken: !!typedToken.accessToken,
          tokenLength: typedToken.accessToken?.length,
        });
      }
      return typedToken;
    },
    async session({ session, token, user }) {
      const typedToken = token as Token;
      console.log('👤 Session callback:', {
        hasSession: !!session,
        hasToken: !!typedToken,
        hasAccessToken: !!typedToken.accessToken,
        tokenType: typeof typedToken.accessToken,
        user: user?.name,
        currentToken: typedToken,
      });
      
      session.accessToken = typedToken.accessToken;
      console.log('🎯 Final session state:', {
        hasAccessToken: !!session.accessToken,
        user: session.user?.name,
        tokenLength: session.accessToken?.length,
      });
      return session;
    },
  },
  debug: true, // Enable debug logs in production
  logger: {
    error(code, metadata) {
      console.error('❌ NextAuth error:', { code, metadata });
    },
    warn(code) {
      console.warn('⚠️ NextAuth warning:', code);
    },
    debug(code, metadata) {
      console.log('🔍 NextAuth debug:', { code, metadata });
    },
  },
});

export { handler as GET, handler as POST }; 