CREATE TABLE IF NOT EXISTS theater_play (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    active BOOLEAN NOT NULL,
    location VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    price_eur NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS performance (
    id BIGSERIAL PRIMARY KEY,
    theater_play_id BIGINT NOT NULL REFERENCES theater_play(id) ON DELETE CASCADE,
    date VARCHAR(64) NOT NULL,
    time VARCHAR(64) NOT NULL,
    available_tickets INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_theater_play_active ON theater_play(active);
CREATE INDEX IF NOT EXISTS idx_performance_theater_play ON performance(theater_play_id);
