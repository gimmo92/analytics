import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppraisalDistributionView } from "./modules/performance/analytics/appraisal-distribution/AppraisalDistributionView";
import "./styles/tokens.css";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppraisalDistributionView />
  </StrictMode>,
);
