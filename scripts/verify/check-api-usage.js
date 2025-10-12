#!/usr/bin/env node

/**
 * Check API Usage Script
 * Verifies all API calls use consistent patterns
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../../src');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
};

const issues = {
  directFetch: [],
  missingErrorHandling: [],
  noTimeout: [],
  inconsistentApi: []
};

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(srcDir, filePath);

  // Check for direct fetch calls outside api.ts
  if (!filePath.includes('api.ts') && content.includes('fetch(')) {
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('fetch(') && !line.includes('//')) {
        issues.directFetch.push({
          file: relativePath,
          line: index + 1,
          code: line.trim()
        });
      }
    });
  }

  // Check for missing try-catch around API calls
  if (content.includes('await fetch(') || content.includes('await api.')) {
    const hasTryCatch = content.includes('try {') && content.includes('catch');
    if (!hasTryCatch) {
      issues.missingErrorHandling.push(relativePath);
    }
  }

  // Check for timeout configuration
  if (content.includes('axios.create') && !content.includes('timeout:')) {
    issues.noTimeout.push(relativePath);
  }
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      scanDirectory(filePath);
    } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
      scanFile(filePath);
    }
  });
}

function printResults() {
  log.info('API Usage Analysis Results:\n');

  if (issues.directFetch.length > 0) {
    log.warn(`Found ${issues.directFetch.length} direct fetch() calls (should use api.ts):`);
    issues.directFetch.slice(0, 5).forEach(issue => {
      console.log(`  ${issue.file}:${issue.line}`);
      console.log(`    ${issue.code.substring(0, 80)}...`);
    });
    if (issues.directFetch.length > 5) {
      console.log(`  ... and ${issues.directFetch.length - 5} more`);
    }
    console.log('');
  }

  if (issues.missingErrorHandling.length > 0) {
    log.warn(`Found ${issues.missingErrorHandling.length} files without error handling:`);
    issues.missingErrorHandling.slice(0, 5).forEach(file => {
      console.log(`  ${file}`);
    });
    if (issues.missingErrorHandling.length > 5) {
      console.log(`  ... and ${issues.missingErrorHandling.length - 5} more`);
    }
    console.log('');
  }

  if (issues.noTimeout.length > 0) {
    log.error(`Found ${issues.noTimeout.length} axios instances without timeout:`);
    issues.noTimeout.forEach(file => {
      console.log(`  ${file}`);
    });
    console.log('');
  }

  const totalIssues = issues.directFetch.length + 
                      issues.missingErrorHandling.length + 
                      issues.noTimeout.length;

  console.log('\n' + '='.repeat(50));
  console.log(`Total Issues Found: ${totalIssues}`);
  console.log('='.repeat(50) + '\n');

  if (totalIssues === 0) {
    log.success('No API usage issues found!');
  } else {
    log.info('Review and fix the issues above for better API handling.');
  }

  return totalIssues;
}

// Run scan
log.info('Scanning API usage patterns...\n');
scanDirectory(srcDir);
const issueCount = printResults();

process.exit(issueCount > 0 ? 1 : 0);

