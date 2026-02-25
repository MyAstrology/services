// src/pages/api/panchang.js
export async function get() {
  try {
    // মূল API থেকে ডাটা fetch
    const res = await fetch("https://panchang-api.bipulbala64.workers.dev/");
    const json = await res.json();

    return {
      status: 200,
      body: JSON.stringify(json),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"  // CORS safe
      }
    };
  } catch (err) {
    return {
      status: 500,
      body: JSON.stringify({ status: "error", message: err.message }),
      headers: { "Content-Type": "application/json" }
    };
  }
}
