import express from "express";

const app = express()

// todo put in config
const PORT = 8000
app.listen(PORT, () => console.log(`Server running on ${PORT}!`))