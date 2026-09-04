export const businessProfilesSchema = `
CREATE TABLE business_profiles (
  user_id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL,
  profile_json TEXT NOT NULL,
  onboarding_complete INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX business_profiles_email_idx ON business_profiles(email);
`;
