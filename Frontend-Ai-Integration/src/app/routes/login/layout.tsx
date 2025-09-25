import Login from "./page";
import RoleAccess from "@/app/auth/role.access";

function LayoutLoginPage() {
  return (
    <>
      <RoleAccess
        roles={["GUEST"]}
        routeAuth={true}
      >
        <Login />
      </RoleAccess>
    </>
  );
}

export default LayoutLoginPage;
