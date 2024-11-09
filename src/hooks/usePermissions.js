import { SidebarData } from "../components/sidebar/SidebarData";
import { useUserSelector } from "./useUserSelector";

const usePermissions = () => {
  const { user } = useUserSelector();

  const userPermissions = user?.role?.permissions ?? [];
  const allowedPermissions = [];

  for (let value of SidebarData) {
    if (value.sectionTitle === "Dashboard") continue;

    let navItem = {
      sectionTitle: value.sectionTitle,
      navItems: [],
    };

    for (let item of value.navItems) {
      if (userPermissions.includes(item.groupTitle)) {
        navItem.navItems.push(item);
      }
    }

    if (navItem.navItems.length > 0) {
      allowedPermissions.push(navItem);
    }
  }

  const paths = allowedPermissions
    .map((permission) => permission.navItems.map((item) => item.path))
    .flat();

  return { allowedPermissions, paths };
};

export default usePermissions;
