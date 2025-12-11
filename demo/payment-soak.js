import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 15,            // Sustained load over time
  duration: '10m',    // Long duration soak test  
  thresholds: {
    http_req_failed: ['rate<0.02'], // http errors should be less than 2%
    http_req_duration: ['p(95)<600'], // 95% of requests should be below 600ms
    http_req_duration: ['avg<400'],   // Average response time under 400ms
  },
};

export default function () {
  
  const paymentSessionRequestPayload = {
    "booking": {
      "bookingId": Math.floor(Math.random() * 1000000).toString(),
      "operation": "PAY_BALANCE"
    },
    "paymentSettings": {
      "currency": "GBP",
      "amount": Math.floor(Math.random() * 1500) + 100,
    }
  };
  
  const res = http.post(
    'http://localhost:8081/v1/payments/payment-sessions', 
    JSON.stringify(paymentSessionRequestPayload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'payment session created': (r) => r.status < 400,
    'sustained performance': (r) => r.timings.duration < 800,
  });

  sleep(1.5); // Slightly longer sleep for soak test
}