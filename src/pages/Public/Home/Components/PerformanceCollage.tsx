import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import * as THREE from "three";
import Macbook16 from "./Macbook-16";

const PerformanceCollage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const laptopGroupRef = useRef<THREE.Group>(null);
    
    // Refs for each window element to apply transform directly for 60fps performance
    const w1Ref = useRef<HTMLDivElement>(null);
    const w2Ref = useRef<HTMLDivElement>(null);
    const w3Ref = useRef<HTMLDivElement>(null);
    const w5Ref = useRef<HTMLDivElement>(null);
    const w6Ref = useRef<HTMLDivElement>(null);
    const w7Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let targetProgress = 0;
        let currentProgress = 0;
        let velocity = 0;
        let animationFrameId: number;

        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const windowH = window.innerHeight;

            // Calculate scroll progress (0 when section top is at screen top, 1 when section bottom is at screen bottom)
            const totalScrollable = rect.height - windowH;
            if (rect.top > 0) {
                targetProgress = 0;
                return;
            }

            const progress = Math.max(0, Math.min(1, -rect.top / (totalScrollable || 1)));
            targetProgress = progress;
        };

        const updateTransforms = (progress: number) => {
            // Apply ease-out curve to the scroll progress
            const easeProgress = Math.pow(progress, 1.3);

            // Travel distances (larger distance, maximum of ~160px scatter for side images)
            const maxTravel = 160; 
            const d = easeProgress * maxTravel;

            // Apply transforms based on directional travel vectors away from center
            // w1 (Photoshop/C4D - Top Left): Moves Up & Left
            if (w1Ref.current) {
                w1Ref.current.style.transform = `translate(${-d * 0.8}px, ${-d * 0.6}px)`;
            }
            // w2 (Photoshop Trajectory - Top Right): Moves Up & Right
            if (w2Ref.current) {
                w2Ref.current.style.transform = `translate(${d * 0.9}px, ${-d * 0.5}px)`;
            }
            // w3 (Blender - Mid Left): Moves Left
            if (w3Ref.current) {
                w3Ref.current.style.transform = `translate(${-d * 1.0}px, ${-d * 0.1}px)`;
            }
            // w5 (Lightroom Portrait - Bottom Left): Moves Down & Left
            if (w5Ref.current) {
                w5Ref.current.style.transform = `translate(${-d * 0.7}px, ${d * 0.7}px)`;
            }
            // w6 (Audio/Video Deck - Bottom Center): Moves Down
            if (w6Ref.current) {
                w6Ref.current.style.transform = `translate(${d * 0.1}px, ${d * 0.9}px)`;
            }
            // w7 (Node editor - Bottom Right): Moves Down & Right
            if (w7Ref.current) {
                w7Ref.current.style.transform = `translate(${d * 0.8}px, ${d * 0.6}px)`;
            }
        };

        const tick = () => {
            const dt = 0.016; // 60fps delta
            const stiffness = 85; 
            const damping = 13;

            const displacement = currentProgress - targetProgress;
            const springForce = -stiffness * displacement;
            const dampingForce = -damping * velocity;
            const acceleration = springForce + dampingForce;

            velocity += acceleration * dt;
            currentProgress += velocity * dt;

            // Apply updates
            updateTransforms(currentProgress);
            
            animationFrameId = requestAnimationFrame(tick);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial call
        tick(); // Start loop

        return () => {
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-screen h-[450vh] bg-black">
            {/* Sticky Container */}
            <div className="sticky top-0 left-0 w-screen h-screen overflow-hidden bg-black flex flex-col justify-between py-12 select-none">
                {/* Collage Area */}
                <div className="relative flex-1 w-full mx-auto flex items-center justify-center">
                    {/* 3D Macbook Model in the Center - Static with matching aspect and size */}
                    <div className="absolute w-[68vw] h-[55vh] z-10 flex items-center justify-center pointer-events-none">
                        <Canvas
                            camera={{ position: [0, 0, 16.5], fov: 20, near: 0.1, far: 2000 }}
                            style={{ width: "100%", height: "100%" }}
                        >
                            <ambientLight intensity={1.5} />
                            <directionalLight position={[10, 10, 5]} intensity={1.5} />
                            <directionalLight position={[-10, 10, -5]} intensity={0.5} />
                            <pointLight position={[0, -5, 5]} intensity={1} />
                            
                            <group 
                                ref={laptopGroupRef} 
                                position={[0, 0.7, 0]} 
                                rotation={[0.1, 0, 0]}
                            >
                                <Center>
                                    <Macbook16 scale={0.18} texturePath="/performance5.jpg" />
                                </Center>
                            </group>
                        </Canvas>
                    </div>

                    {/* w1: Top Left Window (C4D Green Project) */}
                    <div 
                        ref={w1Ref}
                        className="absolute top-[6%] left-[20%] w-[28%] aspect-video z-20 rounded-lg overflow-hidden border border-neutral-800 shadow-2xl"
                    >
                        <img src="/performance1.png" className="w-full h-full object-cover scale-110" alt="Cinema 4D window" />
                    </div>

                    {/* w2: Top Right Window (Photoshop Dancer) */}
                    <div 
                        ref={w2Ref}
                        className="absolute top-[6%] right-[20%] w-[30%] aspect-video z-20 rounded-lg overflow-hidden border border-neutral-800 shadow-2xl"
                    >
                        <img src="/performance2.png" className="w-full h-full object-cover scale-110" alt="Photoshop window" />
                    </div>

                    {/* w3: Mid Left Window (Blender viewport) */}
                    <div 
                        ref={w3Ref}
                        className="absolute left-[14%] top-[35%] w-[25%] aspect-video z-20 rounded-lg overflow-hidden border border-neutral-800 shadow-2xl"
                    >
                        <img src="/performance3.png" className="w-full h-full object-cover scale-110" alt="Blender window" />
                    </div>

                    {/* w5: Bottom Left Window (Lightroom / Portrait) */}
                    <div 
                        ref={w5Ref}
                        className="absolute bottom-[22%] left-[18%] w-[25%] aspect-video z-20 rounded-lg overflow-hidden border border-neutral-800 shadow-2xl"
                    >
                        <img src="/performance4.png" className="w-full h-full object-cover scale-110" alt="Lightroom window" />
                    </div>

                    {/* w6: Bottom Center Window (Audio/Video Deck) */}
                    <div 
                        ref={w6Ref}
                        className="absolute bottom-[14%] left-[35%] w-[27%] aspect-video z-20 rounded-lg overflow-hidden border border-neutral-800 shadow-2xl"
                    >
                        <img src="/performance6.png" className="w-full h-full object-cover scale-110" alt="Premiere deck" />
                    </div>

                    {/* w7: Bottom Right Window (Node editor / C4D Nodes) */}
                    <div 
                        ref={w7Ref}
                        className="absolute bottom-[20%] right-[16%] w-[28%] aspect-video z-20 rounded-lg overflow-hidden border border-neutral-800 shadow-2xl"
                    >
                        <img src="/performance7.png" className="w-full h-full object-cover scale-110" alt="Octane Nodes window" />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default PerformanceCollage;
