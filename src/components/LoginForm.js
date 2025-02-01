import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    TextField,
    Button,
    Container,
    Box,
    Typography,
    Snackbar,
    Alert, Link
} from '@mui/material';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSignupRedirect = () => {
        navigate('/signup');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const success = await login(email, password);
            if (success) {
                navigate('/dashboard');
            } else {
                // Handle API returns success=false (e.g., invalid credentials)
                setError('Invalid email or password');
                setPassword(''); // Clear password field
            }
        } catch (err) {
            // Handle network errors or server errors
            const errorMessage = err.response?.data?.message ||
                'Login failed. Please try again later.';
            setError(errorMessage);
            setPassword(''); // Clear password field
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Timesheet Login
                </Typography>

                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError('')}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity="error" variant="filled">{error}</Alert>
                </Snackbar>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            autoFocus
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{ mt: 2 }}
                            fullWidth
                        >
                            Sign In
                        </Button>
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                                Don't have an account?
                            </Typography>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={handleSignupRedirect}
                                sx={{ textDecoration: 'none' }}
                            >
                                Sign Up
                            </Link>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Container>
    );
}