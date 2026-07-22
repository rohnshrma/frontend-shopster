const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const API = async (path, options = {}) => {
  const tokenType = options.tokenType;
  delete options.tokenType;

  let token;
  if (tokenType === "admin") {
    token = localStorage.getItem("token");
  } else if (tokenType === "buyer") {
    token = localStorage.getItem("buyerToken");
  } else {
    token = localStorage.getItem("buyerToken") || localStorage.getItem("token");
  }

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export default API;
