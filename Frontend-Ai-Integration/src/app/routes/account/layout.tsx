import Account from "./page";
import RoleAccess from "@/app/auth/role.access";

function Layout() {
  return (
    <>
      <RoleAccess roles={["ADMIN", "USER"]}>
        <Account />
      </RoleAccess>
    </>
  );
}

export default Layout;
