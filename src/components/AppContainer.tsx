import React from "react";

export default function AppContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // ocupa toda la pantalla
        width: "100%",
      }}
    >
      <main
        style={{
          flex: 1, // ocupa el espacio disponible
          width: "100%",
        }}
      >
        {children}
      </main>
    </div>
  );
}
