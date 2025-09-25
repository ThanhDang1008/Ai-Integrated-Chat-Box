import { CSSProperties } from "react";

interface IProps {
  url: string;
  style?: CSSProperties;
}

function MSDocRenderer(props:IProps) {
  const { url, style } = props;
  return (
    <>
      <iframe
        style={{
          width: style?.width ? style.width : "90%",
          height: style?.height ? style.height : "500px",
          ...style,
        }}
        //src={`https://view.officeapps.live.com/op/view.aspx?src=${url}&wdOrigin=BROWSELINK`}
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${url}`}
      />
    </>
  );
}

export default MSDocRenderer;
