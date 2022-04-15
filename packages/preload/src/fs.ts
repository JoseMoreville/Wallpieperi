import {exposeInMainWorld} from './exposeInMainWorld';

export const fs = require('fs');
exposeInMainWorld('fs', fs);