import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div>
      <Header customStyles={{}} />
      <Outlet />
      <Footer />
    </div>
  );
}

export default MainLayout;
