// src/utils/auth.ts
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};
