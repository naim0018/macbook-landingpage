
import { useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setColor, setSize } from "@/store/features/AuthSlice/variableSlice";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Macbook14 from "./Macbook-14";
import Macbook16 from "./Macbook-16";
import { Environment, Center } from "@react-three/drei";
import * as THREE from "three";

// ─── Inner scene: has access to useFrame / useThree ──────────────────────────
interface SceneProps {
    size: string;
    scrollRef: React.MutableRefObject<number>;
    dragRotationRef: React.MutableRefObject<{ x: number; y: number }>;
    color: string;
}

const Scene = ({ size, scrollRef, dragRotationRef, color }: SceneProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();

    useFrame(() => {
        const t = scrollRef.current; // 0 → 1 as section scrolls through viewport

        // Zoom out: starts close (z = 15.5) and goes to (z = 20)
        const targetZ = THREE.MathUtils.lerp(15.5, 20.0, t);
        const targetY = 0.5; // static camera elevation
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);

        // Rotate: starts showing screen/keyboard (Math.PI * 1.15) and rotates to show Apple logo (0)
        if (groupRef.current) {
            const targetRotY = THREE.MathUtils.lerp(Math.PI * 1.15, 0, t);
            const targetRotX = THREE.MathUtils.lerp(0.28, 0, t); // tilt to make keyboard visible

            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                targetRotY + dragRotationRef.current.y,
                0.05
            );
            groupRef.current.rotation.x = THREE.MathUtils.lerp(
                groupRef.current.rotation.x,
                targetRotX + dragRotationRef.current.x,
                0.05
            );
        }
    });

    return (
        <group ref={groupRef} position={[0, 0.9, 0]}>
            <Center>
                {size === "16" ? (
                    <Macbook16 scale={0.14} color={color} />
                ) : (
                    <Macbook14 scale={0.12} color={color} />
                )}
            </Center>
        </group>
    );
};

// ─── Product component ────────────────────────────────────────────────────────
const Product = () => {
    const variables = useAppSelector((state: any) => state.variables);
    const dispatch = useAppDispatch();

    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollProgressRef = useRef(0);

    // Click & Drag Rotation Refs
    const dragRotationRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const lastPointerRef = useRef({ x: 0, y: 0 });

    const handlePointerDown = (e: React.PointerEvent) => {
        isDraggingRef.current = true;
        lastPointerRef.current = { x: e.clientX, y: e.clientY };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDraggingRef.current) return;
        const deltaX = e.clientX - lastPointerRef.current.x;
        const deltaY = e.clientY - lastPointerRef.current.y;

        // Sensitivity multipliers (reduced vertical sensitivity to 0.0015)
        dragRotationRef.current.y += deltaX * 0.007;
        dragRotationRef.current.x += deltaY * 0.0015;

        // Clamp vertical tilt to a tight range so it remains subtle
        dragRotationRef.current.x = Math.max(-0.25, Math.min(0.25, dragRotationRef.current.x));

        lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        isDraggingRef.current = false;
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    };

    useEffect(() => {
        let isSnapping = false;
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const windowH = window.innerHeight;
            
            // Calculate scroll animation progress (0 to 1) through the sticky track
            const totalScrollableDistance = rect.height - windowH;
            const progress = Math.max(
                0,
                Math.min(1, -rect.top / (totalScrollableDistance || 1))
            );
            scrollProgressRef.current = progress;

            // Snap to top if user is scrolling down and top of section enters viewport
            const currentScrollY = window.scrollY;
            const scrollingDown = currentScrollY > lastScrollY;
            lastScrollY = currentScrollY;

            // Trigger when the top of the section enters the bottom 45% of the viewport
            if (
                scrollingDown &&
                !isSnapping &&
                rect.top > 20 &&
                rect.top < windowH * 0.45
            ) {
                isSnapping = true;
                const targetScrollTop = currentScrollY + rect.top;

                window.scrollTo({
                    top: targetScrollTop,
                    behavior: "smooth"
                });
                
                setTimeout(() => {
                    isSnapping = false;
                }, 1000);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // set initial value
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div>
            {/* Very tall container to act as a scroll track */}
            <div ref={sectionRef} className="w-full h-[580vh] relative">
                {/* Sticky container that stays pinned while user scrolls through the track */}
                <div 
                    className="sticky top-[8.5vh] w-full h-[85vh] rounded-lg overflow-hidden bg-black shadow-2xl cursor-grab active:cursor-grabbing select-none"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    <h4 className="text-white text-2xl font-bold absolute top-6 left-6 z-10 pointer-events-none">
                        Take a closer look
                    </h4>

                    <Canvas
                        camera={{ position: [0, 0, 16.5], fov: 20, near: 0.1, far: 2000 }}
                        shadows
                        className="w-full h-full absolute top-0 left-0 right-0 bottom-0 z-0 pointer-events-none"
                    >
                        {/* Ambient base lighting */}
                        <ambientLight intensity={0.4} color="#ffffff" />

                        {/* Four-Corner Studio Lighting for perfect highlights and shadow definition */}
                        <directionalLight position={[-12, 8, 8]} intensity={1.2} color="#ffffff" />  {/* Top-Left */}
                        <directionalLight position={[12, 8, 8]} intensity={1.2} color="#ffffff" />   {/* Top-Right */}
                        <directionalLight position={[-12, -8, 8]} intensity={1.0} color="#ffffff" /> {/* Bottom-Left */}
                        <directionalLight position={[12, -8, 8]} intensity={1.0} color="#ffffff" />  {/* Bottom-Right */}

                        {/* Top-Center and Bottom-Center highlights to illuminate middle-top and middle-bottom edges */}
                        <directionalLight position={[0, 12, 6]} intensity={1.5} color="#ffffff" />   {/* Top-Center Front */}
                        <directionalLight position={[0, -10, 6]} intensity={1.5} color="#ffffff" />  {/* Bottom-Center Front */}

                        {/* Back-Rim light for outline separation */}
                        <directionalLight position={[0, 5, -15]} intensity={1.8} color="#ffffff" />

                        <Environment preset="city" environmentIntensity={0.6} />
                        <Scene size={variables?.size} scrollRef={scrollProgressRef} dragRotationRef={dragRotationRef} color={variables?.color} />
                    </Canvas>

                    {/* Controls overlay: Stop pointer event propagation to make buttons fully clickable */}
                    <div 
                        className="absolute z-10 bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerMove={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                    >
                        <p className="text-white text-center font-medium drop-shadow-md">
                            MacbookPro {variables?.size} inch -{" "}
                            {variables?.color === "#adb5bd" ? "Silver" : "Space Black"}
                        </p>
                        <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-neutral-900 w-fit shadow-lg">
                                <div
                                    onClick={() => dispatch(setColor("#adb5bd"))}
                                    className={`size-6 rounded-full bg-[#adb5bd] cursor-pointer ${variables?.color === "#adb5bd" ? "border-2 border-white" : ""}`}
                                />
                                <div
                                    onClick={() => dispatch(setColor("#2e2c2e"))}
                                    className={`size-6 rounded-full bg-[#2e2c2e] cursor-pointer ${variables?.color === "#2e2c2e" ? "border-2 border-white" : ""}`}
                                />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-neutral-900 w-fit shadow-lg">
                                <div
                                    onClick={() => dispatch(setSize("14"))}
                                    className={`size-6 flex items-center justify-center text-sm font-semibold rounded-full cursor-pointer transition-all ${variables?.size === "14" ? "bg-white text-black" : "text-white"}`}
                                >
                                    14
                                </div>
                                <div
                                    onClick={() => dispatch(setSize("16"))}
                                    className={`size-6 flex items-center justify-center text-sm font-semibold rounded-full cursor-pointer transition-all ${variables?.size === "16" ? "bg-white text-black" : "text-white"}`}
                                >
                                    16
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;