import { useEffect } from "react";
import { useKeyStore } from "../stores/keyStore";

export function useKeys() {
  const store = useKeyStore();

  useEffect(() => {
    store.loadData();
  }, []);

  return store;
}
