import fs from "fs-extra";
import readline from 'readline';
import stream from 'stream';

export const removeIfExist = async (filePath: string) => {
    //
    try {
        await fs.stat(filePath);
        await fs.unlink(filePath);
    } catch (e) {

    }
}

export const readLines = (filePath: string) => {
    const input = fs.createReadStream(filePath);
    const output = new stream.PassThrough({ objectMode: true }) as any; // to supress error
    const rl = readline.createInterface({ input });
    rl.on("line", line => {
      output.write(line);
    });
    rl.on("close", () => {
      output.push(null);
    }); 
    return output;
}

export const HEADER = ['latitude', 'longitude', 'depth', 'magnitude', 'maxShindo', 'placeName',
'depthType', 'magnitudeType', 'originAccurateType', 'timestamp'];
