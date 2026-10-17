import { memo } from "react";
import { timeAgo } from "@/helpers/timeAgo";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const OrderRow = memo(function OrderRow({ order, t, language }) {
   return (
      <div className="flex gap-4">
         <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-secondary-container text-on-secondary rounded-full">
            <ShoppingBagIcon className="!text-[20px] text-blue-600" />
         </div>
         <div className="space-y-1">
            <p className="text-on-surface">
               {t("orders.order")}: #{order.id}{" "}
               <span className="mx-2 font-semibold">
                  {t("orders.customer")}: {order.customerName}
               </span>
               <br />
               {t(`orders.status.${order.status.toLowerCase()}`)}
            </p>
            <p className="text-secondary">
               {timeAgo(order.createdAt, language)} • {order.total}{" "}
               {t("orders.currency")}
            </p>
         </div>
      </div>
   );
});

export default OrderRow;
