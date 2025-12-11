#!/usr/bin/env node

// K6 Results Analyzer - Parse and display JSON results nicely
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function analyzeResults(filename) {
    if (!fs.existsSync(filename)) {
        console.log(`${colors.red}❌ File ${filename} not found${colors.reset}`);
        return;
    }

    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.split('\n').filter(line => line.trim());
    
    let metrics = {};
    let checks = {};
    
    lines.forEach(line => {
        try {
            const entry = JSON.parse(line);
            
            if (entry.type === 'Point' && entry.metric) {
                if (!metrics[entry.metric]) {
                    metrics[entry.metric] = [];
                }
                metrics[entry.metric].push(entry.data.value);
            }
            
            if (entry.type === 'Point' && entry.data && entry.data.tags && entry.data.tags.check) {
                const checkName = entry.data.tags.check;
                if (!checks[checkName]) {
                    checks[checkName] = { passed: 0, total: 0 };
                }
                checks[checkName].total++;
                if (entry.data.value === 1) {
                    checks[checkName].passed++;
                }
            }
        } catch (e) {
            // Skip invalid JSON lines
        }
    });

    // Display results
    console.log(`\n${colors.blue}📊 Test Results Analysis: ${filename}${colors.reset}`);
    console.log('='.repeat(50));
    
    // HTTP Request Duration
    if (metrics.http_req_duration) {
        const durations = metrics.http_req_duration.sort((a, b) => a - b);
        const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
        const p95 = durations[Math.floor(durations.length * 0.95)];
        const p99 = durations[Math.floor(durations.length * 0.99)];
        
        console.log(`\n${colors.cyan}⏱️  Response Time Metrics:${colors.reset}`);
        console.log(`   Average: ${avg.toFixed(2)}ms`);
        console.log(`   95th percentile: ${p95.toFixed(2)}ms`);
        console.log(`   99th percentile: ${p99.toFixed(2)}ms`);
        console.log(`   Total requests: ${durations.length}`);
    }
    
    // HTTP Request Rate
    if (metrics.http_reqs) {
        console.log(`\n${colors.cyan}📈 Request Rate:${colors.reset}`);
        console.log(`   Total HTTP requests: ${metrics.http_reqs.length}`);
    }
    
    // Checks Results  
    if (Object.keys(checks).length > 0) {
        console.log(`\n${colors.cyan}✅ Checks Results:${colors.reset}`);
        Object.entries(checks).forEach(([name, result]) => {
            const percentage = ((result.passed / result.total) * 100).toFixed(1);
            const status = result.passed === result.total ? colors.green : colors.red;
            console.log(`   ${name}: ${status}${result.passed}/${result.total} (${percentage}%)${colors.reset}`);
        });
    }
    
    // Error Rate
    if (metrics.http_req_failed) {
        const failures = metrics.http_req_failed.filter(f => f === 1).length;
        const total = metrics.http_req_failed.length;
        const errorRate = ((failures / total) * 100).toFixed(2);
        const status = failures === 0 ? colors.green : colors.red;
        
        console.log(`\n${colors.cyan}❌ Error Analysis:${colors.reset}`);
        console.log(`   Failed requests: ${status}${failures}/${total} (${errorRate}%)${colors.reset}`);
    }
    
    console.log('\n' + '='.repeat(50));
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
    console.log(`${colors.yellow}📋 Usage: node analyze-results.js <result-file.json>${colors.reset}`);
    console.log('\nAvailable result files:');
    
    const resultFiles = fs.readdirSync('.')
        .filter(file => file.endsWith('-results.json'))
        .sort();
        
    if (resultFiles.length === 0) {
        console.log('   No result files found. Run tests first with JSON output.');
    } else {
        resultFiles.forEach(file => console.log(`   • ${file}`));
    }
} else {
    args.forEach(analyzeResults);
}