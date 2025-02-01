// components/TimeLogForm.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    LocalizationProvider,
    TimePicker,
    DatePicker
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    Button,
    Box,
    Stack,
    Alert,
    Paper,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton, TextField
} from '@mui/material';
import { History as HistoryIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import api from '../utils/axiosConfig';

export default function TimeLogForm({ onSuccess }) {
    const { user } = useAuth();
    const [date, setDate] = useState(new Date());
    const [loginTime, setLoginTime] = useState(null);
    const [logoutTime, setLogoutTime] = useState(null);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Extract username from email
    const username = user?.email?.split('@')[0] || 'User';

    const handleSubmit = async () => {
        try {
            const payload = {
                date: format(date, 'yyyy-MM-dd'),
                loginTime: loginTime ? format(loginTime, 'HH:mm:ss') : null,
                logoutTime: logoutTime ? format(logoutTime, 'HH:mm:ss') : null
            };

            await api.post('/api/logs/submit', payload);

            setSuccessMsg('Time logged successfully!');
            setError('');
            setLoginTime(null);
            setLogoutTime(null);
            onSuccess();
            setTimeout(() => setSuccessMsg(''), 3000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit time log');
        }
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item md={6} >
                        <Box sx={{ mb: 2 }}>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

                            <DatePicker
                                label="Date"
                                value={date}
                                onChange={setDate}
                                sx={{ width: '100%', mb: 2 }}
                            />

                            <Stack spacing={2} sx={{ width: '100%', mb: 2 }}>
                                <TimePicker
                                    label="Login Time"
                                    value={loginTime}
                                    onChange={setLoginTime}
                                    ampm={false}
                                    sx={{ width: '100%' }}
                                />
                                <TimePicker
                                    label="Logout Time"
                                    value={logoutTime}
                                    onChange={setLogoutTime}
                                    ampm={false}
                                    sx={{ width: '100%' }}
                                />
                            </Stack>

                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={!loginTime && !logoutTime}
                                fullWidth
                                startIcon={<RefreshIcon />}
                                sx={{
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 500
                                }}
                            >
                                Submit Entry
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </LocalizationProvider>
    );
}