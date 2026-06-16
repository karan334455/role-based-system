import api from "@/app/axios";

export const getUsers = () =>
    api.get("/users");

export const createUser = (data) =>
    api.post("/users", data, { headers: { "Content-Type": "application/json" } });

export const updateUser = (id, data) =>
    api.put(`/users/${id}`, data);

export const deleteUser = (id) =>
    api.delete(`/users/${id}`);

export const getPendingUsers =
    () =>
        api.get(
            "/users/pending"
        );

export const resendInvite = (
    id
) =>
    api.post(
        `/users/${id}/resend-invite`
    );