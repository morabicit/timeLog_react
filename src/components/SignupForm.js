import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    Container,
    Box,
    Typography,
    Link,
    Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../utils/axiosConfig';

const validationSchema = Yup.object({
    fullName: Yup.string()
        .min(2, 'Must be at least 2 characters')
        .max(100, 'Must be less than 100 characters')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(8, 'Minimum 8 characters').required('Required'),
    mobileNumber: Yup.string()
        .matches(/^01[0-9]{9}$/, 'Invalid Egyptian mobile number')
        .length(11, 'Must be 11 digits')
        .required('Required'),
    dateOfBirth: Yup.date()
        .required('Date of birth is required')
        .max(new Date(), 'Date of birth must be in the past')
});

export default function SignupForm() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            password: '',
            mobileNumber: '',
            dateOfBirth: null
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setError('');
                setSuccessMessage('');

                const payload = {
                    ...values,
                    dateOfBirth: values.dateOfBirth.toISOString().split('T')[0]
                };

                const response = await api.post('/auth/signup', payload);

                if (response.status === 200) {
                    setSuccessMessage('Registration successful! Redirecting to login...');
                    setTimeout(() => navigate('/login'), 2000);
                }
            } catch (err) {
                setError(err.response?.data || 'Registration failed. Please try again.');
            }
        },
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="xs">
                <Box sx={{ mt: 8, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>Create Account</Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={formik.handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                name="fullName"
                                label="Full Name"
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                                helperText={formik.touched.fullName && formik.errors.fullName}
                                fullWidth
                            />

                            <TextField
                                name="email"
                                label="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                fullWidth
                            />

                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                fullWidth
                            />

                            <TextField
                                name="mobileNumber"
                                label="Mobile Number"
                                value={formik.values.mobileNumber}
                                onChange={formik.handleChange}
                                error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                                helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                                fullWidth
                            />

                            <DatePicker
                                label="Date of Birth"
                                value={formik.values.dateOfBirth}
                                onChange={(value) => formik.setFieldValue('dateOfBirth', value)}
                                maxDate={new Date()}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                                        helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                                        required
                                    />
                                )}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? 'Registering...' : 'Sign Up'}
                            </Button>

                            <Link
                                href="/login"
                                variant="body2"
                                sx={{ mt: 1, textAlign: 'center' }}
                            >
                                Already have an account? Login
                            </Link>
                        </Box>
                    </form>
                </Box>
            </Container>
        </LocalizationProvider>
    );
}