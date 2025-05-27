const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const {POManager}=require('../../pageObjects/POManager');
const {expect}=require('@playwright/test');
const playwright = require('@playwright/test')


// --- Hooks ---

Before(async function () {
  await this.launchBrowser();
});

After(async function () {
  await this.closeBrowser();
});

// --- Given Steps ---

Given('I am on the Airalo homepage', async function () {
  await this.poManager.getHomePage().navigate();
});

// --- When Steps ---

When('I search for {string}', async function (country) {
  await this.poManager.getHomePage().searchFor(country);
});

When('I click on {string} eSIM buy button', async function (eSimName) {
  if (eSimName === "Moshi Moshi") {
    await this.poManager.getSearchResultsPage().clickMoshiMoshiBuyNow();
  } 
});

// --- Then Steps ---

Then('I should see the {string} eSIM details page with:', async function (eSimName, dataTable) {
  const details = dataTable.rowsHash();
  await this.poManager.getSimDetailsPage().assertSimDetails(
    details.Operator,
    details.Coverage,
    details.Data,
    details.Validity,
    details.Price
  );
});

Then('I close the eSIM details', async function () {
  await this.poManager.getSimDetailsPage().closeDetails();
});