import { memo } from "react";

const StatCard = memo(function StatCard({
   label,
   value,
   Icon,
   iconBg,
   iconColor,
}) {
   return (
      <div className="dashboard-card">
         <div className="flex justify-between items-start mb-4">
            <div className={`${iconBg} ${iconColor} p-3 rounded-xl`}>
               <Icon fontSize="small" />
            </div>
         </div>
         <p className="text-secondary uppercase tracking-wider">{label}</p>
         <h3 className="text-2xl font-bold mt-1.5">{value ?? 0}</h3>
      </div>
   );
});

export default StatCard;
