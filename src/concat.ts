import fs from "fs-extra";
import path from 'path';
import { removeIfExist, HEADER, readLines } from "./common";

const fileLoad = async (readFilePath: string, output: fs.WriteStream) => {
    let first = true;
    for await (const _line of readLines(readFilePath)) {
        const line: string = _line;
        if (first) {
            first = false;
            continue;
        }

        output.write(line + '\n');
    }
}

const main = async () => {
    const files = await fs.readdir('resources/csv');
    const writeFilePath = 'resources/final.csv';
    await removeIfExist(writeFilePath);
    const output = fs.createWriteStream(writeFilePath, {
        flags: 'a' 
    });
    output.write(HEADER.join(',') + '\n'); // not sure why it can behave like sync
    // console.log(files);
    await Promise.all(
        files.map(async file => fileLoad(
            path.resolve('resources/csv', file), output))
    );

    output.close();
}

(async () => {
    await main();
})();
