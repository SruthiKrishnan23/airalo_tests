// @ts-check
const { devices } =  require ('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config= ({
  testDir: './tests',
  workers:5,
  retries:0,
  //Maximum timeout one test can run for
  timeout: 30*1000,
  //assertion timeout
    expect :
    { 
      timeout : 10000 
    },
    reporter :'html',
    use: 
    { 
      browserName: 'chromium',
      headless: false,
      screenshot: 'off', 
      trace: 'on' //logs -all test cases
      //trace: 'retain-on-failure'
      
     },
});
  module.exports =config
