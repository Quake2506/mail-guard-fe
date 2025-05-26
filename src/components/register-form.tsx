import React, { useState } from 'react';
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

interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export function RegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<RegisterFormData>({
        email: '',
        password: '',
        confirmPassword: ''
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

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            // Registration successful, redirect to login page
            router.push('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error('Registration error:', err);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ mb: 2 }}>
                        Register
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
                                id="email"
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
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
                                autoComplete="new-password"
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                                required
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                label="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        </FormControl>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Typography
                                    component="a"
                                    href="/login"
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
                                    Login here
                                </Typography>
                            </Typography>
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{bgcolor:'black'}}
                        >
                            Register
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}