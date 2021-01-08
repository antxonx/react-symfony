import axios from 'axios';
import Authentication from '@services/authentication';

const token = Authentication.getToken();
axios.defaults.baseURL = 'http://localhost:1010/'
axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}
export default axios;