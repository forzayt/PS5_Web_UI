import React, { useEffect, useRef, useState } from 'react';
import { playBootSound } from '../utils/AudioSystem';
import { useFocus } from '../context/FocusContext';
import psLogo from '../assets/logos/main_black.png';

export default function BootScreen() {
  const { setActiveScreen, setFocusId } = useFocus();
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const particles = [];
    const particleCount = 150;
    const colors = ['#ffffff', '#0043ff', '#00d2ff', '#ffffff', '#8c9ba5'];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02;
      }

      update() {
        this.x += this.speedX + Math.sin(this.wobble) * 0.2;
        this.y += this.speedY + Math.cos(this.wobble) * 0.2;
        this.wobble += this.wobbleSpeed;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        
        // Add glow to some particles
        if (this.size > 1.5) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.color;
        } else {
          ctx.shadowBlur = 0;
        }
      }
    }

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background glow
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.6
      );
      gradient.addColorStop(0, 'rgba(12, 18, 43, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const timer = setTimeout(() => setIsReady(true), 2000);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, []);

  const [isPressed, setIsPressed] = useState(false);

  const handleStart = () => {
    setIsPressed(true);
    playBootSound();
    
    // Reset animation after a short delay
    setTimeout(() => {
      setIsPressed(false);
      // For now, we just play the sound and stay on this screen
      // as other components have been removed.
      console.log("Console Starting...");
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        handleStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="boot-container-new">
      <canvas ref={canvasRef} className="boot-canvas" />
      
      <div className={`boot-content-wrapper ${isReady ? 'visible' : ''}`}>
        <div className="boot-top-text">
          Press the PS button on your controller.
        </div>

        <div 
          className={`ps-button-wrapper ${isPressed ? 'pressed' : ''}`} 
          onClick={handleStart}
        >
          <div className="ps-button-outer-ring">
            <div className="ps-button-inner-ring">
              <div className="ps-button-core">
                <img src={psLogo} alt="PlayStation Logo" className="ps-icon-img" />
              </div>
            </div>
          </div>
          <div className="ps-button-glow"></div>
        </div>
      </div>
    </div>
  );
}
