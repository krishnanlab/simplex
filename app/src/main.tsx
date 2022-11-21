import React from "react";
import { createRoot } from "react-dom/client";
import { setupWorker } from "msw";
import { handlers } from "@/api/mock";
import App from "@/App";

(async () => {
  /** mock api responses */
  await setupWorker(...handlers).start();

  /** render app */
  createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();
