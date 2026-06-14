-- ============================================================
-- Migración para la función de IA A7 · Sagas de aprendizaje
-- (El esquema también se crea solo con db.sync({ alter: true }).)
-- ============================================================

CREATE TABLE IF NOT EXISTS sagas (
    saga_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    goal        TEXT NOT NULL,
    title       VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saga_milestones (
    milestone_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    saga_id      UUID NOT NULL REFERENCES sagas(saga_id) ON DELETE CASCADE,
    position     INTEGER NOT NULL,
    type         VARCHAR(20) NOT NULL,        -- 'note' | 'challenge' | 'project' | 'checkpoint'
    ref_id       UUID,                        -- note_id / challenge_id si aplica
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    status       VARCHAR(20) NOT NULL DEFAULT 'pending'  -- 'pending' | 'done' | 'skipped'
);

CREATE INDEX IF NOT EXISTS idx_saga_milestones_saga ON saga_milestones(saga_id);
