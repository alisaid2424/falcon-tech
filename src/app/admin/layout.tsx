import AdminTabs from "./_components/AdminTabs";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AdminTabs />
      {children}
    </>
  );
};

export default AdminLayout;
