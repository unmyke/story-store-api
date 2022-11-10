import { parse } from 'path';

export const isFileInDir = ({ file, dir }) => parse(file).dir === dir;
