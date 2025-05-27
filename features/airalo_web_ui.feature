Feature: Airalo Website UI Interaction

  @WebTest
  Scenario: Search for Japan eSIM and verify Moshi Moshi details
    Given I am on the Airalo homepage
    When I search for "Japan"
    And I click on "Moshi Moshi" eSIM buy button
    Then I should see the "Moshi Moshi" eSIM details page with:
      | Operator  | Moshi Moshi     |
      | Coverage  | Japan           |
      | Data      | 1 GB            |
      | Validity  | 7 Days          |
      | Price     | 4.50 €          |
    And I close the eSIM details