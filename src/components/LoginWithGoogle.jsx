import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginWithGoogle = () => {
    const navigate = useNavigate();
    const { loginWithGoogle } = useAuth(); // We need to add this to AuthContext

    const handleSuccess = async (credentialResponse) => {
        try {
            const user = await loginWithGoogle(credentialResponse.credential);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/client');
            }
        } catch (error) {
            console.error("Google Login Error:", error);
            alert("Falha no login com Google");
        }
    };

    const handleError = () => {
        console.log('Login Failed');
        alert("Login com Google falhou.");
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
            />
        </div>
    );
};

export default LoginWithGoogle;
