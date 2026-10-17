const PageHeader = ({ title, subtitle, children }) => {
   return (
      <section className="flex flex-wrap justify-between items-end gap-4 mb-7">
         <div>
            <h2 className="page-title mb-5">{title}</h2>
            <p className="page-subtitle">{subtitle}</p>
         </div>

         {children && <div className="flex items-center gap-2">{children}</div>}
      </section>
   );
};

export default PageHeader;
