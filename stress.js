import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 30 }, // traffic ramp-up from 1 to a higher 30 users over 10s.
    { duration: '30s', target: 30 }, // stay at higher 30 users for 30s
    { duration: '10s', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  },
};

export default () => {
  const res = http.get('http://localhost:8080/ping'); // Endpoint a probar

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response is pong': (r) => r.body === 'pong',
  });

  sleep(1);
};