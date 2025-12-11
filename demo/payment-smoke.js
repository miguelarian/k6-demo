import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 3,             // Light load for smoke testing
  duration: '30s',    
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<300'], // 95% of requests should be below 300ms
  },
};

export default function () {
  
  const paymentSessionRequestPayload = {
    "booking": {
      "bookingId": Math.floor(Math.random() * 1000000).toString(), // Random booking ID
      "operation": "PAY_BALANCE"
    },
    "paymentSettings": {
      "currency": "GBP",
      "amount": Math.floor(Math.random() * 1000) + 10, // Random amount between 10-1010
    }
  };
  
  const res = http.post(
    'http://localhost:8081/v1/payments/payment-sessions', 
    JSON.stringify(paymentSessionRequestPayload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'payment session created': (r) => r.status < 400,
    'response time OK': (r) => r.timings.duration < 300,
  });

  sleep(1);
}