import { ApiError } from "@/lib/apiError";
import { API_BASE_URL } from "./config";
import type { StoredSession } from "./sessionStorage";

interface Credentials {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
  };
}

const AUTH_URL = `${API_BASE_URL}/api/v1/auth`;

async function postAuth(
  path: string,
  { email, password }: Credentials
): Promise<StoredSession> {

  const res = await fetch(`${AUTH_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data.detail || `Request failed (${res.status})`
    );
  }

  const authData = data as AuthResponse;

  if (!authData.access_token) {
    throw new ApiError(
      res.status,
      "Access token missing from server response."
    );
  }

  return {
    accessToken: authData.access_token,
    email: authData.user.email,
  };
}

export const login = (credentials: Credentials) =>
  postAuth("/login", credentials);

export const register = (credentials: Credentials) =>
  postAuth("/register", credentials);
