/**
 * Generates the Apple client secret JWT required by Supabase for Sign in with Apple.
 * The JWT expires in 6 months — you'll need to regenerate and update Supabase before then.
 *
 * Usage:
 *   node scripts/generate-apple-secret.mjs \
 *     --key-file /path/to/AuthKey_XXXXXXXX.p8 \
 *     --team-id XXXXXXXXXX \
 *     --key-id XXXXXXXXXX \
 *     --client-id com.your.servicesid
 */

import crypto from "node:crypto";
import fs from "node:fs";

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const keyFile = get("--key-file");
const teamId = get("--team-id");
const keyId = get("--key-id");
const clientId = get("--client-id");

if (!keyFile || !teamId || !keyId || !clientId) {
  console.error(`Missing required arguments.

Usage:
  node scripts/generate-apple-secret.mjs \\
    --key-file /path/to/AuthKey_XXXXXXXX.p8 \\
    --team-id YOUR_TEAM_ID \\
    --key-id YOUR_KEY_ID \\
    --client-id YOUR_SERVICES_ID
`);
  process.exit(1);
}

const privateKey = fs.readFileSync(keyFile, "utf8");
const now = Math.floor(Date.now() / 1000);
const exp = now + 86400 * 180; // 6 months

const header = Buffer.from(JSON.stringify({ alg: "ES256", kid: keyId })).toString("base64url");
const payload = Buffer.from(
  JSON.stringify({
    iss: teamId,
    iat: now,
    exp,
    aud: "https://appleid.apple.com",
    sub: clientId,
  })
).toString("base64url");

const signingInput = `${header}.${payload}`;
const sign = crypto.createSign("SHA256");
sign.update(signingInput);
sign.end();

// Apple requires IEEE P1363 (r || s) encoding, not DER
const signature = sign
  .sign({ key: privateKey, dsaEncoding: "ieee-p1363" })
  .toString("base64url");

const jwt = `${signingInput}.${signature}`;

const expiresAt = new Date(exp * 1000).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

console.log("\n✓ Apple client secret JWT generated successfully\n");
console.log("Paste this into Supabase → Auth → Providers → Apple → Secret Key:\n");
console.log(jwt);
console.log(`\n⚠ This JWT expires on ${expiresAt}. Regenerate before then.\n`);
