const API = import.meta.env.VITE_API_URL;

async function client(path, options = {}) {
  const token = localStorage.getItem("token");
  const isForm = options.body instanceof FormData;
  const headers = {
    ...(!isForm ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response = await fetch(`${API}${path}`, { ...options, headers });
  if (response.status === 401) {
    // attempt refresh & retry once…
    const refresh = localStorage.getItem("refresh");
    const refreshResp = await fetch(`${API}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (refreshResp.ok) {
      const { access } = await refreshResp.json();
      localStorage.setItem("token", access);
      // retry original
      headers.Authorization = `Bearer ${access}`;
      response = await fetch(`${API}${path}`, { ...options, headers });
    } else {
      // refresh failed
      import("../contexts/AuthContext").then(({ logout }) => logout());
      throw new Error("Session expired");
    }
  }
  return response;
}

export default client;
