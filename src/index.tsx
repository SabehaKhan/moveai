import { createRoot } from "react-dom/client";
import "@canva/app-ui-kit/styles.css";
import { App } from "./app";

const root = createRoot(document.getElementById("root") as Element);

function render() {
  root.render(<App />);
}

render();

if (module.hot) {
  module.hot.accept("./app", render);
}
