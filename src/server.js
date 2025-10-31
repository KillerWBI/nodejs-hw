import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import PinoHttp from 'pino-http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(PinoHttp());



app.get('/notes', (req, res) => {
res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteid', (req, res) => {
   const { noteid } = req.params;
   res.status(200).json({ message: `Retrieved note with ID: ${noteid}` });
});

app.get('/test-error', (req, res) => {
    throw new Error('Simulated server error');
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route Not Found' });
} );
app.use((err, req, res, next) => {
    console.error('server error:', err.message);
    res.status(500).json({ message: err.message  });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
