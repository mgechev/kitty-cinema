import { onRequest } from 'firebase-functions/v2/https';

// NOTE: leave this as require() since this file is built dynamically by Angular CLI webpack
// tslint:disable-next-line:no-require-imports no-var-requires
const ssrApp = require('./main').app();

export const webhook = onRequest({ timeoutSeconds: 20 }, ssrApp);
