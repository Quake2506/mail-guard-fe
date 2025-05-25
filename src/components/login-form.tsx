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
            // Store the access token in a cookie
            setCookie('access_token', data.access_token, {
                maxAge: 60 * 60 * 24, // 24 hours
                secure: true, // Only send over HTTPS
                sameSite: 'strict' // Protect against CSRF
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
            <Typography component="h1" variant="h5" align="center" gutterBottom>
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
                <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                    required
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                />
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                        bgcolor: 'black',
                        color: 'white',
                        '&:hover': {
                            bgcolor: '#333'
                        }
                    }}
                >
                    Sign In
                </Button>
            </Box>
            </Paper>
        </Box>
        </Container>
    );
};

export default LoginForm;