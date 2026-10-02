import axios from "axios"

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
})

export const checkBackend = async () => {
  const response = await api.get("/health/")
  return response.data
}

export default api