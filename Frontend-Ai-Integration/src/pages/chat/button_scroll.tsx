import React, { useState, useEffect } from "react";

interface ButtonScrollProps {
  target: React.RefObject<HTMLDivElement>;
  onClick?: () => void;
  visible: React.RefObject<HTMLDivElement>;
  icon: React.ReactNode;
}

function ButtonScroll(props: ButtonScrollProps) {
  const { target, onClick, visible, icon } = props;
  const [showButton, setShowButton] = useState(false);
 // console.log("showButton", showButton);

  useEffect(() => {
    const handleScroll = () => {
      // const scrollTop = target.current?.scrollTop;
      //console.log("scrollTop", scrollTop);
      if (!target.current) return;
      const scrollBottom =
        target.current.scrollTop + target.current.clientHeight;
      //console.log("scrollBottom", scrollBottom);
      const scrollHeight = target.current.scrollHeight;
      //console.log("scrollHeight", scrollHeight);
      const clientHeight = target.current.clientHeight;

      //console.log("clientHeight", clientHeight);

      // if (scrollTop < scrollHeight - clientHeight - 200) {
      //   setShowButton(true);
      //   //console.log("showButton",showButton);
      // }
      // if (scrollTop > scrollHeight - clientHeight - 200) {
      //   setShowButton(false);
      // }
      if (scrollBottom < scrollHeight - 300) {
        setShowButton(true);
      }
      if (scrollBottom > scrollHeight - 300) {
        setShowButton(false);
      }
      if (scrollHeight === clientHeight) {
        setShowButton(false);
      }
    };

    if (target.current?.scrollTop === 0) {
      setShowButton(false);
    }

    const chatWindow = target.current;

    chatWindow?.addEventListener("scroll", handleScroll);

    return () => {
      chatWindow?.removeEventListener("scroll", handleScroll);
    };
  }, [target.current?.scrollTop]);

  const scrollIntoView = () => {
    visible.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {showButton && (
        <div
          className="scroll_down"
          onClick={onClick ? onClick : scrollIntoView}
        >
          {icon}
        </div>
      )}
    </>
  );
}

export default ButtonScroll;
