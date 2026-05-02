import client from "./client";

// Get current user profile
export const getProfile = () => client.get("/users/me");

// Update name or email
export const updateProfile = (data) => client.put("/users/me", data);

// Change password
export const changePassword = (data) => client.put("/users/me/password", data);
