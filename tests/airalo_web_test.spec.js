const {test, expect}=require('@playwright/test');
import POManager from '../pageObjects/POManager';

//Initial Set Up
test('Airalo_PageTest', async ({browser})=>
    {
  
       const context=await browser.newContext();
       const page = await context.newPage();
   
        await page.goto("https://www.airalo.com/");
        await page.getByRole('button', { name: 'ACCEPT' }).click();
        await page.getByRole('button', { name: 'DON\'T ALLOW' }).click();
        await page.getByTestId('search-input').click();
        await page.getByTestId('search-input').fill('Japan ');
        await page.getByRole('listitem').filter({ hasText: 'Japan' }).click();
        //await page.locator('a[data-testid="sim-package-item"]').filter({ hasText: /Moshi Moshi.*1 GB.*7 Days/}).getByRole('button', { name: 'BUY NOW' }).click();
        await page.getByRole('link', { name: 'Moshi Moshi Moshi Moshi  COVERAGE Japan  DATA 1 GB  VALIDITY 7 Days PRICE 4.' }).getByRole('button').click();
        await expect(page.getByTestId("sim-detail-operator-title").getByRole("paragraph")).toContainText("Moshi Moshi")
        await expect(page.getByTestId('sim-detail-info-list').getByTestId('COVERAGE-value')).toContainText('Japan');
        await expect(page.getByTestId('sim-detail-info-list').getByTestId('DATA-value')).toContainText('1 GB');
        await expect(page.getByTestId('sim-detail-info-list').getByTestId('VALIDITY-value')).toContainText('7 Days');
        await expect(page.getByTestId('sim-detail-info-list').getByTestId('PRICE-value')).toContainText('4.50 €');
        await page.locator(".sim-detail-close").click()
        //await context.close();
        //await browser.close();


   });

   //POM Model Test
   test('POM Airalo_PageTest', async ({browser})=>
    {
        const context=await browser.newContext();
        const page = await context.newPage();
        const poManager=new POManager(page);

        await poManager.getHomePage().navigatetoHomePage()
        await poManager.getHomePage().verifyHomePage()
        await poManager.getHomePage().acceptCookie_denyNotification()
        await poManager.getHomePage().searchAndSelectCountry("Japan")
        await poManager.getSearchResultsPage().clickMoshiMoshiBuyNow()
        await poManager.getSimDetailsPage().assertSimDetails("Moshi Moshi", "Japan", "1 GB", "7 Days", "4.50 €")
        await poManager.getSimDetailsPage().closeDetails()
        await context.close();
        await browser.close();


   });