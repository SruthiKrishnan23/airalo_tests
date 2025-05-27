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
    await expect(this.operatorTitle).toContainText(operator);
    await expect(this.coverageValue).toContainText(coverage);
    await expect(this.dataValue).toContainText(data);
    await expect(this.validityValue).toContainText(validity);
    await expect(this.priceValue).toContainText(price);
  }

  async closeDetails() 
  {
    await this.closeButton.click();
  }
}

module.exports = SimDetailsPage;