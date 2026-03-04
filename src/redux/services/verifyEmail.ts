import axios from '../axiosConfig';

export async function sendVerificationCode(email: string) {
  const resp = await axios.post('/auth/send-code', { email });
  return resp.data;
}

export async function verifyEmail(payload: { email: string; code: string }) {
  const response = await axios.post('/auth/verify-email', payload);
  return response.data;
}

export default { sendVerificationCode, verifyEmail };