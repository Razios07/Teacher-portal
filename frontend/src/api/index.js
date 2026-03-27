import api from './axios'

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
  logout:   ()     => api.post('/auth/logout'),
  listUsers:()     => api.get('/users'),
}

export const teacherAPI = {
  getAll:  ()           => api.get('/teachers'),
  getOne:  (id)         => api.get(`/teachers/${id}`),
  create:  (data)       => api.post('/teachers', data),
  update:  (id, data)   => api.put(`/teachers/${id}`, data),
  delete:  (id)         => api.delete(`/teachers/${id}`),
}
