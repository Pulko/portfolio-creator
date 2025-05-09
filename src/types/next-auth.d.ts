import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      email: string;
      image?: string;
    };
    accessToken?: string;
  }

  interface JWT {
    accessToken?: string;
  }
} 