# 1inch API and E2E Testing Project

![Build Status](https://github.com/zhukoff-av/1inch/actions/workflows/ci.yml/badge.svg)

This repository contains a project for testing the 1inch API and includes end-to-end (E2E) tests for validating functionality across the system. It is designed to demonstrate practical test automation skills, leveraging modern tools and best practices.

### 🛠 Features
    •	API Testing: Automated tests to validate the 1inch API endpoints.
    
    •	E2E Testing: Functional tests simulating real user workflows.
    
    •	CI/CD Integration: GitHub Actions pipeline for running tests automatically.
    
    •	Modern Tools: Built using industry-standard frameworks and tools.

### 🚀 Getting Started

Prerequisites:

Ensure the following tools are installed:

`Node.js (v16 or higher)`

`pnpm (v8.9.0 or higher)`

Installation

1.	Clone the repository:

    git clone https://github.com/zhukoff-av/1inch.git
    cd 1inch

2.	Install dependencies:
`pnpm install`


### 📄 Scripts

Run these scripts for different tasks:

Run API Tests:
    `pnpm test:api`

Run E2E Tests:
    `pnpm test:e2e`

Run All Tests: 
    `pnpm test`

### 🔧 Configuration

Environment Variables:
Add your API keys or configurations in a .env file. 
Example:
        
    API_KEY=your-api-key
    BASE_URL=https://api.1inch.io