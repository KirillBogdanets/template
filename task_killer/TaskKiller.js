const exec = require('child_process').exec;

/**
 * Task killer. Kill hanged drivers
 * @type {TaskKiller}
 */
class TaskKiller {

    /**
     * Kill hang driver
     * @param {Array<string>} itemToKill - list of items to kill
     * @return {Promise<void>} - promise that resolves after killing drivers
     */
    static kill(itemToKill) {
        const CMD_LIST = "tasklist /V /FO CSV";
        const KILL = "taskkill /F /PID ";

        return new Promise((resolve, reject) => {
            exec(CMD_LIST, (error, stdout) => {
                if (error) reject(error);

                stdout
                    .split("\r\n")
                    .filter(process => itemToKill.find(item => process.includes(item)))
                    .map(item => item.split(/,/)[1].replace(/"/g, ""))
                    .forEach(pid => exec(KILL + pid, error => {
                        if (error) reject(error);
                        console.log("Process with id " + pid + " killed");
                    }));

                resolve();
            })
        });
    }
}

module.exports = TaskKiller;