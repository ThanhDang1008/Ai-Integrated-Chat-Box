import Conversation from "./page";
import RoleAccess from "@/app/auth/role.access";

function Layout() {
  return (
    <RoleAccess roles={["ADMIN", "USER"]}>
      <Conversation />
    </RoleAccess>
  );
}

export default Layout;
