function Loading() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        {/* <div className="spinner-grow" role="status">
          <span className="visually-hidden">Loading...</span>
        </div> */}
      </div>
    </>
  );
}

export default Loading;
