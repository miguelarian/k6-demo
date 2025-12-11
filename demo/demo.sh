#!/bin/bash

# K6 Payment Performance Testing Demo Script
# Run this script to demonstrate different testing scenarios with nice output

echo "🚀 K6 Payment Performance Testing Demo"
echo "======================================"

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to show test info
show_test_info() {
    echo -e "\n${BLUE}📊 Running: $1${NC}"
    echo -e "${YELLOW}Description: $2${NC}"
    echo -e "${YELLOW}Expected: $3${NC}"
    echo "----------------------------------------"
}

# Check if payment service is running
echo -e "\n${BLUE}🔍 Checking payment service...${NC}"
if curl -s http://localhost:8081/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Payment service is running${NC}"
else
    echo -e "${RED}❌ Payment service not running on port 8081${NC}"
    echo "Please start your payment service first!"
    exit 1
fi

echo -e "\n${BLUE}📋 Available Demo Options:${NC}"
echo "1. Smoke Test (Basic functionality check)"
echo "2. Stress Test (Load capacity testing)"  
echo "3. Spike Test (Traffic spike simulation)"
echo "4. Soak Test (Endurance testing)"
echo "5. All Tests (Run complete test suite)"
echo "6. Real-time Monitoring Setup"

read -p "Choose test type (1-6): " choice

case $choice in
    1)
        show_test_info "Smoke Test" "Light load verification" "All requests should pass with low latency"
        k6 run --out json=smoke-results.json payment-smoke.js
        ;;
    2)
        show_test_info "Stress Test" "Gradual load increase" "System should handle increasing load gracefully"
        k6 run --out json=stress-results.json payment-stress.js
        ;;
    3)
        show_test_info "Spike Test" "Sudden traffic burst" "System should survive traffic spikes"
        k6 run --out json=spike-results.json payment-spike.js
        ;;
    4)
        show_test_info "Soak Test" "Extended duration load" "No memory leaks or performance degradation"
        k6 run --out json=soak-results.json payment-soak.js
        ;;
    5)
        echo -e "\n${GREEN}🔄 Running Complete Test Suite${NC}"
        
        show_test_info "1/4 Smoke Test" "Basic functionality" "Baseline performance check"
        k6 run --quiet payment-smoke.js
        
        show_test_info "2/4 Stress Test" "Load testing" "Finding capacity limits"  
        k6 run --quiet payment-stress.js
        
        show_test_info "3/4 Spike Test" "Burst testing" "Resilience under pressure"
        k6 run --quiet payment-spike.js
        
        show_test_info "4/4 Soak Test" "Endurance testing" "Long-term stability"
        k6 run --quiet payment-soak.js
        
        echo -e "\n${GREEN}✅ Complete test suite finished!${NC}"
        ;;
    6)
        echo -e "\n${BLUE}🖥️  Setting up Real-time Monitoring${NC}"
        echo "Starting Prometheus and Grafana..."
        docker-compose up -d
        
        echo -e "\n${GREEN}🎯 Monitoring Setup Complete!${NC}"
        echo -e "${YELLOW}Access Points:${NC}"
        echo "• Grafana Dashboard: http://localhost:3000 (admin/admin)"
        echo "• Prometheus Metrics: http://localhost:9090"
        echo "• Payment Service: http://localhost:8081"
        echo ""
        echo -e "${BLUE}💡 Pro Tip:${NC} Run tests with monitoring for visual results:"
        echo "k6 run --out influxdb=http://localhost:8086/k6 payment-stress.js"
        ;;
    *)
        echo -e "${RED}Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}🎉 Demo completed!${NC}"
echo -e "${BLUE}📊 For detailed analysis, check:${NC}"
echo "• Console output above"
echo "• JSON result files (if generated)" 
echo "• Grafana dashboards (if monitoring enabled)"