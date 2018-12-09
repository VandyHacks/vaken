import express from 'express';
import * as apiController from "./controllers/api";

const app = express();

// todo put in config
const PORT = 8000;

app.get('/', (req, res) => {
  res.send('hello world');
});

app.get("/api", apiController.getApi);

app.listen(PORT, () => console.log(`Server running on ${PORT}!`));
