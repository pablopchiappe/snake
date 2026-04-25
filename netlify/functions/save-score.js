import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler(event) {

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { name, score, level } = body;

    // Validaciones
    if (!name || typeof score !== "number" || typeof level !== "number") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid data" })
      };
    }

    if (score < 0 || score > 100000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid score" })
      };
    }

    const cleanName = name.substring(0, 20);
    const min = level * 50;
    const max = level * 150;

    if(score < min || score > max){
      return {
        statusCode: 400,
        body: "cheat detected"
      };
    }
    const m=42;
    let v=m*score;
    const { error } = await supabase
      .from("scores")
      .insert([
        { player: cleanName, score, level, v}
      ]);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
    
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}