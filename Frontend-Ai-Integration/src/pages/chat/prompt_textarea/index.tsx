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

  return (
    <>
      <textarea
        //maxLength={150}
        spellCheck="false"
        ref={textarea}
        placeholder="Type something..."
        style={{
          ...style,
          height: rowTextarea >= 2 ? rowTextarea * 22 : 28,
          resize: "none",
          border: "none",
          outline: "none",
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
          if (e.key === "Enter") {
            setRowTextarea((prev) => prev + 1);
          }
          //shift xuống dòng
          // if (e.key === "Shift" && e.keyCode === 13) {
          //   e.preventDefault();
          // }
        }}
      />
    </>
  );
}

export default forwardRef(PromptTextarea);
