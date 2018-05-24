
/**
* Parse gulp args
* @private
* @param {{env, tags, browser, instances, baseUrl}} env 
* @return {Array} array of args
*/
function parseGulpArgs(env) {
    const args = [
        "--specs", "./features/*.feature",
        "--params.environment", env.env,
        "--cucumberOpts.tags", env.tags,
        "--capabilities.browserName", env.browser || "chrome",
    ];

    if (env.instances > 1) {
        args.push("--capabilities.shardTestFiles");
        args.push("--capabilities.maxInstances");
        args.push(env.instances);
    }

    if (env.baseUrl) {
        args.push("--params.baseUrl");
        args.push(env.baseUrl);
    }

    return args;

};

module.exports = {
    parseGulpArgs
};