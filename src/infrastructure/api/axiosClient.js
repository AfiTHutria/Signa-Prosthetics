import axios from 'axios'
import { env } from '@/shared/constants/env'

export const axiosClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
