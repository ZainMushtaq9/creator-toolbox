import { envelope } from "../utils/envelope.js";
export function healthHandler(env) {
  return envelope({ status: "ok", service: "creator-toolbox-api", version: "0.1.0", db: Boolean(env?.DB), time: new Date().toISOString() });
}
