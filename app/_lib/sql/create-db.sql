CREATE SCHEMA IF NOT EXISTS "public";

-- =========================================================
-- DROP TABLES
-- =========================================================

DROP TABLE IF EXISTS "public"."atenciones" CASCADE;
DROP TABLE IF EXISTS "public"."consultas_medicas" CASCADE;
DROP TABLE IF EXISTS "public"."operativos_esterilizacion" CASCADE;
DROP TABLE IF EXISTS "public"."procedimientos" CASCADE;
DROP TABLE IF EXISTS "public"."atencion_procedimientos" CASCADE;
DROP TABLE IF EXISTS "public"."implantaciones_microchip" CASCADE;
DROP TABLE IF EXISTS "public"."citas" CASCADE;
DROP TABLE IF EXISTS "public"."mascotas" CASCADE;
DROP TABLE IF EXISTS "public"."personas" CASCADE;
DROP TABLE IF EXISTS "public"."funcionarios" CASCADE;
DROP TABLE IF EXISTS "public"."solicitudes_adopcion" CASCADE;

-- =========================================================
-- TABLES
-- =========================================================

CREATE TABLE "public"."atenciones" (
    "id" int generated always as identity primary key,
    "public_id" text not null unique,
    "funcionario_id" int,
    "mascota_id" int not null,
    "acompaniante_id" int,
    "fecha_atencion" timestamptz not null,
    "tipo_atencion" varchar(50) not null, -- ["OPERATIVO_SANITARIO", "OPERATIVO_ESTERILIZACION", "CONSULTA_MEDICA"].
    "cita_id" int unique,
    "peso_actual" numeric(5,2),
    "observaciones" text,

    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP,
    
    check (
    	tipo_atencion in (
    		'OPERATIVO_SANITARIO',
    		'OPERATIVO_ESTERILIZACION',
    		'CONSULTA_MEDICA'
    	)
    )
);

create table "public"."consultas_medicas" (
	"id" int generated always as identity primary key,
	"atencion_id" int not null unique,
	"motivo" text not null, -- Motivo de la consulta
	"anamnesis" text,
	"examen_fisico" text,
	"diagnostico_predx" text,
	"examenes_solicitados" text,
	"tratamiento" text,
	"derivacion_clinica_privada" boolean
);

create table "public"."operativos_esterilizacion" (
	"id" int generated always as identity primary key,
	"atencion_id" int not null unique,
	"resultado" varchar(30) not null
);

create table "public"."procedimientos" (
	"id" int generated always as identity primary key,
	"codigo" varchar(50) not null unique,
	"nombre" varchar(100) not null
);

create table "public"."atencion_procedimientos" (
	"atencion_id" int NOT NULL,
    "procedimiento_id" int NOT NULL,

    CONSTRAINT "pk_atencion_procedimientos"
        PRIMARY KEY ("atencion_id", "procedimiento_id")
);

create table "public"."implantaciones_microchip" (
	"id" int generated always as identity primary key,
	"atencion_id" int not null unique,
	"numero_microchip" text not null unique
);

CREATE TABLE "public"."citas" (
    "id" int generated always as identity primary key,
    "public_id" text not null unique,
    "funcionario_id" int not null,
    "mascota_id" int not null,
    "atencion_origen_id" int, -- En caso de dejar agendada una hora como seguimiento a una atencion.
    "tipo_atencion" varchar(50) not null, -- ["OPERATIVO_SANITARIO", "OPERATIVO_ESTERILIZACION", "CONSULTA_MEDICA"].
    "hora_agendada" timestamptz not null,
    "motivo" text,
    "estado" varchar(50) not null,
    
    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP,
    
    check (
    	tipo_atencion in (
    		'OPERATIVO_SANITARIO',
    		'OPERATIVO_ESTERILIZACION',
    		'CONSULTA_MEDICA'
    	)
    )
);

CREATE TABLE "public"."mascotas" (
    "id" int generated always as identity primary key,
    "public_id" text not null unique,
    "responsable_id" int,
    "microchip" text unique,
    "inscrito_registro_nacional" boolean default false, -- Si se encuentra registrada en el Registro Nacional de Mascotas.
    "nombre" text not null,
    "fecha_nacimiento" date not null,
    "raza" text,
    "especie" text,
    "color" text,
    "patron" text,
    "sexo" text,
    "esterilizado" boolean,
    "modo_obtencion" text,
    "comuna_obtencion" text,
    "tipo_tenencia" text, -- ["Con dueño", "Sin Dueño"] (verificar valores apropiados).
    "razon_tenencia" text,
    "primera_visita_veterinario" boolean default true,
    "estado_vital" varchar(50),

    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP,
    
    check (
    	tipo_tenencia in ('CON DUEÑO', 'SIN DUEÑO')
    )
);

CREATE TABLE "public"."personas" (
    "id" int generated always as identity primary key,
    "public_id" text not null unique,
    "rut" text not null unique,
    "nombre" text not null,
    "correo_personal" text unique,
    "correo_contacto" text,
    "fecha_nacimiento" date,
    "direccion" text,
    "comuna" text,
    "region" text,
    "telefono" text,
    "rsh" int,
    "profesion_oficio" text,
    
    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP,
    
    check (
    	rsh in (40, 50, 60, 70, 80, 90, 100)
    )
);

CREATE TABLE "public"."funcionarios" (
    "id" int generated always as identity primary key,
    "persona_id" int not null unique,
    "cargo" text not null,
    "permisos" text not null,
    "estado" boolean not null,

    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP
);

CREATE TABLE "public"."solicitudes_adopcion" (
    "id" int generated always as identity primary key,
    "public_id" text not null unique,
    "funcionario_evaluador_id" int, -- Funcionario que revisó/evaluó la solicitud
    "mascota_id" int not null,
    "postulante_id" int not null,
    "fecha_solicitud" timestamptz not null default CURRENT_TIMESTAMP,
    
    -- Respuestas del formulario
    "tipo_vivienda" text not null, -- ["Casa", "Departamento"], etc.
    "tenencia_vivienda" text not null, -- ["Propia", "Arrendada"]
    "cierre_perimetral" text not null,
    "cantidad_personas" int not null,
    "presencia_ninos" text not null,
    "otras_mascotas" text,
    
    -- Gestión Administrativa (Lo que verá el ciudadano en su panel)
    "estado" varchar(50) not null default 'Enviada', -- ["Enviada", "En Evaluación", "Aprobada", "Rechazada"]
    "mensaje_veterinaria" text -- Feedback de acción mascota,
    
    check (
    	estado in ('Enviada', 'En Evaluación', 'Aprobada', 'Rechazada')
    )
    
);

-- =========================================================
-- FOREIGN KEYS
-- =========================================================

ALTER TABLE "public"."mascotas" ADD CONSTRAINT "fk_mascotas_responsable" FOREIGN KEY("responsable_id") REFERENCES "public"."personas"("id");
ALTER TABLE "public"."atenciones" ADD CONSTRAINT "fk_atenciones_funcionario" FOREIGN KEY("funcionario_id") REFERENCES "public"."funcionarios"("id");
ALTER TABLE "public"."atenciones" ADD CONSTRAINT "fk_atenciones_acompaniante" FOREIGN KEY("acompaniante_id") REFERENCES "public"."personas"("id");
ALTER TABLE "public"."funcionarios" ADD CONSTRAINT "fk_funcionarios_persona" FOREIGN KEY("persona_id") REFERENCES "public"."personas"("id");
ALTER TABLE "public"."citas" ADD CONSTRAINT "fk_citas_funcionario" FOREIGN KEY("funcionario_id") REFERENCES "public"."funcionarios"("id");
ALTER TABLE "public"."citas" ADD CONSTRAINT "fk_citas_mascota" FOREIGN KEY("mascota_id") REFERENCES "public"."mascotas"("id");
ALTER TABLE "public"."atenciones" ADD CONSTRAINT "fk_atenciones_mascota" FOREIGN KEY("mascota_id") REFERENCES "public"."mascotas"("id");
ALTER TABLE "public"."atenciones" ADD CONSTRAINT "fk_atenciones_cita" FOREIGN KEY("cita_id") REFERENCES "public"."citas"("id");
ALTER TABLE "public"."citas" ADD CONSTRAINT "fk_citas_seguimiento_atencion" FOREIGN KEY("atencion_origen_id") REFERENCES "public"."atenciones"("id");
ALTER TABLE "public"."solicitudes_adopcion" ADD CONSTRAINT "fk_solicitudes_mascota" FOREIGN KEY("mascota_id") REFERENCES "public"."mascotas"("id");
ALTER TABLE "public"."solicitudes_adopcion" ADD CONSTRAINT "fk_solicitudes_postulante" FOREIGN KEY("postulante_id") REFERENCES "public"."personas"("id");
ALTER TABLE "public"."solicitudes_adopcion" ADD CONSTRAINT "fk_solicitudes_funcionario_evaluador" FOREIGN KEY("funcionario_evaluador_id") REFERENCES "public"."funcionarios"("id");
alter table "public"."atencion_procedimientos" add constraint "fk_atencion_procedimientos_procedimiento" foreign key("procedimiento_id") references "public"."procedimientos"("id");
alter table "public"."consultas_medicas" add constraint "fk_consultas_medicas_atencion" foreign key("atencion_id") references "public"."atenciones"("id");
alter table "public"."operativos_esterilizacion" add constraint "fk_operativo_esterilizacion_atencion" foreign key("atencion_id") references "public"."atenciones"("id");
alter table "public"."atencion_procedimientos" add constraint "fk_atencion_procedimientos_atencion" foreign key("atencion_id") references "public"."atenciones"("id");
alter table "public"."implantaciones_microchip" add constraint "fk_implantacion_microchip_atencion" foreign key("atencion_id") references "public"."atenciones"("id");
