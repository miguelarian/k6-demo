import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 20 }, // Ramp up to 20 users over 15 seconds
    { duration: '30s', target: 20 }, // Stay at 20 users for 30 seconds
    { duration: '15s', target: 40 }, // Ramp up to 40 users over 15 seconds  
    { duration: '20s', target: 40 }, // Stay at 40 users for 20 seconds
    { duration: '10s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'], // http errors should be less than 5%
    http_req_duration: ['p(95)<800'], // 95% of requests should be below 800ms
    http_req_duration: ['p(99)<1200'], // 99% of requests should be below 1.2s
  },
};

export default function () {
  
  const paymentSessionRequestPayload = {
    "booking": {
      "bookingId": Math.floor(Math.random() * 1000000).toString(),
      "operation": Math.random() > 0.5 ? "PAY_BALANCE" : "PAY_DEPOSIT" // Mix operations
    },
    "paymentSettings": {
      "currency": Math.random() > 0.7 ? "EUR" : "GBP", // Mix currencies
      "amount": Math.floor(Math.random() * 2000) + 50,
    }
  };
  
  const res = http.post(
    'http://localhost:8081/v1/payments/payment-sessions', 
    JSON.stringify(paymentSessionRequestPayload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'payment session created': (r) => r.status < 400,
    'response time acceptable': (r) => r.timings.duration < 1000,
  });

  sleep(Math.random() * 2 + 0.5); // Random sleep between 0.5-2.5s
}