// pages/api/ic.js
import connectDb from '@/lib/connectDB';
import IC from '@/models/icModel';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectDb();

      const newIC = await IC.create(req.body);

      res.status(201).json(newIC);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error submitting IC form' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
