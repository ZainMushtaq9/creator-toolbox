import { envelope } from "../utils/envelope.js";
// Public, static tool catalogue metadata (no private data).
export function toolsConfigHandler() {
  return envelope({
    version: 1,
    tools: 41,
    categories: ["youtube-tools", "instagram-tools", "tiktok-tools", "image-tools", "text-tools", "calculator-tools"],
    note: "The tools run in the browser. This endpoint only describes them; it does not process tool input."
  });
}
