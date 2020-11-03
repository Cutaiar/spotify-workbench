import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.css";
import * as serviceWorker from "./serviceWorker";

// Prime react imports for webpack
import "primereact/resources/themes/bootstrap4-light-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { App } from "./components/App/App";
import PrimeReact from "primereact/utils";
PrimeReact.ripple = true;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
