# Prometheus + Grafana Setup for k6-demo

This setup provides monitoring for your Node.js application with Prometheus metrics collection and Grafana visualization.

## Quick Start

1. **Start your Node.js server** (if not already running):
   ```bash
   node server.js
   ```

2. **Start Prometheus and Grafana**:
   ```bash
   docker-compose up -d
   ```

3. **Access the services**:
   - **Your app**: http://localhost:8080
   - **Prometheus**: http://localhost:9090
   - **Grafana**: http://localhost:3000 (admin/admin)

## What's included

- **Prometheus**: Collects metrics from your app every 5 seconds
- **Grafana**: Visualizes metrics with pre-configured Prometheus datasource
- **Persistent storage**: Data is retained between restarts

## Available Metrics

Your app exposes these key metrics at http://localhost:8080/metrics:

### HTTP Metrics
- `http_request_duration_seconds` - Request duration histogram
- `http_requests_total` - Total HTTP requests counter
- `http_request_length_bytes` - Request size histogram
- `http_response_length_bytes` - Response size histogram

### System Metrics
- `process_cpu_*` - CPU usage
- `process_resident_memory_bytes` - Memory usage
- `nodejs_*` - Node.js specific metrics (event loop, heap, GC)

## Useful Prometheus Queries

```promql
# Request rate per second
rate(http_requests_total[5m])

# Average response time
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])

# 95th percentile response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error rate
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])

# Memory usage
process_resident_memory_bytes / 1024 / 1024
```

## Testing with k6

Run your k6 tests while monitoring:
```bash
k6 run ./stress.js
```

Then check the metrics in Grafana or Prometheus to see the impact.

## Cleanup

```bash
docker-compose down -v  # Removes containers and volumes
```