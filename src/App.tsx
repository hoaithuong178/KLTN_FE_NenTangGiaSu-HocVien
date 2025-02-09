import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { publicRoutes } from './routes';

function App() {
    return (
        <Router>
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    return <Route key={index} path={route.path} element={<Page />} />;
                })}
            </Routes>
        </Router>
    );
}

export default App;
