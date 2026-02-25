export async function get() {
  try {
    const date = new Date().toISOString().split("T")[0]; // আজকের তারিখ yyyy-mm-dd
    const latitude = 23.167667;   // আপনার স্থান অনুযায়ী
    const longitude = 88.580833;  // আপনার স্থান অনুযায়ী

    const url = `https://api.prokerala.com/v1/panchang?date=${date}&latitude=${latitude}&longitude=${longitude}`;

    const res = await fetch(url, {
      headers: {
        "X-Client-Id": "আপনার_CLIENT_ID",
        "X-Client-Secret": "আপনার_SECRET_ID"
      }
    });

    const json = await res.json();

    return {
      status: 200,
      body: JSON.stringify(json),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    };
  } catch(err) {
    return {
      status: 500,
      body: JSON.stringify({ status: "error", message: err.message }),
      headers: { "Content-Type": "application/json" }
    };
  }
}
