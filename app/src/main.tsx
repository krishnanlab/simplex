import React from "react";
import { createRoot } from "react-dom/client";
import { setupWorker } from "msw";
import { handlers } from "@/api/mock";
import App from "@/App";

(async () => {
  await setupWorker(...handlers).start();

  createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();
