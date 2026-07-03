'use server';

import { auth } from '@/auth';

export async function logout() {
  const session = await auth();

  if (session && session.refreshToken) {
    const issuer = process.env.AUTH_KEYCLOAK_ISSUER;
    const clientId = process.env.AUTH_KEYCLOAK_ID;
    const clientSecret = process.env.AUTH_KEYCLOAK_SECRET;

    const logoutUrl = `${issuer}/protocol/openid-connect/logout`;

    // Datos para especificar la sesion a cerrar
    const details = new URLSearchParams({
      client_id: clientId!,
      refresh_token: session.refreshToken as string,
    });

    // Credenciales para autenticar en Keycloak encriptadas en Base64
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64'
    );

    // Intentar cerrar la sesion en Keycloak (peticion servidor a servidor)
    try {
      const res = await fetch(logoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basicAuth}`,
        },
        body: details.toString(),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error de logout en Keycloak:', res.status, errorText);
      } else {
        console.log('Sesión cerrada exitosamente en Keycloak');
      }
    } catch (error) {
      console.error('Error de comunicación con Keycloak:', error);
    }
  } else {
    console.log('Sesión o refresh token no encontrado en NextAuth');
  }
}
