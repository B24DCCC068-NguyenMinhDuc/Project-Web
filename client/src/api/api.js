import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:5000/api' });

export const loginAPI = (data) => api.post('/login', data);
export const registerAPI = (data) => api.post('/register', data); // Mới
export const getDataAPI = () => api.get('/data');
export const updateAppointmentAPI = (id, data) => api.put(`/appointments/${id}`, data);
export const addAppointmentAPI = (data) => api.post('/appointments', data);
export const addDoctorAPI = (data) => api.post('/doctors', data);
export const addPatientAPI = (data) => api.post('/patients', data);
export const updatePatientAPI = (id, data) => api.put(`/patients/${id}`, data);
export const deletePatientAPI = (id) => api.delete(`/patients/${id}`);
export const registerScheduleAPI = (id, data) => api.post(`/doctors/${id}/schedule`, data);
export const getDoctorAppointmentsAPI = (doctorId) => api.get(`/doctors/${doctorId}/appointments`);
// Thêm vào api.js
export const googleLoginAPI = (data) => api.post('/google-login', data);
export default api;