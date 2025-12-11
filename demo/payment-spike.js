import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },  // Normal load
    { duration: '30s', target: 100 }, // Spike to 100 users
    { duration: '20s', target: 100 }, // Stay at spike
    { duration: '10s', target: 10 },  // Return to normal
    { duration: '30s', target: 10 },  // Normal load recovery
  ],
  thresholds: {
    http_req_failed: ['rate<0.1'], // Allow up to 10% errors during spike
    http_req_duration: ['p(95)<2000'], // 95% under 2s (relaxed for spike)
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
      "amount": Math.floor(Math.random() * 500) + 25,
    }
  };
  
  const res = http.post(
    'http://localhost:8081/v1/payments/payment-sessions', 
    JSON.stringify(paymentSessionRequestPayload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'not server error': (r) => r.status < 500,
    'spike handling OK': (r) => r.timings.duration < 3000,
  });

  sleep(0.5); // Shorter sleep for spike test intensity
}