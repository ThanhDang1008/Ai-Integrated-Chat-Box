import * as React from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
// import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Loading from "@/components/Loading";

type AppProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <>
      <React.Suspense fallback={<Loading />}>
        <Provider store={store}>
          {/* <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> */}
          <QueryClientProvider client={queryClient}>
           {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
          {/* </GoogleOAuthProvider> */}
        </Provider>
      </React.Suspense>
    </>
  );
};
