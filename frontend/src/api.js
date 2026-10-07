import axios from "axios"

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
})

export const checkBackend = async () => {
  const response = await api.get("/health/")
  return response.data
}

export const loginUser = async (username, password) => {
  const response = await api.post("/auth/login/", {
    username,
    password,
  })

  localStorage.setItem("access_token", response.data.access)
  localStorage.setItem("refresh_token", response.data.refresh)

  return response.data
}

export const registerUser = async (username, email, password) => {
  const response = await api.post("/auth/register/", {
    username,
    email,
    password,
  })

  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me/")
  return response.data
}

export const getCategories = async () => {
  const response = await api.get("/categories/")
  return response.data
}

export const getEmails = async () => {
  const response = await api.get("/emails/")
  return response.data
}

export const updateEmail = async (id, data) => {
  const response = await api.patch(`/emails/${id}/`, data)
  return response.data
}

export const getActions = async () => {
  const response = await api.get("/actions/")
  return response.data
}

export const updateAction = async (id, data) => {
  const response = await api.patch(`/actions/${id}/`, data)
  return response.data
}

export const getDrafts = async () => {
  const response = await api.get("/drafts/")
  return response.data
}

export const updateDraft = async (id, data) => {
  const response = await api.patch(`/drafts/${id}/`, data)
  return response.data
}

export const getActivity = async () => {
  const response = await api.get("/activity/")
  return response.data
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api