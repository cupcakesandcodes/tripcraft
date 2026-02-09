// src/service/AIModel.js
import { GoogleGenerativeAI } from "@google/generative-ai"

const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY

if (!API_KEY) {
  console.error("❌ Missing VITE_GOOGLE_GEMINI_AI_API_KEY in .env")
}

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

export async function generateAIResponse(prompt) {
  try {
    console.log("🔔 [AI MODEL] Sending prompt (len):", prompt?.length ?? 0)

    const result = await model.generateContent(prompt)

    // Very verbose logging — we want to see everything the SDK returns
    console.log("🔔 [AI MODEL] RAW result object:", result)

    // Best-effort extraction: join parts into one string (handles multiple parts)
    let text = null

    try {
      if (typeof result?.response?.text === "function") {
        text = result.response.text()
      }
    } catch (e) {
      // ignore
    }

    if (!text) {
      const parts = result?.response?.candidates?.[0]?.content?.parts
      if (Array.isArray(parts)) {
        text = parts
          .map((p) => p?.text || "")
          .join("\n")
          .trim()
      }
    }

    // fallback
    text = text || result?.text || null

    console.log(
      "🔔 [AI MODEL] Extracted text (preview 1000 chars):",
      (text || "").slice(0, 1000)
    )
    if (!text) {
      return { ok: false, error: "empty_response", raw: result }
    }

    return { ok: true, text, raw: result }
  } catch (err) {
    console.error("🔴 [AI MODEL] generateAIResponse threw:", err)
    return { ok: false, error: err?.message || String(err), raw: err }
  }
}
