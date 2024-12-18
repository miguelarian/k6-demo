import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 100 }, // fast ramp-up to a high point
    // No plateau
    { duration: '5s', target: 0 }, // quick ramp-down to 0 users
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'], // http errors should be less than 5%
    http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1s
  },
};

export default () => {
  const res = http.get('http://localhost:8080/ping');
  
  check(res, {
    'status es 200': (r) => r.status === 200,
    'respuesta es pong': (r) => r.body === 'pong',
  });

  sleep(1);
};