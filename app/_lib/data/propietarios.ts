import { PropietariosTableData } from '../data-types/propietarios';
import sql from '../db';

export const getAllOwnersWithQuery = async (
  query: string
): Promise<PropietariosTableData[]> => {
  try {
    const searchTerm = `%${query}%`;
    const propietarios = await sql`
      SELECT
        p.public_id as id,
        p.nombre AS nombre_propietario,
        p.rut,
        p.correo,
        p.direccion,
        p.comuna,
        p.region,
        p.telefono,
        COUNT(m.id) AS total_mascotas
      FROM propietarios p
      LEFT JOIN mascotas m ON m.propietario_id = p.id
      WHERE p.nombre ILIKE ${searchTerm}
        OR p.rut ILIKE ${searchTerm}
        OR p.telefono ILIKE ${searchTerm}
        OR p.correo ILIKE ${searchTerm}
        OR p.direccion ILIKE ${searchTerm}
        OR p.comuna ILIKE ${searchTerm}
      GROUP BY
        p.id,
        p.public_id,
        p.nombre,
        p.rut,
        p.correo,
        p.direccion,
        p.comuna,
        p.region,
        p.telefono
      ORDER BY p.id
      LIMIT 10
    `;

    return propietarios.map(
      (propietario) => propietario as PropietariosTableData
    );
  } catch (error) {
    console.error('Error al obtener propietarios:', error);
    return [] as PropietariosTableData[];
  }
};
