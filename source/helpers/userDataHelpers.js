import request from 'axios';
import { auth } from './requestHelpers';

const { URL } = process.env;
const API_URL = `${URL}/user`;

export function recordUserAction({ action, ...rest }) {
  return request.post(`${API_URL}/action/${action}`, rest, auth());
}
