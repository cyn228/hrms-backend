import router from './api/router';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { init } from './api/notifications';

const app = express();
const port = process.env.PORT || 4000;

// Enable cors
app.use(cors());

// Add json parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.use((request, response, next) => {
	// logging
	console.log('Router triggered');
	next();
});

// Healthcheck
app.get('/', (request, response) => {  
  response.send('Hello from Express!');
});

// Register Router
app.use('/api', router);

const server = app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`)
});

init(server);
