import Admin from "./page";
import RoleAccess from "@/app/auth/role.access";

function Layout() {
  return (
    <>
      <RoleAccess roles={["ADMIN"]}>
        <Admin />
      </RoleAccess>
    </>
  );
}

export default Layout;
