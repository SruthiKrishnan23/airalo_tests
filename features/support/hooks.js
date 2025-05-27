const POManager=require('../../pageObjects/POManager')
const { setWorldConstructor } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const { request } = require('@playwright/test');

class CustomWorld {
  constructor({ parameters }) {
    this.parameters = parameters;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.poManager = null; 

  }

    async launchBrowser() {
    this.browser = await chromium.launch({ headless: false ,slowMo: 100}); // Set headless to false for debugging
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.poManager = new POManager(this.page);
  }

    async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  }


setWorldConstructor(CustomWorld);