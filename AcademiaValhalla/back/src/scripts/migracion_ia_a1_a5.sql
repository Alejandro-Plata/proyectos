-- ============================================================
-- Migración para las funciones de IA A1–A5
-- Ejecutar una vez sobre la base de datos.
-- ============================================================

-- A1 · Mentor con memoria ------------------------------------
CREATE TABLE IF NOT EXISTS learning_profiles (
    user_id            UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    languages          JSONB        NOT NULL DEFAULT '{}',   -- { "javascript": 0.7 }
    concepts_seen      JSONB        NOT NULL DEFAULT '[]',   -- ["closures","recursion"]
    recurring_errors   JSONB        NOT NULL DEFAULT '[]',   -- [{ "tag":"off-by-one","count":4 }]
    session_summaries  JSONB        NOT NULL DEFAULT '[]',   -- [{ "at":"...","text":"..." }]
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- §0.2 · Índice FTS para recuperación de apuntes (RAG fase 1)
CREATE INDEX IF NOT EXISTS idx_notes_fts
    ON user_notes
    USING GIN (to_tsvector('spanish', coalesce(title,'') || ' ' || coalesce(summary,'')));

-- A2 · Forja de retos ----------------------------------------
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS generated_by_ai BOOLEAN     DEFAULT false;
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS generated_for   UUID        REFERENCES users(user_id);
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS test_cases      JSONB       DEFAULT '[]';

-- A4 · Caza del Troll ----------------------------------------
CREATE TABLE IF NOT EXISTS troll_hunts (
    hunt_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID REFERENCES users(user_id) ON DELETE CASCADE,
    language         VARCHAR(50)  NOT NULL,
    original_code    TEXT         NOT NULL,
    buggy_code       TEXT         NOT NULL,
    bug_line         INTEGER      NOT NULL,
    bug_explanation  TEXT         NOT NULL,
    solved           BOOLEAN      NOT NULL DEFAULT false,
    duration_ms      INTEGER,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);
