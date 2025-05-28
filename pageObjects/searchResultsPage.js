const {expect}=require('@playwright/test');
class SearchResultsPage {
  constructor(page) {
    this.page = page;
    //this.moshiMoshiBuyButton = page.getByRole('link', { name: 'Moshi Moshi Moshi Moshi  COVERAGE Japan  DATA 1 GB  VALIDITY 7 Days PRICE 4.' }).getByRole('button');
    this.moshiMoshiBuyButton =page.locator('[data-testid="esim-button"]').nth(1)
  }

  async clickMoshiMoshiBuyNow() {
    await this.moshiMoshiBuyButton.click();
  }


}

module.exports = SearchResultsPage;