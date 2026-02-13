import crypto from "node:crypto";

export function sha256Base64Url(input: string) {
  return crypto.createHash("sha256").update(input, "utf8").digest("base64url");
}

export function randomToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString("base64url");
}
