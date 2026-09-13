import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

const MainLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer/>
        </>
    );
};

export default MainLayout;