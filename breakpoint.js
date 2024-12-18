import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 1000 }, // just slowly ramp-up to a HUGE load
  ],
};

export default () => {
  const res = http.get('http://localhost:8080/ping');
  
  check(res, {
    'status es 200': (r) => r.status === 200,
    'respuesta es pong': (r) => r.body === 'pong',
  });
  
  sleep(1);
};