import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";
import { User, Account, Profile } from "next-auth";
import { Session } from "next-auth";

interface ExtendedJWT extends JWT {
  accessToken?: string;
}

export const authOptions = {
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
    async signIn({ user, account, profile }: { user: User; account: Account | null; profile?: Profile }) {
      console.log('🔐 SignIn callback:', {
        user: user?.name,
        hasAccount: !!account,
        hasAccessToken: !!account?.access_token,
        accessToken: account?.access_token ? '***' : undefined,
        scopes: account?.scope,
        profileName: profile?.name,
        accountType: account?.type,
        tokenType: account?.token_type,
        provider: account?.provider,
      });

      if (!account?.access_token) {
        console.error('❌ No access token received from GitHub');
        return false;
      }

      return true;
    },
    async jwt({ token, account, user }: { token: JWT; account: Account | null; user: User }) {
      const typedToken = token as ExtendedJWT;
      console.log('🔑 JWT callback - Initial:', {
        hasToken: !!typedToken,
        hasAccount: !!account,
        hasAccessToken: !!account?.access_token,
        accessToken: account?.access_token ? '***' : undefined,
        scopes: account?.scope,
        tokenType: account?.token_type,
        user: user?.name,
        currentTokenKeys: Object.keys(typedToken),
      });
      
      if (account) {
        typedToken.accessToken = account.access_token;
        console.log('✅ JWT callback - After setting token:', {
          hasAccessToken: !!typedToken.accessToken,
          tokenLength: typedToken.accessToken?.length,
          currentTokenKeys: Object.keys(typedToken),
        });
      }
      return typedToken;
    },
    async session({ session, token, user }: { session: Session; token: JWT; user: User }) {
      const typedToken = token as ExtendedJWT;
      console.log('👤 Session callback:', {
        hasSession: !!session,
        hasToken: !!typedToken,
        hasAccessToken: !!typedToken.accessToken,
        tokenType: typeof typedToken.accessToken,
        user: user?.name,
        currentTokenKeys: Object.keys(typedToken),
      });
      
      if (!typedToken.accessToken) {
        console.error('❌ No access token in JWT token');
        return session;
      }

      session.accessToken = typedToken.accessToken;
      console.log('🎯 Final session state:', {
        hasAccessToken: !!session.accessToken,
        user: session.user?.name,
        tokenLength: session.accessToken?.length,
      });
      return session;
    },
  },
  debug: true,
  logger: {
    error(code: string, metadata: Error | { [key: string]: unknown; error: Error }) {
      console.error('❌ NextAuth error:', { code, metadata });
    },
    warn(code: string) {
      console.warn('⚠️ NextAuth warning:', code);
    },
    debug(code: string, metadata: unknown) {
      console.log('🔍 NextAuth debug:', { code, metadata });
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 