// Token encryption helpers — Web Crypto (AES-GCM). The key comes from the
// OAUTH_ENCRYPTION_KEY Worker secret; never hardcode or commit a key.
export async function encryptToken(keyMaterial, plaintext) {
  const key = await crypto.subtle.importKey("raw", keyMaterial, "AES-GCM", false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext));
  return { iv: [...iv], ciphertext: [...new Uint8Array(data)] };
}
export async function decryptToken(keyMaterial, iv, ciphertext) {
  const key = await crypto.subtle.importKey("raw", keyMaterial, "AES-GCM", false, ["decrypt"]);
  const data = await crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(iv) }, key, new Uint8Array(ciphertext));
  return new TextDecoder().decode(data);
}
