import { ReactNode } from 'react';
// import Footer from './Footer';
// import Header from './Header';

const DefaultLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            {/* <Header /> */}
            {children}
            {/* <Footer /> */}
        </div>
    );
};

export default DefaultLayout;
