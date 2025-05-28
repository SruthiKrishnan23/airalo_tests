const { expect } = require('@playwright/test');

class SimDetailsPage {
  constructor(page) {
    this.page = page;
    this.operatorTitle = page.getByTestId("sim-detail-operator-title").getByRole("paragraph");
    this.coverageValue = page.getByTestId('sim-detail-info-list').getByTestId('COVERAGE-value');
    this.dataValue = page.getByTestId('sim-detail-info-list').getByTestId('DATA-value');
    this.validityValue = page.getByTestId('sim-detail-info-list').getByTestId('VALIDITY-value');
    this.priceValue = page.getByTestId('sim-detail-info-list').getByTestId('PRICE-value');
    this.closeButton = page.locator(".sim-detail-close");
  }

  async assertSimDetails(operator, coverage, data, validity, price) { 
    await expect(this.operatorTitle).toContainText(operator, { timeout: 10000 });
    await expect(this.coverageValue).toContainText(coverage, { timeout: 10000 });
    await expect(this.dataValue).toContainText(data , { timeout: 10000 });
    await expect(this.validityValue).toContainText(validity, { timeout: 10000 });
    await expect(this.priceValue).toContainText(price, { timeout: 10000 });
    console.log(await this.operatorTitle.textContent())
    console.log(await this.coverageValue.textContent());
    console.log(await this.dataValue.textContent());
    console.log(await this.validityValue.textContent());
    console.log(await this.priceValue.textContent());
  }

  async closeDetails() 
  {
    await this.closeButton.click();
  }
}

module.exports = SimDetailsPage;