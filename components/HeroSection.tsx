'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Timeline principale pour une animation séquencée
      const mainTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animation épique du fond avec zoom et légère rotation
      if (bgRef.current) {
        mainTl.fromTo(bgRef.current,
          { 
            scale: 1.3, 
            opacity: 0,
            filter: 'blur(20px)'
          },
          {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 2.5,
            ease: "power2.out",
          },
          0
        );

        // Animation continue subtile de respiration sur l'image
        gsap.to(bgRef.current, {
          scale: 1.05,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2.5
        });
      }

      // Animation de l'overlay gradient
      if (overlayRef.current) {
        mainTl.fromTo(overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.5 },
          0.5
        );
      }

      // Animation du glow effect
      if (glowRef.current) {
        mainTl.fromTo(glowRef.current,
          { scale: 0, opacity: 0 },
          { 
            scale: 1, 
            opacity: 0.5, 
            duration: 2,
            ease: "elastic.out(1, 0.5)"
          },
          0.3
        );

        // Animation de pulsation continue
        gsap.to(glowRef.current, {
          scale: 1.2,
          opacity: 0.3,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2
        });
      }

      // Animation du texte avec effet de révélation avancé
      if (textRef.current?.children) {
        const children = Array.from(textRef.current.children);
        
        // Titre principal avec effet de split text et glow
        mainTl.fromTo(children[0],
          { 
            y: 100, 
            opacity: 0,
            rotationX: -45,
            transformPerspective: 1000,
            filter: 'blur(10px)'
          },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            filter: 'blur(0px)',
            duration: 1.4,
            ease: "power4.out"
          },
          0.8
        );

        // Sous-titre avec effet de slide et fade
        mainTl.fromTo(children[1],
          { 
            y: 60, 
            opacity: 0,
            scale: 0.9,
            filter: 'blur(5px)'
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: "back.out(1.7)"
          },
          1.2
        );

        // Description avec effet de ligne par ligne
        mainTl.fromTo(children[2],
          { 
            y: 50, 
            opacity: 0,
            clipPath: 'inset(0 100% 0 0)'
          },
          {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.3,
            ease: "power2.out"
          },
          1.5
        );

        // Bouton avec effet de bounce élastique
        mainTl.fromTo(children[3],
          { 
            y: 60, 
            opacity: 0,
            scale: 0.5,
            rotation: -10
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: "elastic.out(1, 0.4)"
          },
          1.8
        );

        // Effet de flottement et pulse continu sur le bouton
        gsap.to(children[3], {
          y: -8,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 3
        });

        // Effet de glow pulsant sur le bouton
        gsap.to(children[3].querySelector('.btn-glow'), {
          opacity: 0.7,
          scale: 1.1,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 3
        });
      }

      // Animation des particules avec mouvement organique
      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll('.particle');
        particles.forEach((particle, i) => {
          // Animation d'entrée
          gsap.fromTo(particle,
            { scale: 0, opacity: 0 },
            { 
              scale: 1, 
              opacity: 0.6, 
              duration: 0.5, 
              delay: 2 + i * 0.05,
              ease: "back.out(2)"
            }
          );

          // Mouvement aléatoire continu
          gsap.to(particle, {
            y: -30 - Math.random() * 30,
            x: (Math.random() - 0.5) * 20,
            opacity: 0.3 + Math.random() * 0.4,
            duration: 3 + Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.1,
          });

          // Rotation subtile
          gsap.to(particle, {
            rotation: 360,
            duration: 10 + Math.random() * 10,
            repeat: -1,
            ease: "none"
          });
        });
      }

      // Animation des coins décoratifs
      if (cornersRef.current) {
        const corners = cornersRef.current.querySelectorAll('.corner');
        corners.forEach((corner, i) => {
          mainTl.fromTo(corner,
            { 
              scale: 0, 
              opacity: 0,
              rotation: i % 2 === 0 ? -90 : 90
            },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.8,
              ease: "back.out(2)"
            },
            2 + i * 0.1
          );
        });
      }

      // Animation de l'indicateur de scroll
      if (scrollIndicatorRef.current) {
        mainTl.fromTo(scrollIndicatorRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          2.5
        );
      }

      // Effet de parallaxe avancé sur scroll
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const progress = self.progress;
          
          if (bgRef.current) {
            gsap.to(bgRef.current, {
              y: progress * 150,
              scale: 1 + progress * 0.1,
              filter: `blur(${progress * 5}px)`,
              ease: "none",
              duration: 0.1
            });
          }

          if (textRef.current) {
            gsap.to(textRef.current, {
              y: progress * -50,
              opacity: 1 - progress * 1.5,
              ease: "none",
              duration: 0.1
            });
          }

          if (overlayRef.current) {
            gsap.to(overlayRef.current, {
              opacity: 1 + progress * 0.5,
              ease: "none",
              duration: 0.1
            });
          }
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Background avec parallaxe et effet cinématique */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      />
      
      {/* Animated Glow Effect behind content */}
      <div 
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-[#96A78D]/30 via-[#96A78D]/10 to-transparent blur-3xl pointer-events-none"
      />
      
      {/* Gradient overlay plus sophistiqué */}
      <div ref={overlayRef} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9F8F6]/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>
      
      {/* Effet de lumière animé */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-white/5 to-transparent animate-[spin_20s_linear_infinite]" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-[#96A78D]/10 to-transparent animate-[spin_25s_linear_infinite_reverse]" />
      </div>
      
      {/* Particules flottantes améliorées */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: i % 3 === 0 
                ? 'rgba(150, 167, 141, 0.6)' 
                : i % 3 === 1 
                  ? 'rgba(255, 255, 255, 0.4)' 
                  : 'rgba(217, 207, 199, 0.5)',
              boxShadow: '0 0 10px currentColor',
            }}
          />
        ))}
      </div>

      {/* Lignes décoratives animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      {/* Vignette pour concentrer l'attention */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />

      {/* Hero Content avec améliorations */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div
          ref={textRef}
          className="text-center max-w-6xl mx-auto"
        >
          {/* Titre principal avec glow effect amélioré */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight will-change-transform">
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-b from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                Parapharmacie
              </span>
              <span 
                className="absolute inset-0 blur-[60px] opacity-40"
                style={{
                  background: 'linear-gradient(90deg, #96A78D, #7d9175, #5a6b54)',
                }}
              />
              {/* Effet de reflet */}
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#96A78D] to-transparent opacity-50" />
            </span>
          </h1>
          
          {/* Sous-titre avec effet de séparation amélioré */}
          <div className="relative mb-8 will-change-transform">
            <p className="text-2xl md:text-3xl lg:text-4xl text-white/90 font-light tracking-wide">
              <span className="inline-block">Bien-être</span>
              <span className="inline-block mx-3 text-[#96A78D]">✦</span>
              <span className="inline-block">Soins</span>
            </p>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#96A78D]" />
              <div className="w-2 h-2 rounded-full bg-[#96A78D] animate-pulse" />
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#96A78D]" />
            </div>
          </div>

          {/* Description dans un cadre élégant amélioré */}
          <div className="relative mb-12 will-change-transform">
            <div className="absolute inset-0 bg-gradient-to-r from-[#96A78D]/20 via-[#96A78D]/10 to-[#96A78D]/20 rounded-2xl blur-2xl" />
            <p className="relative text-lg md:text-xl text-white/80 max-w-2xl mx-auto px-8 py-5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
              <span className="absolute -top-3 left-8 text-4xl text-[#96A78D]/50">"</span>
              Découvrez notre sélection de produits de qualité pour prendre soin de vous au quotidien
              <span className="absolute -bottom-3 right-8 text-4xl text-[#96A78D]/50">"</span>
            </p>
          </div>

          {/* Bouton amélioré avec effets avancés */}
          <div className="relative group will-change-transform">
            {/* Effet de halo animé autour du bouton */}
            <div className="btn-glow absolute -inset-2 bg-gradient-to-r from-[#96A78D] via-[#7d9175] to-[#96A78D] rounded-full blur-xl opacity-40 group-hover:opacity-60 transition duration-500" />
            
            {/* Cercles concentriques décoratifs */}
            <div className="absolute -inset-8 border border-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-12 border border-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <a
              href="#categories"
              className="relative inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-br from-[#96A78D] via-[#7d9175] to-[#5a6b54] text-white font-semibold text-lg rounded-full hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group-hover:shadow-[0_0_60px_rgba(150,167,141,0.5)] overflow-hidden"
            >
              {/* Effet de brillance au survol */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <span className="relative">Explorer nos produits</span>
              <svg 
                className="relative w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            {/* Lignes décoratives */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-px h-10 bg-gradient-to-b from-transparent via-[#96A78D]/50 to-[#96A78D]" />
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-px h-10 bg-gradient-to-t from-transparent via-[#96A78D]/50 to-[#96A78D]" />
          </div>
        </div>

        {/* Indicateur de scroll amélioré */}
        <div ref={scrollIndicatorRef} className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-3">
            <span className="text-white/60 text-sm font-light tracking-[0.3em] uppercase">Défiler</span>
            <div className="relative">
              {/* Cercle externe animé */}
              <div className="absolute -inset-3 border border-white/20 rounded-full animate-ping opacity-30" />
              <div className="w-7 h-12 border-2 border-white/40 rounded-full flex justify-center relative overflow-hidden">
                {/* Track lumineux */}
                <div className="absolute inset-x-2 top-2 bottom-2 bg-gradient-to-b from-white/10 to-transparent rounded-full" />
                {/* Souris/doigt qui scroll */}
                <div className="w-1.5 h-4 bg-gradient-to-b from-[#96A78D] to-[#7d9175] rounded-full mt-2 animate-bounce shadow-[0_0_10px_rgba(150,167,141,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ornements décoratifs dans les coins avec animation */}
      <div ref={cornersRef} className="pointer-events-none">
        <div className="corner absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-white/20 rounded-tl-3xl" />
        <div className="corner absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-white/20 rounded-tr-3xl" />
        <div className="corner absolute bottom-8 left-8 w-20 h-20 border-b-2 border-l-2 border-white/20 rounded-bl-3xl" />
        <div className="corner absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-white/20 rounded-br-3xl" />
        
        {/* Points décoratifs aux coins */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-[#96A78D] rounded-full animate-pulse" />
        <div className="absolute top-10 right-10 w-2 h-2 bg-[#96A78D] rounded-full animate-pulse delay-100" />
        <div className="absolute bottom-10 left-10 w-2 h-2 bg-[#96A78D] rounded-full animate-pulse delay-200" />
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-[#96A78D] rounded-full animate-pulse delay-300" />
      </div>
    </section>
  );
}