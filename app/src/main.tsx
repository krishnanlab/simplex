import React from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";

import { setupWorker } from "msw";
import { handlers } from "@/api/mock";

(async () => {
  await setupWorker(...handlers).start();

  createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();
