import { apiFetch } from "./client";

export function register({ name, email, password }) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function login({ email, password }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function loginWithGoogle(credential) {
  return apiFetch("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
}

export function logout() {
  return apiFetch("/auth/logout", { method: "POST" });
}

export function me() {
  return apiFetch("/auth/me");
}
