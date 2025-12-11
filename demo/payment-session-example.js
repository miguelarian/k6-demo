import http from 'k6/http';
import { sleep, check } from 'k6';

// https://payment-sessions.paymentsdev.ejholidays.ejcloud.net/swagger
 
export const options = {
  vus: 1,             // Key for Smoke test. Keep it at 2, 3, max 5 VUs
  duration: '1s',    // This can be shorter or just a few iterations
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(99)<200'], // 99% of requests should be below 200ms
  },
};

export default function () {
  
  const paymentSessionRequestPayload = {
  "booking": {
    "bookingId": "50763820",
    "operation": "PAY_BALANCE"
  },
  "paymentSettings": {
    "currency": "GBP",
    "amount": 55.5,
  }
};
  
  const res = http.post(
    'http://localhost:8081/v1/payments/payment-sessions', 
    JSON.stringify(paymentSessionRequestPayload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response is pong': (r) => r.body === 'pong',
  });

  sleep(1);
}