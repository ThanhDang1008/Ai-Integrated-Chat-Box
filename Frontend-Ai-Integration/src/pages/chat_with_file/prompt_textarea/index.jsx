import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";

function PromptTextarea(props, ref) {
  const [promptText, setPromptText] = useState("");
  const [rowTextarea, setRowTextarea] = useState(1);
  const { useEnterSend, useShiftNewLine, actionEnter,style } = props;
  

  useImperativeHandle(ref, () => ({
    getPromptText: () => promptText,
    clearPromptText: () => setPromptText(""),
    resetRowTextarea: () => setRowTextarea(1),
  }));

  useEffect(() => {
    props.onPromptTextChange(promptText);
  }, [promptText]);

  return (
    <>
      <textarea
        //maxLength={150}
        spellCheck="false"
        placeholder="Hãy viết gì đó..."
        style={{
         ...style,
         height: rowTextarea >= 2 ? rowTextarea * 24 : 28,
         resize: "none",
         border: "none",
         outline: "none",
         minHeight: 28,
         maxHeight: 300,
        }}
        rows={rowTextarea}
        onChange={(e) => {
          const lines = e.target.value.split("\n");
          //console.log("lines", lines);
          setRowTextarea(lines.length);
          setPromptText(e.target.value);
        }}
        onKeyDown={(e) => {
          //console.log("e.key", e);
          if (useEnterSend) {
            //enter gửi tin nhắn
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              setRowTextarea(1);
              actionEnter();
            }
          }
         
          if (useShiftNewLine) {
            //shift xuống dòng
            // if (e.key === "Shift" && e.key === "Enter") {
            //   //setPromptText((prev) => `${prev}\n`);
            //   e.preventDefault();
            // }
            if (e.key === "Enter") {
              setRowTextarea((prev) => prev + 1);
            }
          }
        }}
        value={promptText}
      />
    </>
  );
}

export default forwardRef(PromptTextarea);
