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
    output.write(HEADER.join(',') + '\n');
    console.log(files);
    await Promise.all(
        files.map(async file => fileLoad(
            path.resolve('resources/csv', file), output))
    );

    output.close();
}

(async () => {
    await main();
})();



// const getLines = async (readFilePath: string) => {
//     const buf = await fs.readFile(readFilePath, 'utf8');
//     console.log(buf.toString());
//     const contents = buf.toString().split('\n').slice(1);
//     return contents;
// }

// const main = async () => {
//     const files = await fs.readdir('resources/csv');
//     const writeFilePath = 'resources/final.csv';

//     const finalLines = [];
//     finalLines.push( HEADER.join(','));

//     await removeIfExist(writeFilePath);
//     await fs.appendFile(writeFilePath,+ '\n');
//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         console.log(file);
//         const lines = await getLines(
//             path.resolve('resources/csv', file));
//         finalLines.push(...lines);
//     }
    
//     await fs.writeFile(writeFilePath, finalLines.join('\n'));
// }

// (async () => {
//     await main();
// })();
