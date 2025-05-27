class HomePage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-input');
    this.selectCountry = page.getByRole('listitem');
  }

  async navigate() {
    await this.page.goto("https://www.airalo.com/");
  }

  async searchFor(country) {
    await this.searchInput.click();
    await this.searchInput.fill(country, { timeout: 10000 });
    await this.selectCountry.filter({ hasText: country }).click();
  }

  
}

module.exports = HomePage;