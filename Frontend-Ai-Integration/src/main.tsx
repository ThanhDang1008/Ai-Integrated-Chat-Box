// import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/index";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/global.scss";

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");

createRoot(root).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
