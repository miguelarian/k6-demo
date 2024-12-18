import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 5,             // Key for Smoke test. Keep it at 2, 3, max 5 VUs
  duration: '20s',    // This can be shorter or just a few iterations
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(99)<200'], // 99% of requests should be below 200ms
  },
};

export default function () {
  const res = http.get('http://localhost:8080/ping');

  check(res, {
    'status es 200': (r) => r.status === 200,
    'respuesta es pong': (r) => r.body === 'pong',
  });

  sleep(1);
}