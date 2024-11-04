import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";

import "react-toastify/dist/ReactToastify.min.css"
import { Provider } from "react-redux";
import store from "@/common/redux/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ToastContainer />
      <Component {...pageProps} />
    </Provider>
  );
}
