# K6 Performance Testing Demo - AI Coding Instructions

## Project Overview
This is a **K6 performance testing demo** with a realistic Express.js server featuring built-in performance degradation and complete monitoring stack. **NOT for production use** - designed for learning and demonstrations.

## Key Architecture Components

### Test Server ([server.js](server.js))
- Express.js API with **progressive performance degradation logic** based on request counter
- Prometheus metrics integration at `/metrics` endpoint  
- **Critical behavior**: Server degrades predictably (0→500 requests: no delay, 500-600: 1s delay, etc.)
- **Failure thresholds**: 900+ requests = 50% failure rate (even-numbered requests), 1000+ = complete collapse
- **Reset endpoint**: `/reset` clears request counter for test isolation

### Performance Test Suite Pattern
Core k6 tests follow consistent structure with **different load profiles** (ignore `payment-session-example.js`):
- **smoke.js**: 5 VUs × 20s (basic functionality)
- **stress.js**: 30 VUs with ramp stages (sustained load)  
- **spike.js**: Fast ramp to 100 VUs (sudden traffic spikes)
- **soak.js**: 15 VUs × 90s (endurance testing)

### Test Configuration Standards
```javascript
// Standard thresholds across all tests
thresholds: {
  http_req_failed: ['rate<0.01'], // < 1% errors (relaxed for spike tests)
  http_req_duration: ['p(95)<500'], // 95th percentile response time
}
```

## Development Workflows

### Running Performance Tests
```bash
# Start server first (always required)
node server.js

# Run specific test types
k6 run smoke.js      # Basic functionality check
k6 run stress.js     # Load capacity testing  
k6 run spike.js      # Traffic spike simulation
k6 run soak.js       # Endurance testing

# Reset server state between tests
curl http://localhost:8080/reset
```

### Monitoring Stack Setup
```bash
# Start Prometheus + Grafana monitoring
docker-compose up -d

# Access points:
# - App metrics: http://localhost:8080/metrics
# - Prometheus: http://localhost:9090  
# - Grafana: http://localhost:3000 (admin/admin)
```

## Project-Specific Patterns

### Test Endpoint Convention
- All tests target `http://localhost:8080/ping` (returns "pong")
- Use consistent check patterns: `'status es 200'` and `'respuesta es pong'`
- Standard `sleep(1)` between iterations for realistic user behavior

### Server State Management
- **Request counter** drives performance degradation - critical for test predictability
- Always call `/reset` between test runs to ensure consistent baseline
- Monitor `/counter` endpoint to track current request state

### Prometheus Integration
- Custom duration buckets optimized for app's delay patterns: `[0.01, 0.05, 0.1, 0.25, 0.5, 1, 1.5, 2, 3, 5, 10]`
- Metrics collected every 5 seconds via docker-compose setup
- Pre-configured Grafana dashboards in `grafana/provisioning/dashboards/`

## Code Modification Guidelines

### Adding New Test Types
- Follow existing file naming: `{testtype}.js`
- Use appropriate VU counts based on server degradation thresholds (<500 for clean runs, >900 to test failure scenarios)
- Maintain consistent `options` structure and threshold patterns

### Server Performance Logic
- Delay constants clearly defined at top of [server.js](server.js#L7-L18)
- Modification requires updating both delay logic and README's performance graph
- Even/odd request failure logic starts at 900+ requests

### Monitoring Extensions  
- Dashboard JSON files in `grafana/provisioning/dashboards/`
- Prometheus config in [prometheus.yml](prometheus.yml) for scraping intervals
- Docker volumes persist monitoring data between restarts