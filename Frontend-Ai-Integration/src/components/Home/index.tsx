import React, { useEffect, useRef } from "react";
import "./home.scss";
import Title from "./HomeTitle/Title";
import Homecard from "./HomeCard/HomeCard";
import Title2 from "./HomeTitle2.jsx/Title2";
import Cardlist from "./CardLists/CardList";
import Homeblog from "./HomeBlog/Homeblog";
import Cardtrial from "./CardTrial/Cardtrial";
import Lighteffects from "./LightEffects/Lighteffects";
import { FloatButton } from "antd";

function Home() {
  const titleRef = useRef(null);
  const homeblogRef = useRef(null);
  const homecardRef = useRef(null);
  const cardlistRef = useRef(null);
  const cardtrialRef = useRef(null);
  const title2Ref = useRef(null);

  useEffect(() => {
    const elements = [
      titleRef.current,
      homeblogRef.current,
      homecardRef.current,
      cardlistRef.current,
      cardtrialRef.current,
      title2Ref.current,
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry:any) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    elements.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      elements.forEach((el) => {
        if (el) {
          observer.unobserve(el);
        }
      });
    };
  }, []);

  return (
    <div className="home_container">
      <Lighteffects />
      <div ref={titleRef} className="animate-item">
        <Title />
      </div>
      {/* <div ref={homeblogRef} className="animate-item">
        <Homeblog />
      </div> */}
      <div ref={homecardRef} className="animate-item">
        <Homecard />
      </div>
      <div ref={cardlistRef} className="animate-item">
        <Cardlist />
      </div>
      <div
        style={{
          paddingBottom: "100px",
        }}
        ref={cardtrialRef}
        className="animate-item"
      >
        <Cardtrial />
      </div>
      {/* <div ref={title2Ref} className="animate-item">
        <Title2 />
      </div> */}
      <FloatButton.BackTop />
    </div>
  );
}

export default Home;
