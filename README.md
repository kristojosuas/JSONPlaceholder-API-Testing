# JSONPlaceholder Playwright TypeScript Framework

A comprehensive test automation framework for the JSONPlaceholder API using Playwright and TypeScript.

## Test Plan and Scenario Documentation

- [Test Plan Documentation](https://docs.google.com/document/d/1CPq-_y1g2HyUP-IRPkliFtvOFl1HhlZaV7rkWxFOtxs/edit?usp=sharing)
- [Test Scenario Documentation](https://docs.google.com/spreadsheets/d/14ATbcPzroScL4mHKmRr8I-SFkBUmUrDJ/edit?usp=sharing&ouid=104923290814892534391&rtpof=true&sd=true)

## 🎯 Feature

- Smoke Tests: Critical functionality verification
- API Tests: Comprehensive endpoint testing
- Performance Tests: Response time
- Reporting: HTML report with screenshot

## 🏗️ Project Structure

```bash
JSONPlaceholder/
├── schemas/                      # JSON Schema definitions
│   ├── post.schema.json
│   └── user.schema.json
├── tests/                        # Test suites and utilities
│   ├── api/                      # API test specifications
│   │   ├── performance.spec.ts
│   │   ├── posts.spec.ts
│   │   └── users.spec.ts
│   ├── fixtures/                 # Test fixtures and utilities
│       └── test-data.ts          # Test data sets
├── utils/                         # Test utility modules
│   ├── api-client.ts              # API client for HTTP requests
│   ├── helpers.ts                 # Helper functions
│   ├── tags.ts                    # Test tagging utilities
│   └── validators.ts              # Data validation utilities
├── reports/
│    ├── playwright-report/         # HTML report from playwright (generated)
│    └── allure-report/             # Allure report generated from allure-results
└── allure-results/                 # Allure raw result (generated)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/kristojosuas/JSONPlaceholder-API-Testing.git
cd JSONPlaceholder-API-Testing
```

2. Install dependencies

```bash
npm install
```

3. Install Playwright

```bash
npx playwright install
```

### 🏷️ Test Tags

Use tags to run specific test suite

```bash
# Test types
npx playwright --grep "@smoke"
npx playwright --grep "@performance"
npx playwright --grep "@validation"

# Endpoints
npx playwright --grep "@posts"
npx playwright --grep "@users"

# Test categories
npx playwright --grep "@positive"
npx playwright --grep "@negative"
```

#### 📋 Additional Commands

| Command                    | Description                            |
| -------------------------- | -------------------------------------- |
| `npm run test`             | Run all tests                          |
| `npm run test:smoke`       | Run critical smoke tests               |
| `npm run test:posts`       | Run tests for the posts API endpoint   |
| `npm run test:users`       | Run tests for the users API endpoint   |
| `npm run test:performance` | Run performance tests to measure speed |
| `npm run allure:report`    | Generate Allure test report            |
| `npm run allure:open`      | Open the Allure test report            |

### 🗝️ Environment Variables

```bash
# URL configuration
BASE_URL=https://jsonplaceholder.typicode.com/

# Timeout
TIMEOUT=30000
```

### 📊 Reporting

1. Console Output: Real-time test execution feedback
2. HTML Report: `playwright-reports/index.html`

### 🔄 CI/CD Integration

- GitHub Actions

### 📚 Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com/)
