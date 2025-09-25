import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from "react";

interface PromptTextareaProps {
  style?: React.CSSProperties;
  onPromptTextChange: (text: string) => void;
  actionEnter: () => void;
}

function PromptTextarea(
  props: PromptTextareaProps,
  ref: React.Ref<{
    getPromptText: () => string;
    clearPromptText: () => void;
    focusInput: () => void;
  }>
) {
  const [promptText, setPromptText] = useState("");
  const [rowTextarea, setRowTextarea] = useState(1);
  const { style, actionEnter } = props;
  const textarea = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    getPromptText: () => promptText,
    clearPromptText: () => setPromptText(""),
    focusInput: () => textarea.current?.focus(),
    resetRowTextarea: () => setRowTextarea(1),
  }));

  useEffect(() => {
    props.onPromptTextChange(promptText);
  }, [promptText]);

  //console.log("rowTextarea", rowTextarea);
  return (
    <>
      <textarea
        //maxLength={150}
        spellCheck="false"
        ref={textarea}
        placeholder="Type something..."
        style={{
          ...style,
          border: "none",
          outline: "none",
          resize: "none",
          height: rowTextarea >= 2 ? rowTextarea * 22 : 28,
        }}
        rows={rowTextarea}
        onChange={(e) => {
          const lines = e.target.value.split("\n");
          //console.log("lines", lines);
          setRowTextarea(lines.length);
          setPromptText(e.target.value);
        }}
        value={promptText}
        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          //console.log("e.key", e);
          //enter gửi tin nhắn
          if (!e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            setRowTextarea(1);
            actionEnter();
          }
          //shift xuống dòng
          // if (e.key === "Shift" && e.keyCode === 13) {
          //   console.log("rowTextarea___");
          //   e.preventDefault();
          // }
          if (e.key === "Enter") {
            setRowTextarea((prev) => prev + 1);
          }
          // //nếu xoá row thì giảm row
          // if (e.key === "Backspace") {
          //   const lines = promptText.split("\n");
          //   const currentLine = textarea.current?.selectionStart
          //     ? promptText
          //         .substring(0, textarea.current.selectionStart)
          //         .split("\n").length
          //     : 0;
          //   if (lines[currentLine - 1] === "") {
          //     setRowTextarea((prev) => Math.max(prev - 1, 1));
          //     //console.log("Backspace");
          //   }
          // }
        }}
      />
    </>
  );
}

export default forwardRef(PromptTextarea);
