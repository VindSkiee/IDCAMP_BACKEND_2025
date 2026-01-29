import fs from 'fs';
import path from 'path';

class StorageService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(fileBuffer, meta) {
    const filename = `${Date.now()}_${meta.filename}`;
    const filepath = path.resolve(this._folder, filename);

    return new Promise((resolve, reject) => {
      fs.writeFile(filepath, fileBuffer, (error) => {
        if (error) {
          return reject(error);
        }
        return resolve(filename);
      });
    });
  }
}

export default StorageService;
