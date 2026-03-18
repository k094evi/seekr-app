import React, { useEffect, useRef } from "react";


export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(114, 9, 183)",
  firstColor = "220, 214, 247", // light violet
  secondColor = "114, 9, 183", // violet
  thirdColor = "58, 12, 163", // dark blue
  fourthColor = "67, 97, 238", // blue
  fifthColor = "60, 145, 130", // light blue
  pointerColor = "140, 100, 255",
  blendingValue = "hard-light",
  blurAmount = 60, //  blur control
  interactive = true,
  children,
}) => {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;
    let animationFrameId;


    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();


    window.addEventListener("resize", resize);


    const circles = [
      { x: width / 3, y: height / 3, r: 300, color: firstColor },
      { x: width / 1.5, y: height / 2, r: 300, color: secondColor },
      { x: width / 2, y: height / 1.5, r: 300, color: thirdColor },
      { x: width / 1.2, y: height / 4, r: 300, color: fourthColor },
      { x: width / 4, y: height / 1.3, r: 300, color: fifthColor },
    ];


    const draw = () => {
      ctx.clearRect(0, 0, width, height);


      // background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, gradientBackgroundStart);
      gradient.addColorStop(1, gradientBackgroundEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);


      ctx.globalCompositeOperation = blendingValue;


      // add blur effect
      ctx.filter = `blur(${blurAmount}px)`; // 👈 apply blur


      circles.forEach((circle, i) => {
        const t = Date.now() * 0.001 + i;
        const dx = Math.sin(t * 0.6 + i) * 100;
        const dy = Math.cos(t * 0.4 + i) * 100;
        ctx.beginPath();
        ctx.arc(circle.x + dx, circle.y + dy, circle.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${circle.color}, 0.8)`; // slightly stronger opacity
        ctx.fill();
      });


      // pointer circle
      if (interactive) {
        ctx.beginPath();
        ctx.arc(pointer.current.x, pointer.current.y, 250, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pointerColor}, 0.4)`;
        ctx.fill();
      }


      ctx.filter = "none"; // reset blur so next frame’s background isn’t blurred


      animationFrameId = requestAnimationFrame(draw);
    };


    draw();


    if (interactive) {
      window.addEventListener("mousemove", (e) => {
        pointer.current.x = e.clientX;
        pointer.current.y = e.clientY;
      });
    }


    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [
    blendingValue,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    gradientBackgroundStart,
    gradientBackgroundEnd,
    blurAmount,
    interactive,
  ]);


return (
  <div className="relative w-screen h-screen overflow-hidden">
    {/* Canvas background */}
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover"
    />


    {/* Overlay with centering */}
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
      {children}
    </div>
  </div>
);
};

