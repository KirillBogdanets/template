const EC = protractor.ExpectedConditions;
let { Then, When, Given } = require('cucumber');
const DEFAULT_STEP_TIMEOUT = 30 * 1000;
const expect = require('chai').expect;
const State = require("../../index").State;
const Memory = require("../../index").Memory;
const utils = require("../utils/_utils");

const ValidationSteps = () => {

    Given(/^I should be on "(.+)" page$/, async (pageName) => {
        State.setPage(pageName);
        await browser.wait(async () => await browser.executeScript("return document.readyState") === "complete");
        return expect(await browser.getCurrentUrl()).to.match(new RegExp(State.pageMap.getPage(pageName).selector));
    });


    Then(/^(Element|Collection) "([^"]*)" should (not )?be (present|clickable|visible|invisible|selected|gone)$/, async (elementOrCollection, alias, negate, validation) => {
        const page = State.getPage();
        const element = page.getElement(alias);
        const CUSTOM_TIMEOUT = 15 * 1000;

        if (elementOrCollection === "Collection") {
            await element.each(elem => {
                return browser.wait(utils.ECHelper(elem, validation, negate), CUSTOM_TIMEOUT, `${elementOrCollection} ${alias} is${negate ? "" : " not"} ${validation}`);
            });
        } else {
            return await browser.wait(utils.ECHelper(element, validation, negate), CUSTOM_TIMEOUT, `${elementOrCollection} ${alias} is${negate ? "" : " not"} ${validation}`);
        }
    });

    Then(/^Number of elements in "(.+)" collection should (not )?be (equal to|less than|greater than) "(.+)"$/, async (alias, negate, action, expectedValue) => {
        const page = State.getPage();
        const parsedValue = parseInt(Memory.parseValue(expectedValue));
        const count = await page.getElement(alias).count();

        switch (action) {
            case "equal to":
                negate
                    ? expect(count).to.not.equal(parsedValue)
                    : expect(count).to.equal(parsedValue);
                break;
            case "less than":
                negate
                    ? expect(count).to.not.be.lessThan(parsedValue)
                    : expect(count).to.be.lessThan(parsedValue);
                break;
            case "greater than":
                negate
                    ? expect(count).to.not.be.greaterThan(parsedValue)
                    : expect(count).to.be.greaterThan(parsedValue);
                break;
            default:
                throw Error(`${action} is not defined`);
        }
    });

    Then(/^Text of "(.+)" element should (not )?(be equal to|contain) "(.+)"( ignoring case)?$/, async (alias, negate, action, value, ignoringCase) => {
        const page = State.getPage();
        let parsedValue = Memory.parseValue(value);
        let elementText = await page.getElement(alias).getText();

        if (ignoringCase){
            parsedValue = parsedValue.toLowerCase();
            elementText = elementText.toLowerCase();
        }

        switch (action) {
            case "be equal to":
                negate
                    ? expect(elementText).to.not.equal(parsedValue)
                    : expect(elementText).to.equal(parsedValue);
                break;
            case "contain":
                negate
                    ? expect(elementText).to.not.contain(parsedValue)
                    : expect(elementText).to.contain(parsedValue);
                break;
            default:
                throw Error(`${action} is not defined`);
        }
    });
};

module.exports = ValidationSteps;