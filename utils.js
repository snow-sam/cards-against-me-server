import fs from 'fs/promises';
import path from 'path';

export const getJson = async (arqPath) => {
    const arq = path.join(process.cwd(), arqPath);
    try {
      const data = await fs.readFile(arq, 'utf8');
      const dataJson = JSON.parse(data);
      return dataJson;
    } catch (error) {
      console.error('Error reading the JSON file:', error);
      return '';
    }
}