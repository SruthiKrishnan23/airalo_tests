class SearchResultsPage {
  constructor(page) {
    this.page = page;
    this.moshiMoshiBuyButton = page.getByRole('link', { name: 'Moshi Moshi Moshi Moshi  COVERAGE Japan  DATA 1 GB  VALIDITY 7 Days PRICE 4.' }).getByRole('button');
  }

  async clickMoshiMoshiBuyNow() {
    await this.moshiMoshiBuyButton.click();
  }


}

module.exports = SearchResultsPage;