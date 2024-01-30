const { Novu } = require("@novu/node");
const novu = new Novu(process.env.NEXT_PUBLIC_NOVU_API_KEY);

export default async function handler(req, res) {
    try {
        const { status, title, username } = req.body;
        const response = await novu.trigger("in-apps", {
            to: {
                subscriberId: process.env.NEXT_PUBLIC_NOVU_SUBSCRIBER_ID,
            },
            payload: {
                status,
                title,
                username,
            },
        });

        if (response && response.data) {
            res.status(200).json(response.data);
        } else {
            console.error("Unexpected response from Novu API:", response);
            res.status(500).json({ error: 'Unexpected response from Novu API' });
        }
    } catch (err) {
        if (err.response && err.response.status === 422) {
            // Handle validation errors from the API
            console.error("Validation errors from Novu API:", err.response.data);
            res.status(422).json({ error: 'Validation failed', details: err.response.data });
        } else {
            // Handle other errors
            console.error("An error occurred while making the request to Novu API:", err);
            res.status(500).json({ error: 'An error occurred while making the request to Novu API' });
        }
    }
}
