const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const yargs = require("yargs").argv;
const { protractor, webdriver_update_specific } = require("gulp-protractor");
const TasksKiller = require("../task_killer/TaskKiller");
const reporter = require('cucumber-html-reporter');
const {parseGulpArgs} = require("./gulp_utils/GulpUtils");

module.exports = function (gulp, envs) {

    gulp.task("test:driver_update", webdriver_update_specific({
        webdriverManagerArgs: ["--ie", "--chrome"]
    }));

    gulp.task("test", ["test:driver_update"], () => {
        return gulp.src([])
            .pipe(protractor({
                configFile: path.resolve("./protractor.config.js"),
                args: parseGulpArgs(yargs),
                autoStartStopServer: true,
                debug: yargs.debug === "true"
            }))
            .on("end", function () {
                console.log("E2E Testing complete");
            })
            .on("error", function (error) {
                console.log("E2E Tests failed");
                console.log(error);
            });
    });

    gulp.task("kill", () => TasksKiller.kill(["chromedriver", "iedriverserver"]));

    gulp.task("report", () => {
        const dir = path.resolve("./output/");

        fs.readdirSync(dir).forEach(file => {
            let a = require(path.resolve(dir + "/" + file));
            if (a[0] === undefined) {
                fs.unlinkSync(path.resolve(dir + "/" + file));
            }
        });

        let options = {
            theme: 'bootstrap',
            jsonDir: './output/',
            // jsonFile: './output/cucumber.json',
            output: './cucumber_report.html',
            reportSuiteAsScenarios: true,
            launchReport: true,
            metadata: {
                "Browser": "Chrome",
                "Platform": "Windows 10",
                "Parallel": "Scenarios",
                "Executed": "Remote"
            }
        };

        reporter.generate(options);
    });
};