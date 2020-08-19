import axios from 'axios';

import createHttpRequest from '../helper/httpRequest';

const wingHttpHandleEmpty = axios.create({
    baseURL: 'https://idiom-test.52js.net'
});

// No additional actions
export const httpRequestEmpty = createHttpRequest(wingHttpHandleEmpty);
