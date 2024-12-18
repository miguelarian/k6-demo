const express = require('express');
const prometheusMiddleware = require('express-prometheus-middleware');

const app = express();
const PORT = 8080;

// Aplication breakpoint: (more requests, the app breaks)
const BREAKPOINT_LIMIT = 1000;
const DEGRADATION_POINT_1 = 500; // 1s
const DELAY_1 = 1000;
const DEGRADATION_POINT_2 = 600; // 1.5s
const DELAY_2 = 1500;
const DEGRADATION_POINT_3 = 700; // 2s
const DELAY_3 = 2000;
const DEGRADATION_POINT_4 = 800; // 3s
const DELAY_4 = 3000;
const DEGRADATION_POINT_5 = 900; // 5s
const DELAY_5 = 5000;

function getDelay(requestsCount) {
  if (requestsCount <= DEGRADATION_POINT_1) {
    return 0;
  } else if (requestsCount <= DEGRADATION_POINT_2) {
    return DELAY_1;
  } else if (requestsCount <= DEGRADATION_POINT_3) {
    return DELAY_2;
  } else if (requestsCount <= DEGRADATION_POINT_4) {
    return DELAY_3;
  } else if (requestsCount <= DEGRADATION_POINT_5) {
    return DELAY_4;
  } else {
    return DELAY_5;
  }
}

function isEvenNumber(number) {
  return number % 2 == 0
}

let requestsCounter = 0;

// Middleware de Prometheus
app.use(
  prometheusMiddleware({
    metricsPath: '/metrics', // Ruta donde Prometheus recolectará métricas
    collectDefaultMetrics: true, // Métricas predeterminadas del sistema
    requestDurationBuckets: [0.1,1,2,3,4,5], // Buckets para la duración de las solicitudes
  })
);

app.get('/ping', (req, res) => {
  requestsCounter++;
  let delay = getDelay(requestsCounter);
  console.log(`ping request received ${requestsCounter} - delay: ${delay}`);
  
  setTimeout(() => {
    if (requestsCounter >= BREAKPOINT_LIMIT) {
      res.status(500).send(`KO - Server collapsed: ${requestsCounter}`);
    }
    else if (requestsCounter >= DEGRADATION_POINT_5 && isEvenNumber(requestsCounter)) 
    {
      res.status(500).send(`KO - Not even request: ${requestsCounter}`);
    }
    else {
      res.status(200).send('pong');
    }
  }, delay);
});

app.get('/reset', (req, res) => {
  console.log("reset status");
  requestsCounter = 0;
  res.status(200).send(`Request counter: ${requestsCounter}`);
});

app.get('/counter', (req, res) => {
  res.status(200).send(`Request counter: ${requestsCounter}`);
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
