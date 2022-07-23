const BasicLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        margin: "0 auto",
      }}
    >
      <main
        style={{
          flexGrow: "0",
          flexShrink: "1",
          display: "flex",
          flexDirection: "column",
          background: "white",
          zIndex: "1",
          height: "100vh",
          maxHeight: "100%",
          position: "relative",
          width: "100%",
          overflow: "scroll",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default BasicLayout;
