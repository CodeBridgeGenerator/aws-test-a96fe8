import AppSideBar from "./appSideBar/AppSideBar.js";

/*

import ProductsPage from "../ProductsPage/ProductsPage";
import CartitemPage from "../CartitemPage/CartitemPage";
import CartitemhistoryPage from "../CartitemhistoryPage/CartitemhistoryPage";
import CategoryPage from "../CategoryPage/CategoryPage";
import VoucherPage from "../VoucherPage/VoucherPage";
~cb-add-import~

~cb-add-services-card~

case "products":
                return <ProductsPage />;
case "cartitem":
                return <CartitemPage />;
case "cartitemhistory":
                return <CartitemhistoryPage />;
case "category":
                return <CategoryPage />;
case "voucher":
                return <VoucherPage />;
~cb-add-thurthy~

*/

const AppLayout = (props) => {
  const { children, activeKey, activeDropdown } = props;

  return (
    <div className="flex min-h-[calc(100vh-5rem)] mt-20 bg-white">
      <AppSideBar activeKey={activeKey} activeDropdown={activeDropdown} />
      <div className="flex-1 ml-2">{children}</div>
    </div>
  );
};

export default AppLayout;
