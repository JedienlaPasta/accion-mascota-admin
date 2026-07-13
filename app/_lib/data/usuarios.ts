'use server';

import sql from '../db';

const users = await sql`
    SELECT * FROM usuarios
`;
