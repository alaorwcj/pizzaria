import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useAuth = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email, password) => {
                const formData = new FormData();
                formData.append('username', email);
                formData.append('password', password);

                try {
                    const res = await axios.post('/api/v1/users/login', formData);
                    const { access_token, user } = res.data;

                    set({
                        user,
                        token: access_token,
                        isAuthenticated: true
                    });

                    // Set default header for future requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                    return true;
                } catch (err) {
                    console.error("Login failed", err);
                    throw err;
                }
            },

            register: async (userData) => {
                try {
                    await axios.post('/api/v1/users/register', userData);
                    return true;
                } catch (err) {
                    console.error("Registration failed", err);
                    throw err;
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
                delete axios.defaults.headers.common['Authorization'];
            },

            initAuth: () => {
                const token = get().token;
                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
            }
        }),
        {
            name: 'daniels-auth-storage',
        }
    )
);
