—Airalo Test Automation—

This repository contains automated tests for the Airalo platform, utilizing two distinct frameworks for different testing needs:

Playwright

API Test Automation
Web UI Test (Normal Playwright, non-BDD)

Cucumber.js

Behavior-Driven Development (BDD) - Web UI Test

Note:API credentials and URLs are hardcoded directly within the test file. In real-time,it will be environment variables  and driven externally

#Prerequisites

Before you begin, ensure you have the following installed:

To check if Node.js is installed: node -v

You can download it from https://nodejs.org/.

To check if npm (Node Package Manager) is installed: npm -v

Set the $PATH variable for /usr/local/bin for Node.js

Visual Studio Code
Install playwright Dependencies

#Setup Instructions

Follow these steps to set up the project locally:

1.Clone The Repository
Go to https://github.com/SruthiKrishnan23/airalo_tests.git
Download the zip file
cd airalo_tests

2.Open the Folder in Local Visual Studio Code
code .

3.Install dependencies:
npm install
npx playwright install

Check the node_modules for all the Playwright, Cucumber and others dependencies added in package.json
Check the necessary Extensions, Cucumber -Gherkin, Playwright Test for VS Code, Remote Tunnels

# Running the Tests

#Playwright API Tests

These tests are written as standard Playwright test files (.spec.js) for execution for API validations.
Test File : `tests/airalo_api_test.spec.js`
To run the Playwright API tests in terminal:
npx playwright test tests/airalo_api_test.spec.js or
npm run APITest

This command will:

Execute the tests defined in tests/airalo_api_test.spec.js.

Generate an HTML test report (default Playwright reporter) in the playwright-report directory

After execution, run npx playwright show-report to view the detailed HTML report in your web browser.

In reports, there is trace for all api calls with all the necessary details and also console logs will have all the details to be verified for api requests and response

#Cucumber.js Web UI Tests
Cucumber tests are designed using a Behavior-Driven Development (BDD) approach, 

Feature File: features/airalo_web_ui.feature
Steps: features/step_definitions/airalo_web_steps.js

To run the Cucumber Web UI tests:

npx cucumber-js --format html:cucumber_report.html or
npm run Cucumber_WebTest

This command will:

Execute the Cucumber scenario
Generate an HTML test report named cucumber_report.html in the project root.

After execution, open cucumber_report.html in your web browser to view the detailed test results 

#Normal Web UI Test

These tests are written as standard Playwright test files (.spec.js) for execution for Web UI validations.
Test File : ‘tests/airalo_web_test.spec.js’

To run the Playwright Web tests in terminal:

npx playwright test tests/airalo_web_test.spec.js  or
npm run WebTest

This command will:

1.Execute the tests defined in tests/airalo_web_test.spec.js.
2.Generate an HTML test report (default Playwright reporter) in the playwright-report directory

After execution, run npx playwright show-report to view the detailed HTML report in your web browser.

#Running All Tests
To run both Playwright API tests and Cucumber Web UI tests sequentially:
Bash
npm run All_Tests

Approach to Implementation

Playwright API Tests Approach

Access Token is retrieved as it is used as before hook for each test case.

Hardcoded Configuration: API credentials (CLIENT_ID, CLIENT_SECRET) and API endpoint URLs (TOKEN_URL, ORDER_ESIMS_URL, GET_ESIMS_URL) are directly defined within tests/airalo_api_test.spec.js

Assertions: Playwright's expect assertions are used to validate API responses' status codes, data structure, and specific content.

Test Case 1 - Checks the Presence of Access Token as it is retrieved from Before Hook

Test Case 2 -For Placing the Order Esims with endpoint, quantity, description and packageid is passed as variables.Validated the  response body for corresponsding packageId of  all the 6 eSIMs using for Loop in assertion

Test Case 3 -For Retrieving the list of Esims with endpoint, First Place Order API request is sent , saved the iccid’s and datecreated from previous response. Date is used to filter the get esims list. Maps are used to save sims info and validated the response to match with previously posted order data.

Cucumber.js (BDD) Web UI Tests Approach

Initila Test case file is written in airalo_web_test.spec.js where I have tried to find the locators for the automation step. As a next step created a simple Page Object Test  in Second Test Case where I created separate page objects for HomePage, searchResults page and SimDetailspage.

Next I thought of wrapping the test with Cucumber Framework and created associated Feature file, step definitions and hooks for set up and tear down.

BDD Feature: Test scenario are defined in human-readable Gherkin syntax within .feature file

Hooks (features/support/hooks.js): Before and After hooks are implemented to manage the lifecycle of the Playwright 
browser context. They set up and tear down the browser Web UI Page 

Objects (features/page_objects/): Each significant web page or component (e.g., HomePage, ESimDetailsPage) has a dedicated Page Object. It has locators for UI elements and methods for interacting with them and asserting their state

Step Definitions (features/step_definitions/airalo_web_steps.js): step definitions are defined for each steps in feature file

Assertions are handled for the necessary steps such as HomePage and Sim Details page
