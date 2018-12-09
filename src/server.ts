import express from 'express';
import router from './routes/router';
// create server
const app = express();
app.use(router);

// todo put in config
const PORT : Number = parseInt(process.env.PORT || '8000', 10);

// start server
app.listen(PORT, () => console.log(`Server running on ${PORT}!`));
