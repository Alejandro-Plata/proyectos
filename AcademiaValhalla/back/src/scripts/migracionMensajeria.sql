-- Migración: Mensajería multimedia + grupos
-- Idempotente: usa ADD COLUMN IF NOT EXISTS
-- Se aplica automáticamente en dev via db.sync({ alter: true })
-- Ejecutar manualmente en producción si es necesario.

-- conversations: soporte para grupos
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_group   BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS name       VARCHAR(100);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(user_id);

-- conversation_participants: roles
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_conversation_participants_role') THEN
        CREATE TYPE enum_conversation_participants_role AS ENUM ('owner', 'admin', 'member');
    END IF;
END$$;
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS role VARCHAR(10) NOT NULL DEFAULT 'member';

-- messages: tipo de mensaje + adjuntos
ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type    VARCHAR(10) NOT NULL DEFAULT 'text';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachment_url  VARCHAR(500);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachment_meta JSONB;
ALTER TABLE messages ALTER COLUMN content DROP NOT NULL;
