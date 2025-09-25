import { Button, Result } from "antd";

function ServerError() {
  return (
    <>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={
          <Button onClick={() => window.location.reload()} type="primary">
            Try Again
          </Button>
        }
      />
    </>
  );
}

export default ServerError;
