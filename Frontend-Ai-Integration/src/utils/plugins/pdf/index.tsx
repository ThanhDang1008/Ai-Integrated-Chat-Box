import { CSSProperties } from "react";

interface IProps {
  uri: string;
  style?: CSSProperties;
}

function PdfRenderer(props: IProps) {
  const { uri, style } = props;
  return (
    <>
      <iframe
        style={{
          width: style?.width ? style.width : "90%",
          height: style?.height ? style.height : "500px",
          ...style,
        }}
        src={uri}
      />
    </>
  );
}

export default PdfRenderer;
