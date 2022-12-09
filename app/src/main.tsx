import React from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";

(async () => {
  /** mock api responses */
  const { setupWorker } = await import("msw");
  const { handlers } = await import("@/api/mock");
  await setupWorker(...handlers).start();

  /** render app */
  createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();
