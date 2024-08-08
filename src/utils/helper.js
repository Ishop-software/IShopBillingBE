import { exec } from "child_process";

export const createMongoDump = async () => {
    const command = `mongodump --uri="${process.env.DBconnection}" --out=${process.env.DUMP_PATH}/$(date +%Y%m%d_%H%M%S)`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`stderr:${stderr}`);
            return;
        }
        console.log(`MongoDump taken successfully:\n${stdout}`)
    })
};