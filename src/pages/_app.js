import Layout from "@/components/Layouts/Layout";
import "@/styles/globals.css";
import { CustomContextProvider } from "@/context/Customcontext";
import { ToastContainer } from "react-toastify";
import AdminLayout from "@/components/Layouts/Adminlayout";
import { useRouter } from "next/router";
import ICLayout from "@/components/Layouts/IClayout";
import { AuthProvider } from "@/utils/AuthContent";
import { ModalProvider } from "@/context/ModalContext";

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
        <AuthProvider>
          <AdminLayout session={session}>
            <Component {...pageProps} />
            <ToastContainer />
          </AdminLayout>
        </AuthProvider>
      </div>
    );
  }
  if (isICPage) {
    return (
      <div>
        <AuthProvider>
          <ICLayout>
            <Component {...pageProps} />
            <ToastContainer />
          </ICLayout>
        </AuthProvider>
      </div>
    );
  }

  return (
    <CustomContextProvider>
      <ModalProvider>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
      </ModalProvider>
    </CustomContextProvider>
  );
}
