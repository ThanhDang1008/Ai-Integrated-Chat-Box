import Header from "../../components/Header";
import { Outlet } from "react-router-dom";

function LayoutHeader() {
  return (
    <>
      <Header
        customStyles={{
          // classColorLetter: true,
          backgroundColor: "rgba(255, 250, 250, 0.11)",
        }}
      />
        <Outlet />
    </>
  );
}

export default LayoutHeader;
