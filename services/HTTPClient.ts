import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

export const HttpClient = () => {
	const client: AxiosInstance = axios.create({
		baseURL: process.env.EXPO_PUBLIC_POKEAPI_URL ?? '/',
		timeout: 3 * 60 * 1000,
	});

	client.interceptors.request.use(async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
		config.headers['Content-Type'] = 'application/json';
		config.headers['Accept'] = 'application/json';

		return config;
	});

	return { client };
};