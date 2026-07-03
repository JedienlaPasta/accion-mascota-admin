import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        // Omitido el id_token para evitar superar el limite de tamaño de la cookie de sesion en Node.js.
        // Utilizado el refresh_token para cerrar la sesion en Keycloak.
        token.refreshToken = account.refresh_token;
      }
      if (profile) {
        // Para que los roles lleguen aqui es necesario configurar un Mapper en Keycloak.
        // Keycloak > accion-mascota realm > Clients > accion-mascota-admin > Client scopes > accion-mascota-admin-dedicated > Add mapper > By configuration > User Realm Role
        // Token Claim Name: "realm_access.roles", Claim JSON Type: string, Add to ID Token: On, Add to access token: On, Add to userinfo: On.
        const keycloakProfile = profile as {
          realm_access?: { roles: string[] };
        };
        token.roles = keycloakProfile.realm_access?.roles || [];
      }
      if (!token.roles) {
        token.roles = [];
      }
      return token;
    },
    async session({ session, token }) {
      // Pasados los datos custom del token al objeto session, para que esten disponibles en los client components y layouts.
      if (session.user) {
        session.user.roles = token.roles as string[];
      }
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 10 * 60 * 60, // 10 horas
  },
  pages: {
    error: '/auth/error',
  },
});
