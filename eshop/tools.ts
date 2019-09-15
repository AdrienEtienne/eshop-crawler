import * as fs from 'fs';

const DATA = './eshop/data';

export function writeFileAsync(fileName: string, data: {}) {
  return new Promise((res, rej) => {
    fs.writeFile(`${DATA}/${fileName}`, JSON.stringify(data), error =>
      error ? rej(error) : res(),
    );
  });
}
