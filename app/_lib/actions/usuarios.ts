// 'use server';
// import sql from '../db';

// export async function createTestUser(): Promise<{
//   success: boolean;
//   message: string;
// }> {
//   try {
//     const user = await sql`
//       SELECT id FROM usuarios LIMIT 1
//     `;

//     if (user.length > 0) {
//       return fail('Ya ha sido creado el usuario de pruebas');
//     }

//     console.log('Procediendo a crear usuario de pruebas');

//     const publicId = crypto.randomUUID();
//     await sql`
//       INSERT INTO usuarios (public_id, rut, nombre, correo, cargo, permisos, estado)
//       VALUES (${publicId}, '5555555-5', 'Admin Prueba', 'admin@prueba.cl', 'Admin', 'ALL', true);
//     `;

//     return {
//       success: true,
//       message: `Usuario de pruebas creado exitosamente`,
//     };
//   } catch (error) {
//     console.error('[createTestUser] DB error:', error);
//     return fail(error as string);
//   }
// }

// function fail(error: string) {
//   return { success: false, message: error };
// }
