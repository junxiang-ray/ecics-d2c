import axios from 'axios';

export default axios.create({
  baseURL: process.env.API_DETECT_MAKE_MODEL_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${process.env.API_TOKEN_DETECT_MAKE_MODEL || ''}`,
  },
});
