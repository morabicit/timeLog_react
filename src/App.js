import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './AppRoutes'; // Create this new file

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;