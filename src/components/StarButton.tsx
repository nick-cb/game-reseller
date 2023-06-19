"use client";

import React, { useEffect, useRef, useState } from "react";
import { StarContainer } from "@/components/StarContainer";

const StarButton = ({
  children,
  className = "",
  onMouseUp,
  onMouseDown,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [particleAnimations, setParticleAnimations] = useState<Animation[]>([]);

  useEffect(() => {
    const stars = buttonRef.current?.querySelectorAll(".star");
    if (stars) {
      const animate = (star: HTMLDivElement) => {
        star.animate(
          {
            opacity: [0, 0.5, 1, 1, 1, 1, 0.5, 0],
            // rotate: [
            //   `${Math.random() * 45}deg`,
            //   `${Math.random() * 90 - 45}deg`,
            // ],
          },
          {
            duration: 3000,
            easing: "linear",
          }
        );
      };
      // stars.forEach((star, index) => {
      //   requestAnimationFrame(() => {
      //     setTimeout(() => {
      //       animate(star as HTMLDivElement);
      //       setInterval(() => {
      //         animate(star as HTMLDivElement);
      //       }, index + stars.length * 4000);
      //     }, index * 5000);
      //   });
      // });
    }
  }, []);

  const getAddition = (translateDistance: number) => {
    return (
      Math.random() * -translateDistance +
      (Math.max(1, translateDistance) - Math.min(1, translateDistance))
    );
  };

  return (
    <button
      ref={buttonRef}
      className={`star-button group w-full py-4 rounded 
      flex justify-center shadow-black shadow-md
      relative overflow-hidden transition-transform duration-75 ${className}`}
      onMouseDown={(event) => {
        onMouseDown?.(event);
        const container = containerRef.current as HTMLDivElement;
        if (!container) {
          return;
        }
        const center = container.querySelector(".particle-container-center");
        const centerLeft = (center as HTMLDivElement).offsetLeft;
        const centerRight = container.clientWidth - centerLeft;
        const centerTop = (center as HTMLDivElement).offsetTop;
        const centerBottom = container.clientHeight - centerTop;
        const dots: NodeListOf<HTMLDivElement> =
          container.querySelectorAll(".dot");
        const animations: Animation[] = [];
        dots.forEach((dot) => {
          let translate = "";
          if (dot.offsetLeft < centerLeft) {
            const translateDistance = centerLeft / dot.offsetLeft;
            translate =
              translate +
              `translateX(${translate + getAddition(translateDistance)}px) `;
          }
          if (dot.offsetLeft > centerRight) {
            const translateDistance =
              centerRight / (container.clientWidth - dot.offsetLeft);
            translate =
              translate +
              `translateX(-${
                translateDistance + getAddition(translateDistance)
              }px) `;
          }
          if (dot.offsetTop < centerTop) {
            const translateDistance = centerTop / dot.offsetTop;
            translate =
              translate +
              `translateY(${
                translateDistance + getAddition(translateDistance)
              }px) `;
          }
          if (dot.offsetTop > centerBottom) {
            const translateDistance =
              centerBottom / (container.clientHeight - dot.offsetTop);
            translate =
              translate +
              `translateY(-${
                translateDistance + getAddition(translateDistance)
              }px) `;
          }
          const animation = dot.animate(
            {
              transform: translate,
            },
            {
              duration: 1000,
              easing: "ease-out",
              fill: "forwards",
            }
          );
          animations.push(animation);
        });
        setParticleAnimations(animations);
      }}
      onMouseUp={(event) => {
        onMouseUp?.(event);
        for (const animation of particleAnimations) {
          animation.reverse();
        }
      }}
      {...props}
    >
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <StarContainer ref={containerRef} root={buttonRef.current} />
      {children}
      {/* <div className="star-cover" /> */}
      {/* <div className="star-button-glow absolute left-0 right-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity"> */}
      {/*   <div className="star-button-glow-line" /> */}
      {/*   <div className="star-button-glow-line-blur absolute bottom-0 left-0 right-0" /> */}
      {/* </div> */}
      {/* <div className="star-button-text w-max text-lg">Buy now</div> */}
    </button>
  );
};

export default StarButton;
