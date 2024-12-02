import fs from 'fs';
import path from 'path';

export const getJson = (arqPath) => {
    const arq = path.join(process.cwd(), arqPath);
    try {
      const data = fs.readFileSync(arq, 'utf8');
      const dataJson = JSON.parse(data);
      return dataJson;
    } catch (error) {
      console.error('Error reading the JSON file:', error);
      return '';
    }
}