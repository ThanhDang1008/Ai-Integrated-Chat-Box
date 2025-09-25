import Footer from "../../components/Footer";
import { Outlet } from "react-router-dom";


function LayoutFooter () {
  return (
    <>
        <Outlet />
        <Footer />
    </>
  )
}

export default LayoutFooter;