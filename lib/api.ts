const BASE_URL = "http://127.0.0.1:3002";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: HeadersInit;
}

async function request<T>(
  endpoint: string,
  { method = "GET", body, headers }: RequestOptions = {}
): Promise<T> {
  // Pega o token do localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // envia JWT se existir
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!res.ok) {
    throw new Error(`Erro na API: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, body: any) =>
    request<T>(endpoint, { method: "POST", body }),
  put: <T>(endpoint: string, body: any) =>
    request<T>(endpoint, { method: "PUT", body }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
