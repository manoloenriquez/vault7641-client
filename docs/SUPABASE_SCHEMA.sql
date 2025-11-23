-- Supabase Schema for NFT Regeneration Logs
-- Run this SQL in your Supabase SQL Editor to create the logging table

-- Create regeneration logs table
CREATE TABLE IF NOT EXISTS nft_regeneration_logs (
  id BIGSERIAL PRIMARY KEY,
  token_id INTEGER NOT NULL,
  nft_mint TEXT NOT NULL,
  guild TEXT NOT NULL,
  gender TEXT NOT NULL,
  seed BIGINT,
  metadata_uri TEXT NOT NULL,
  image_uri TEXT,
  transaction_signature TEXT NOT NULL,
  wallet_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_regeneration_logs_token_id ON nft_regeneration_logs(token_id);
CREATE INDEX IF NOT EXISTS idx_regeneration_logs_nft_mint ON nft_regeneration_logs(nft_mint);
CREATE INDEX IF NOT EXISTS idx_regeneration_logs_wallet_address ON nft_regeneration_logs(wallet_address);
CREATE INDEX IF NOT EXISTS idx_regeneration_logs_created_at ON nft_regeneration_logs(created_at DESC);

-- Create a view for latest regeneration per NFT
CREATE OR REPLACE VIEW latest_regenerations AS
SELECT DISTINCT ON (nft_mint)
  *
FROM nft_regeneration_logs
ORDER BY nft_mint, created_at DESC;

-- Optional: Enable Row Level Security (RLS)
-- ALTER TABLE nft_regeneration_logs ENABLE ROW LEVEL SECURITY;

-- Optional: Create policy for service role (allows server-side access)
-- CREATE POLICY "Service role can manage regeneration logs"
--   ON nft_regeneration_logs
--   FOR ALL
--   USING (auth.role() = 'service_role');

-- Grant permissions (adjust as needed)
-- GRANT ALL ON nft_regeneration_logs TO service_role;
-- GRANT SELECT ON nft_regeneration_logs TO authenticated;

COMMENT ON TABLE nft_regeneration_logs IS 'Logs all NFT art regeneration events for audit and persistence';
COMMENT ON COLUMN nft_regeneration_logs.seed IS 'Random seed used for trait selection (for reproducibility)';
COMMENT ON COLUMN nft_regeneration_logs.transaction_signature IS 'Solana transaction signature for the metadata update';

