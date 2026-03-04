import axios from '../axiosConfig';

export interface RegisterPayload {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
	role?: string;
}

export async function registerUser(payload: RegisterPayload) {
	const response = await axios.post('/auth/register', payload);
	return response.data;
}

export default { registerUser };
