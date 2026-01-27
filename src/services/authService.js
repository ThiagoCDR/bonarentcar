const CURRENT_USER_KEY = 'bona_current_user';

export const authService = {
    login: async (email, password) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Falha no login');
        }

        const user = await response.json();
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
    },

    register: async (name, email, password) => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Falha no cadastro');
        }

        const user = await response.json();
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
    },

    googleLogin: async (token) => {
        // Send the token to your backend
        // We also extract payload to send name/email for easy registration on backend (mock/prototype style)
        // In real app, backend verifies token and gets email/name from Google directly
        const payload = JSON.parse(atob(token.split('.')[1]));

        const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token,
                email: payload.email,
                name: payload.name,
                picture: payload.picture
            })
        });

        if (!response.ok) {
            throw new Error('Falha no login com Google');
        }

        const user = await response.json();
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
    },

    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    getCurrentUser: () => {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    }
};
