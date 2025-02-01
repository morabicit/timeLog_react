import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axiosConfig';
import {
    Button,
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    IconButton, MenuItem, Dialog, Menu, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {History, Refresh, Logout, MoreVert, Edit, Delete} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import TimeLogForm from './TimeLogForm';
import {useNavigate} from "react-router-dom";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [timeLogs, setTimeLogs] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyMonth, setHistoryMonth] = useState(new Date());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [fullName, setFullName] = useState(user?.name || '');
    const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '');
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const fetchTodayLogs = async () => {
        try {
            const response = await api.get('/api/logs/today');
            setTimeLogs(response.data ? [response.data] : []);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    const fetchMonthHistory = async (monthDate) => {
        try {
            const month = format(monthDate, 'yyyy-MM');
            const response = await api.get(`/api/logs/history?month=${month}`);
            setHistory(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    useEffect(() => {
        fetchTodayLogs();
        if (showHistory) {
            fetchMonthHistory(historyMonth);
        }
    }, [showHistory, historyMonth]);

    const groupedHistory = history.reduce((acc, log) => {
        const dateStr = format(parseISO(log.date), 'yyyy-MM-dd');
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(log);
        return acc;
    }, {});
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteUser = async () => {
        try {
            console.log(user)
            await api.delete(`/api/users/${user.id}`);
            navigate('/login')
        } catch (error) {
            console.error('Error deleting account:', error);
        }
        setDeleteDialogOpen(false);
    };

    const handleUpdateUser = async () => {
        try {
            const updates = { fullName, mobileNumber };
            const response = await api.patch(`/api/users/${user.id}`, updates);
            alert('Account updated successfully');
            console.log(response.data)
//            setUser(response.data);
        } catch (error) {
            console.error('Error updating account:', error);
        }
        setEditDialogOpen(false);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header Section */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    backgroundColor: '#f5f5f5',
                    p: 3,
                    borderRadius: 2
                }}>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        Welcome, {user?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant={showHistory ? "contained" : "outlined"}
                            onClick={() => setShowHistory(!showHistory)}
                            startIcon={<History />}
                        >
                            History
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={logout}
                            startIcon={<Logout />}
                            color="error"
                        >
                            Logout
                        </Button>
                        {/* More Options Dropdown */}
                        <IconButton onClick={handleMenuOpen}>
                            <MoreVert />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => { setEditDialogOpen(true); handleMenuClose(); }}>
                                <Edit sx={{ mr: 1 }} /> Edit Account
                            </MenuItem>
                            <MenuItem onClick={() => { setDeleteDialogOpen(true); handleMenuClose(); }} sx={{ color: 'error.main' }}>
                                <Delete sx={{ mr: 1 }} /> Delete Account
                            </MenuItem>
                        </Menu>

                        {/* Delete Confirmation Dialog */}
                        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogContent>
                                <Typography>Are you sure you want to delete your account? This action cannot be undone.</Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                                <Button color="error" onClick={handleDeleteUser}>Delete</Button>
                            </DialogActions>
                        </Dialog>

                        {/* Edit Account Dialog */}
                        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                            <DialogTitle>Edit Account</DialogTitle>
                            <DialogContent>
                                <TextField
                                    label="Full Name"
                                    fullWidth
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                                <TextField
                                    label="Mopbile Number"
                                    fullWidth
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                                <Button color="primary" onClick={handleUpdateUser}>Save</Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>

                {/* Main Content Grid */}
                <Grid container spacing={4}>
                    {/* Today's Time Log Section */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
                                Daily Time Tracking
                            </Typography>
                            <TimeLogForm onSuccess={fetchTodayLogs} />
                        </Paper>

                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
                                Today's Entries
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }} align="center">Login</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }} align="center">Logout</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {timeLogs.map((log, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>{format(parseISO(log.date), 'dd MMM yyyy')}</TableCell>
                                                <TableCell align="center">{log.loginTime || '--:--'}</TableCell>
                                                <TableCell align="center">{log.logoutTime || '--:--'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    {/* History Section */}
                    {showHistory && (
                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 3,
                                    gap: 2
                                }}>
                                    <DatePicker
                                        views={['month', 'year']}
                                        label="Select Month"
                                        value={historyMonth}
                                        onChange={setHistoryMonth}
                                        format="MMM yyyy"
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <IconButton
                                        onClick={() => fetchMonthHistory(historyMonth)}
                                        color="primary"
                                    >
                                        <Refresh />
                                    </IconButton>
                                </Box>

                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }} align="center">Logins</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }} align="center">Logouts</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {history.map((log, index) => (
                                                <TableRow key={index} hover>
                                                    <TableCell>{format(parseISO(log.date), 'dd MMM yyyy')}</TableCell>
                                                    <TableCell align="center">{log.loginTime || '--:--'}</TableCell>
                                                    <TableCell align="center">{log.logoutTime || '--:--'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </LocalizationProvider>
    );
}