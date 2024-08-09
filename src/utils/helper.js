import { exec } from "child_process";

export const createMongoDump = async () => {
    const currentDate = new Date();
    const getDate = ("0" + currentDate.getDate()).slice(-2);
    const getmonth = ("0" + currentDate.getMonth()).slice(-2);
    const getYear = currentDate.getFullYear();
    const date = `${getDate}-${getmonth}-${getYear}`;
    const command = `mongodump --uri="${process.env.DBconnection}" --out=${process.env.DUMP_PATH}/${date}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return {Error: error.message};
        }

        if (stderr) {
            console.error(`stderr:${stderr}`);
            return;
        }
        console.log(`MongoDump taken successfully:\n${stdout}`)
    })
};