"use client";

import React, { useEffect, useRef, useState } from "react";
import StarContainer from "@/components/StarContainer";

const StarButton = ({
  children,
  className = "",
  onPointerUp,
  onPointerDown,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // const [buttonAnimation, setButtonAnimation] = useState<Animation>();
  const [particles, setParticles] = useState<
    { target: HTMLDivElement; visible: boolean }[]
  >([]);
  // const [animation, setAnimations] = useState<Animation[]>([]);
  const buttonAnimation = useRef<Animation>();
  const animations = useRef<Animation[]>([]);

  useEffect(() => {
    const ids: NodeJS.Timeout[] = [];
    const stars = buttonRef.current?.querySelectorAll(".star");
    if (stars) {
      const animate = (star: HTMLDivElement) => {
        star.animate(
          {
            opacity: [0, 0.5, 1, 1, 1, 1, 0.5, 0],
          },
          {
            duration: 3000,
            easing: "linear",
          }
        );
      };
      stars.forEach((star, index) => {
        requestAnimationFrame(() => {
          const id = setTimeout(() => {
            animate(star as HTMLDivElement);
            setInterval(() => {
              animate(star as HTMLDivElement);
            }, index + stars.length * 4000);
          }, index * 5000);
          ids.push(id);
        });
      });
    }
    return () => {
      for (const id of ids) {
        clearTimeout(id);
      }
    };
  }, []);

  useEffect(() => {
    const button = buttonRef.current;
    const container = containerRef.current;
    if (!button || !container) {
      return;
    }
    const visibleLeftBound = (container.clientWidth - button.clientWidth) / 2;
    const visibleRightBound = visibleLeftBound + button.clientWidth;
    const visibleTopBound = (container.clientHeight - button.clientHeight) / 2;
    const visibleBottomBound = visibleTopBound + button.clientHeight;
    const dots: NodeListOf<HTMLDivElement> = button?.querySelectorAll(".dot");

    const particles: { target: HTMLDivElement; visible: boolean }[] =
      Array.from(dots).map((dot, index) => {
        return {
          target: dot,
          visible:
            dot.offsetLeft > visibleLeftBound &&
            dot.offsetLeft < visibleRightBound &&
            dot.offsetTop > visibleTopBound &&
            dot.offsetTop < visibleBottomBound,
          index,
        };
      });
    setParticles(particles);
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`star-button group w-full py-4 rounded 
      flex justify-center shadow-black shadow-md
      relative overflow-hidden transition-transform ${className}`}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        const animation = buttonRef.current?.animate(
          {
            transform: ["scale(1)", "scale(0.98)"],
          },
          {
            duration: 200,
            easing: "ease-out",
            fill: "forwards",
          }
        );
        Object.assign(buttonAnimation, { current: animation });
        const container = containerRef.current as HTMLDivElement;
        if (!container) {
          return;
        }
        const pointerPosition = {
          x: event.clientX,
          y: event.clientY,
        };
        const dots: NodeListOf<HTMLDivElement> =
          container.querySelectorAll(".dot");
        const _animations: Animation[] = [];
        dots.forEach((dot) => {
          const { left, top } = dot.getBoundingClientRect();
          const dotPosition = {
            x: left,
            y: top,
          };
          const distanceX = pointerPosition.x - dotPosition.x;
          const distanceY = pointerPosition.y - dotPosition.y;
          const animation = dot.animate(
            {
              transform: [
                `translateX(0px) translateY(0px)`,
                `translateX(${distanceX * 0.1}px) translateY(${
                  distanceY * 0.25
                }px)`,
              ],
            },
            {
              duration: 200,
              fill: "forwards",
            }
          );
          _animations.push(animation);
        });
        Object.assign(animations, { current: _animations });
        onPointerUp?.(event);
      }}
      onPointerUp={(event) => {
        event.currentTarget.releasePointerCapture(event.pointerId);
        buttonAnimation.current?.finished.then(() => {
          buttonAnimation.current?.cancel();
          for (const animation of animations.current) {
            animation.reverse();
          }
        });
        onPointerDown?.(event);
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
      <StarContainer
        ref={containerRef}
        particles={particles}
        root={buttonRef.current}
      />
      {children}
    </button>
  );
};

export default StarButton;
