import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { ToddlerWorldView } from "./components/ToddlerWorldView";
import "./index.css";

function Preview() {
  const [nonce] = useState(1);
  return (
    <ToddlerWorldView
      initialLaunchNonce={nonce}
      onStartAssessment={() => undefined}
      onRequestExit={() => undefined}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
);
