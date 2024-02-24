import Layout from "@/components/Layouts/Layout";
import "@/styles/globals.css";
import { CustomContextProvider } from "@/context/Customcontext";
import { ToastContainer } from "react-toastify";
import AdminLayout from "@/components/Layouts/Adminlayout";
import { useRouter } from "next/router";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith("/admin");
  const isICPage = router.pathname.startsWith("/integratedC");


  if (isAdminPage) {
    return (
      <div>
        <AdminLayout session={session}>
          <Component {...pageProps} />
          <ToastContainer />
        </AdminLayout>
      </div>
    );
  }
  if (isICPage) {
    return (
      <div>
        <AdminLayout>
          <Component {...pageProps} />
          <ToastContainer />
        </AdminLayout>
      </div>
    );
  }

  return (
    <CustomContextProvider>
      <Layout>
        <Component {...pageProps} />
        <ToastContainer />
      </Layout>
    </CustomContextProvider>
  );
}
