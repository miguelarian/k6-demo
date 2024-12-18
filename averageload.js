import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 15 },  // traffic ramp-up from 1 to 15 users over 10s.
    { duration: '30s', target: 15 },  // stay at 15 users for 30s
    { duration: '10s', target: 0 },   // ramp-down to 0 users
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(99)<200'], // 99% of requests should be below 200ms
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