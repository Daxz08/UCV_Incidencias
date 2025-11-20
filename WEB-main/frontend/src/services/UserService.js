import { apiRequest } from "./api";

export async function getAllUsers() {
  return apiRequest("/users");
}

export async function registerUser(user) {
  return apiRequest("/users/register", {
    method: "POST",
    body: user,
  });
}

export async function updateUser(id, user) {
  return apiRequest(`/users/${id}`, {
    method: "PUT",
    body: user,
  });
}

export async function deleteUser(id) {
  return apiRequest(`/users/${id}`, {
    method: "DELETE",
  });
}
