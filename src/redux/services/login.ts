import axios from '../axiosConfig';

export interface LoginPayload {

    email:string;
    password: string;
}

export async function login(payload: LoginPayload) {
	// endpoint should be login - adjust if your API uses a different path
	const response = await axios.post('/auth/login', payload);
	return response.data;
}

export default {login}