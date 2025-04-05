import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        console.log('JWT token set with access token');
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = (token as { accessToken?: string }).accessToken;
      console.log('Session created with access token:', !!session.accessToken);
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 