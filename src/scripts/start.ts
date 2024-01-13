import Color from '../helpers/Colors.helper';
import { paths } from '../configs/paths.config';
import { checkRequiredFiles } from '../utils/file.utils';
import path from 'path';

import express from 'express';
const app = express();

export const start = () => {
    process.env.BABEL_ENV = 'production';
    process.env.NODE_ENV = 'production';

    if (!checkRequiredFiles([paths.html, paths.index]))
        process.exit(1);

    const { PORT = 3000 } = process.env;
    
    app.use(express.static(paths.build));
    
    app.listen(PORT, () => {
        console.log(
            Color.cyan(
                `🚀 Server ready at http://localhost:${PORT} \n`
            )
        );
    });
}