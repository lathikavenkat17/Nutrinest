import axios from "axios";

export async function getValidToken() {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const expiry = parseInt(localStorage.getItem("expiry"), 10);

  if (new Date().getTime() > expiry - 60 * 1000) { // refresh 1 min before expiry
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/refresh/", {
        refresh: refreshToken,
      });
      const newToken = res.data.access;
      const newExpiry = new Date().getTime() + 15 * 60 * 1000;

      localStorage.setItem("token", newToken);
      localStorage.setItem("expiry", newExpiry);
      return newToken;
    } catch (error) {
      console.error("Token refresh failed");
      logout();
      return null;
    }
  }
  return token;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expiry");
  window.location.href = "/login";
}
