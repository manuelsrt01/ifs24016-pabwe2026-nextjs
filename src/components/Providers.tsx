"use client";

import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { authHydrated } from "@/features/auth/states/reducer";
import { getAccessToken } from "@/helpers/apiHelper";

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    store.dispatch(authHydrated(Boolean(getAccessToken())));
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
