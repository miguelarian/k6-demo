# K6 Performance Testing Demo 🚀

A comprehensive K6 performance testing demonstration repository featuring a realistic Express.js server with built-in performance degradation simulation and a complete suite of performance tests.

## 🎯 Purpose

This project demonstrates different types of performance testing methodologies using K6, providing hands-on examples for learning and presentation purposes. **Do not use this code for production.**

## 🏗️ Project components

### Test Server (`server.js`)
- **Express.js API** with Prometheus metrics integration
- **Progressive performance degradation logic** based on request count
- **Realistic failure scenarios** including server collapse at high load
- **Monitoring endpoints** for observability

#### Performance Degradation Logic:
- **0-500 requests**: No delay
- **500-600 requests**: 1s delay
- **600-700 requests**: 1.5s delay  
- **700-800 requests**: 2s delay
- **800-900 requests**: 3s delay
- **900+ requests**: 5s delay + **intermittent failures** (even-numbered requests return 500 errors)
- **1000+ requests**: Complete server collapse (all requests return 500 errors)

```
Response Time & Error Rate vs Request Count
                                    
5s ┤                               ████████████████
   │                               █ ⚡ 50% errors
3s ┤                         ██████  (even requests)
   │                         █
2s ┤                   ██████
   │                   █
1.5s┤             ██████
   │             █
1s ┤       ██████
   │       █
0s ┤███████                                    💥 100% errors
   └─┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬──────►
     0    500   600   700   800   900  1000  1100   Requests
     │     │     │     │     │     │     │
     ✅    ⚠️     ⚠️     🔥    🔥    ⚡    💀
   Perfect Slow  Slower Very  Slower Flaky Dead
           Start  ing    Slow   est   Fails
```

**Key Behavior Points:**
- **900+ requests**: Server becomes **unreliable** - even-numbered requests (902, 904, 906...) return 500 errors
- **1000+ requests**: **Complete failure** - all requests return 500 errors
- **Intermittent failures** make this particularly interesting for testing error handling and retry logic

#### Available Endpoints:
- `GET /ping` - Main test endpoint (returns "pong")
- `GET /reset` - Reset request counter to 0
- `GET /counter` - Check current request count  
- `GET /metrics` - Prometheus metrics for monitoring

### Performance Test Suite

Complete implementation of the K6 testing pyramid with 6 different test types:

#### 🔍 **Smoke Test** (`smoke.js`)
- **Purpose**: Basic functionality validation
- **Load**: 5 VUs for 20 seconds
- **Thresholds**: <1% errors, 99% requests under 200ms
- **Use case**: Verify system works before deeper testing

#### 📈 **Average Load Test** (`averageload.js`)
- **Purpose**: Test normal expected traffic patterns
- **Load**: Ramp to 15 users over 50 seconds
- **Thresholds**: <1% errors, 99% requests under 200ms
- **Use case**: Baseline performance under typical load

#### 💪 **Stress Test** (`stress.js`)
- **Purpose**: Test beyond normal capacity
- **Load**: Ramp to 30 users (double average load)
- **Thresholds**: <1% errors, 95% requests under 500ms
- **Use case**: Find performance degradation point

#### 🕰️ **Soak Test** (`soak.js`)
- **Purpose**: Long-term stability testing
- **Load**: 15 users for 90+ seconds
- **Thresholds**: <1% errors, 95% requests under 200ms
- **Use case**: Detect memory leaks and gradual degradation

#### ⚡ **Spike Test** (`spike.js`)
- **Purpose**: Test sudden traffic bursts
- **Load**: Rapid ramp to 100 users, quick ramp-down
- **Thresholds**: <5% errors, 95% requests under 1s
- **Use case**: Verify auto-scaling and burst handling

#### 🔥 **Breakpoint Test** (`breakpoint.js`)
- **Purpose**: Find system breaking point
- **Load**: Gradual ramp to 1000 users
- **Thresholds**: None (expect failure)
- **Use case**: Determine maximum system capacity

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- K6 installed ([Installation guide](https://grafana.com/docs/k6/latest/set-up/install-k6/))

### Setup and Run

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd k6-demo
   npm install
   ```

2. **Start the test server**:
   ```bash
   npm start
   # Server runs on http://localhost:8080
   ```

3. **Run performance tests** (in a new terminal):
   ```bash
   # Basic smoke test (always start here)
   k6 run smoke.js
   
   # Progressive testing
   k6 run averageload.js
   k6 run stress.js
   k6 run soak.js
   k6 run spike.js
   
   # Find breaking point (expect failures)
   k6 run breakpoint.js
   ```

4. **Reset server state between tests**:
   ```bash
   curl http://localhost:8080/reset
   ```

## 🛠️ Advanced Usage

### Custom Test Configuration
Modify test parameters in each `.js` file:
- `vus`: Number of virtual users
- `duration`: Test duration
- `stages`: Load ramping pattern
- `thresholds`: Pass/fail criteria

### Monitoring and Metrics
- **Prometheus metrics**: `http://localhost:8080/metrics`
- **Request counter**: `http://localhost:8080/counter`  
- **Reset state**: `http://localhost:8080/reset`

### Expected Behavior
Based on server configuration, expect:
- ✅ **Smoke & Average Load**: Should pass consistently
- ⚠️ **Stress Test**: May start failing thresholds around 500+ requests
- 💥 **Spike & Breakpoint**: Will demonstrate server limits and failures

## 🔧 Troubleshooting

**Server not responding?**
- Check if server is running: `curl http://localhost:8080/ping`
- Reset server state: `curl http://localhost:8080/reset`

**Tests failing unexpectedly?**
- Reset request counter between tests
- Check server logs for degradation messages
- Verify K6 installation: `k6 version`