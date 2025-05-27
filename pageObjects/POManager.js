
const {homePage}=require('../pageObjects/homePage')
const {searchResultsPage}=require('../pageObjects/searchResultsPage')
const {simDetailsPage}=require('../pageObjects/simDetailsPage')

const HomePage = require('./homePage')
const SearchResultsPage = require('./searchResultsPage')
const SimDetailsPage = require('./simDetailsPage')
 
 class POManager {
    constructor(page) {
        this.page = page;
        this.homePage = new HomePage(page);
        this.searchResultsPage = new SearchResultsPage(page);
        this.simDetailsPage = new SimDetailsPage(page);
    }

    getHomePage() { 
        return this.homePage;
    }

    getSearchResultsPage() {
        return this.searchResultsPage;
    }

    getSimDetailsPage() {
        return this.simDetailsPage;
    }
}

module.exports = POManager;