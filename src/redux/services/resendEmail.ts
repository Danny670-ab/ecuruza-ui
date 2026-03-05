import axios from '../axiosConfig';

export async function resendVerificationEmail(email: string) {
  const resp = await axios.post('/auth/resend-verification', { email });
  return resp.data;
}
export default { resendVerificationEmail };