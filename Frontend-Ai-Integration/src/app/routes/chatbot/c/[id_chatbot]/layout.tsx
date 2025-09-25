import DetailChatBot from "./page";
import RoleAccess from "@/app/auth/role.access";

function Layout() {
  return (
    <RoleAccess roles={["ADMIN", "USER"]}>
      <DetailChatBot />
    </RoleAccess>
  );
}

export default Layout;
