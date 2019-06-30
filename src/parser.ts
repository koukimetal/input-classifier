import fs from "fs-extra";
import path from 'path';
import { removeIfExist, HEADER, readLines } from "./common";

const shindoMap: {[k: string]: number} = {
    '1': 10,
    '2': 20,
    '3': 30,
    '4': 40,
    'A': 52, // 5-
    '5': 55, // 5
    'B': 57, // 5+
    'C': 62, // 6-
    '6': 65, // 6
    'D': 67, // 6+
    '7': 70, // 7
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
        const latitude = (line.substring(21, 24) + '.' + line.substring(24, 28)).trim();
        const longitude = (line.substring(32, 36) + '.' + line.substring(36, 40)).trim();
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
        if (maxShindo >= 50) {
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
