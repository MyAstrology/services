const fs = require('fs');

// GitHub Secrets থেকে API Key নেওয়া হচ্ছে
const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = 'আপনার_PLACE_ID_এখানে_দিন'; // আপনার দোকানের Place ID

async function getReviews() {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${GOOGLE_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK") {
            // রিভিউগুলো reviews.json ফাইলে সেভ করা হচ্ছে
            fs.writeFileSync('services/reviews.json', JSON.stringify(data.result.reviews, null, 2));
            console.log("Reviews updated successfully!");
        } else {
            console.error("Error from Google:", data.error_message || data.status);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

getReviews();
