const EC = protractor.ExpectedConditions;
let { Then, When, Given } = require('cucumber');
const DEFAULT_STEP_TIMEOUT = 30 * 1000;
const expect = require('chai').expect;
const State = require("../../index").State;
const Memory = require("../../index").Memory;

const ActionsSteps = () => {

    Then(/^I (Disable|Enable) protractor synchronization$/, (toggleArg) => {
        if (toggleArg === "Disable") {
            browser.ignoreSynchronization = true;
        } else {
            browser.ignoreSynchronization = false;
        }
        return true;
    });
    
    When(/^I hover mouse over "([^"]*)"$/, async (alias) => {
        const page = State.getPage();
        await browser.actions().mouseMove(page.getElement(alias)).perform();
    });

    Then(/^I click "([^"]*)" element$/, async (alias) => {
        const page = State.getPage();
        const element = page.getElement(alias);

        await browser.wait(EC.elementToBeClickable(element), DEFAULT_STEP_TIMEOUT)
        await element.click();
    });
};

module.exports = ActionsSteps;