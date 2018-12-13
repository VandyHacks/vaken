import express from 'express';

import helmet from 'helmet'; // good default security config
import cors from 'cors';
import router from './routes/router';
import bodyParser from 'body-parser';

// todo: put in config file
const whitelist = ['vandyhacks.org'];
const corsOptions = {
  origin(origin: string, callback: Function) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// create server
const app = express();
app.use(helmet());

// can also put over individual routes, with cors-preflight
app.use(cors(corsOptions));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(router);

// todo put in config
const PORT: Number = parseInt(process.env.PORT || '8000', 10);

// start server
app.listen(PORT, () => console.log(`Server running on ${PORT}!`));
