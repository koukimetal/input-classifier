import fs from "fs-extra";
import path from 'path';
import { removeIfExist, HEADER, readLines } from "./common";

const shindoMap: {[k: string]: number} = {
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5.5,
    '6': 6.5,
    '7': 7,
    'A': 5.25,
    'B': 5.75,
    'C': 6.25,
    'D': 6.75
}

const fileLoad = async (readFilePath: string, writeFilePath: string) => {
    await removeIfExist(writeFilePath);

    const output = fs.createWriteStream(writeFilePath, {
        flags: 'a' 
    });

    output.write(HEADER.join(',') + '\n');
    for await (const _line of readLines(readFilePath)) {
        const line: string = _line;
        if (line[0] !== 'J') {
            continue;
        }

        // shinoh
        const timestamp = line.substring(1,15);
        const latitude = line.substring(21, 24) + '.' + line.substring(24, 28);
        const longitude = line.substring(32, 36) + '.' + line.substring(36, 40);
        const depth = parseInt(line.substring(40, 44));
        const magnitude = parseInt(line.substring(52, 54));
        const magnitudeType = line.substring(54, 55);
        const depthType = line.substring(59, 60);
        const maxShindo = shindoMap[line.substring(61, 62)];
        const placeName = line.substring(68, 92);
        const originAccurateType = line.substring(95, 96);

        if (!maxShindo) {
            continue;
        }
        if (magnitudeType.toLocaleLowerCase() !== 'v') {
            continue;
        }
        if (maxShindo > 5) {
            console.log(maxShindo);
        }

        const data = {
            latitude, longitude, depth, magnitude, maxShindo, placeName,
            depthType, magnitudeType, originAccurateType, timestamp
        };

        const outLine = HEADER.map(head => data[head]);
        output.write(outLine.join(',') + '\n');
    }

    output.close();
}

const main = async () => {
    const files = await fs.readdir('resources/raw');
    await Promise.all(
        files.map(async file => fileLoad(
            path.resolve('resources/raw', file),
            path.resolve('resources/csv', file + '.csv')))
    );
}

(async () => {
    await main();
})();
