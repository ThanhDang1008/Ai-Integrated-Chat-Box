import Register from "./page";
import RoleAccess from "@/app/auth/role.access";

function Layout() {
  return (
    <>
     <RoleAccess
        roles={["GUEST"]}
        routeAuth={true}
      >
        <Register />
      </RoleAccess>
    </>
  );
}

export default Layout;
