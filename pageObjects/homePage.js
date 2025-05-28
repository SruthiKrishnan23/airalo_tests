const {expect}=require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page
    this.searchInput = page.getByTestId('search-input')
    this.selectCountry = page.getByRole('listitem')
    this.cookiePopup = page.getByRole('button', { name: 'ACCEPT' })
    this.notificationsPopup = page.getByRole('button', { name: 'DON\'T ALLOW' })
    this.baseUrl = "https://www.airalo.com/"
  }

  async navigatetoHomePage() {
    await this.page.goto(this.baseUrl)
  }

  async acceptCookie_denyNotification() {
    await this.cookiePopup.click();
    await this.notificationsPopup.click();
  }

  async verifyHomePage(){ 
    await expect(this.page).toHaveTitle("Buy eSIMs for international travel - Airalo")
  }

  async searchAndSelectCountry(country) {
    await this.searchInput.click();
    await this.searchInput.fill(country, { timeout: 10000 })
    await this.selectCountry.filter({ hasText: country }).click()
  }

  
}

module.exports = HomePage;