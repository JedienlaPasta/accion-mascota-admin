import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      roles: string[];
    } & DefaultSession['user'];
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    roles: string[];
    idToken?: string;
  }
}
