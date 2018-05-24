let { Then, When, Given } = require('cucumber');
const State = require("../../index").State;
const utils = require('../utils/_utils');
const WAIT_TIMEOUT = 40 * 1000;


const WaiterSteps = () => {

    When(/^I wait until "(.+)" (appear|disappear|become visible|become invisible)$/, async (alias, action) => {
        const page = State.getPage();
        const element = page.getElement(alias);
        await browser.wait(utils.ECHelper(element, action), WAIT_TIMEOUT);
    });

    When(/^I wait for page load$/, async () => {
        await browser.wait(async () => {
            return await browser.executeScript("return document.readyState") === "complete";
        });
    });

    When(/^I wait "(\d+)" seconds$/, async (seconds) => {
        await browser.sleep(seconds * 1000);
    });

};

module.exports = WaiterSteps;