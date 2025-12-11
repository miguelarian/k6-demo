# 🎯 K6 Performance Testing Demo Guide

## Quick Demo Setup

### 1. **Interactive Demo Script**
```bash
./demo.sh
```
This script provides a menu-driven interface to run different test types with colored output and clear explanations.

### 2. **Individual Test Commands**
```bash
# Smoke Test - Basic functionality check  
k6 run payment-smoke.js

# Stress Test - Load capacity testing
k6 run payment-stress.js

# Spike Test - Traffic spike simulation  
k6 run payment-spike.js

# Soak Test - Endurance testing
k6 run payment-soak.js
```

## 🎨 Nice Result Display Options

### **Option 1: Real-time Terminal Output**
```bash
# Enhanced terminal output with summary
k6 run --summary-trend-stats="avg,min,med,max,p(90),p(95),p(99)" payment-stress.js

# Quiet mode for clean output
k6 run --quiet payment-smoke.js
```

### **Option 2: JSON Output + Analysis**
```bash
# Generate JSON results
k6 run --out json=stress-results.json payment-stress.js

# Analyze results with custom script
node analyze-results.js stress-results.json
```

### **Option 3: Real-time Monitoring (Best for Demos!)**
```bash
# Start monitoring stack
docker-compose up -d

# Access Grafana: http://localhost:3000 (admin/admin)
# Run tests and watch live dashboards
k6 run payment-stress.js
```

### **Option 4: CSV Export for Spreadsheets**
```bash
k6 run --out csv=results.csv payment-stress.js
```

### **Option 5: Web Dashboard (Premium Feature)**  
```bash
# For k6 Cloud users
k6 run --out cloud payment-stress.js
```

## 🎪 Demo Scenarios

### **Scenario 1: Progressive Testing**
```bash
echo "🔥 Progressive Load Testing Demo"

# Start light
k6 run payment-smoke.js

# Increase load  
k6 run payment-stress.js

# Test limits
k6 run payment-spike.js
```

### **Scenario 2: Before/After Comparison**
```bash
# Baseline test
k6 run --out json=before.json payment-stress.js

# Make code changes...

# Comparison test  
k6 run --out json=after.json payment-stress.js

# Compare results
node analyze-results.js before.json after.json
```

### **Scenario 3: Live Demo with Monitoring**
```bash
# Setup (run once)
docker-compose up -d

# Open browser tabs:
# - http://localhost:3000 (Grafana)
# - Terminal with k6

# Run test while showing Grafana
k6 run payment-stress.js
```

## 📊 Key Metrics to Highlight

### **Response Time Metrics**
- `http_req_duration` - Response time percentiles
- `http_req_waiting` - Time to first byte  
- `http_req_connecting` - Connection establishment time

### **Throughput Metrics**
- `http_reqs` - Requests per second
- `vus` - Virtual users over time
- `iterations` - Completed iterations

### **Error Metrics**  
- `http_req_failed` - Error rate percentage
- `checks` - Functional test results

## 🎯 Demo Tips

### **Visual Appeal**
1. **Use colors** - The demo script includes colored output
2. **Show graphs** - Grafana provides real-time visualizations  
3. **Clear narration** - Explain what each test validates
4. **Progressive complexity** - Start simple, build up

### **Technical Highlights**
1. **Realistic load patterns** - Ramp up/down stages  
2. **Varied data** - Random booking IDs, amounts, currencies
3. **Meaningful checks** - Business logic validation
4. **Performance thresholds** - SLA compliance testing

### **Storytelling Elements**
1. **Business context** - "Payment processing under load"
2. **Risk scenarios** - "What happens during Black Friday?"  
3. **Optimization journey** - "Before and after improvements"
4. **Capacity planning** - "How many users can we handle?"

## 🚀 Advanced Demo Features

### **Custom HTML Report**
```bash
k6 run --out json=results.json payment-stress.js
# Use k6-reporter or custom HTML generator
```

### **Slack/Teams Integration**  
```bash
# Send results to team channels
k6 run --out statsd payment-stress.js
```

### **CI/CD Pipeline Demo**
```bash
# Show automated testing in build pipeline
k6 run --threshold http_req_failed=rate<0.01 payment-smoke.js
```

---

**🎉 Ready to demo! Start with `./demo.sh` for the best experience.**