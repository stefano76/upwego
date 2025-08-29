import { getMenuItems } from "@/lib/menu";
import Header from "../Header";

export default async function GetHeader() {
  const menuItems = await getMenuItems();
  return <Header menuItems={menuItems} />;
}