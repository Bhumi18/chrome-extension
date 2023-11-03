import React from "react";
import { createRoot } from "react-dom/client";

const Popup = () => {
  return (
    <div>
      <h1>Pop up</h1>
    </div>
  );
};

// const container = document.getElementById("root");
// const root = createRoot(container!);
// root.render(
//   <React.StrictMode>
//     <Popup />
//   </React.StrictMode>
// );
const container = document.getElementById("react-target");
const root = createRoot(container!);
root.render(<Popup />);
