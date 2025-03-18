import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import LoadingComponent from './components/LoadingComponent';
import { publicRoutes } from './routes';

function App() {
    return (
        <HelmetProvider>
            <Router>
                <Suspense fallback={<LoadingComponent />}>
                    <Routes>
                        {publicRoutes.map((route) => {
                            const Page = route.component;
                            const Layout = route.layout || Fragment;

                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </Suspense>
            </Router>
        </HelmetProvider>
    );
}

export default App;
