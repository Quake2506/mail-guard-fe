import React, { useState } from 'react';
import { setCookie } from 'cookies-next/client';
import {
    Box,
    Button,
    TextField,
    FormControl,
    Typography,
    Container,
    Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface LoginFormData {
    username: string;
    password: string;
}

export function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: '',
    });
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
        ...prevState,
        [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const formBody = new URLSearchParams({
                username: formData.username,
                password: formData.password
            }).toString();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody,
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            // Store the access token and email in cookies
            setCookie('access_token', data.access_token, {
                maxAge: 60 * 60 * 24, // 24 hours
                secure: true, // Only send over HTTPS
                sameSite: 'strict' // Protect against CSRF
            });
            setCookie('user_email', formData.username, {
                maxAge: 60 * 60 * 24, // 24 hours
                secure: true,
                sameSite: 'strict'
            });

            console.log('Login successful:', data);
            // Redirect to inbox page
            router.push('/inbox');
        } catch (err) {
            setError('Invalid username or password');
            console.error('Login error:', err);
        }
    };

    return (
        <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom sx={{mb: 2}}>
                Login
            </Typography>
            {error && (
                <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
                </Typography>
            )}
            <Box component="form" onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <TextField
                        required
                        id="username"
                        name="username"
                        label="Username"
                        value={formData.username}
                        onChange={handleChange}
                        autoComplete="username"
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <TextField
                        required
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                </FormControl>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Don't have an account?{' '}
                        <Typography
                            component="a"
                            href="/register"
                            variant="body2"
                            sx={{
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            Register here
                        </Typography>
                    </Typography>
                </Box>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ bgcolor: 'black', color: 'white'}}
                >
                    Login
                </Button>
            </Box>
            </Paper>
        </Box>
        </Container>
    );
};

export default LoginForm;