import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, ContactShadows, Environment, Grid } from "@react-three/drei";
import * as THREE from "three";
import { Model } from "./Model";

interface PointInfo {
  id: number;
  number: string;
  title: string;
  description: string;
  zoomCamPos: [number, number, number]; // Camera location facing component
  lookAtTarget: [number, number, number]; // Target focus directly on component surface
  modelRotation: [number, number, number]; // Model rotation to present component face-to-face
}

// 4 Component Viewpoints matching physical mesh surface coordinates
const POINTS_DATA: PointInfo[] = [
  {
    id: 1,
    number: "1",
    title: "Front Axis Servo Motor",
    description: "High-torque brushless servo drive powering high-speed linear acceleration and position feedback.",
    zoomCamPos: [1.3, 0.5, 1.8],
    lookAtTarget: [0.15, -0.22, 0.4],
    modelRotation: [0.2, Math.PI * 0.35, 0],
  },
  {
    id: 2,
    number: "2",
    title: "Crossbeam Gantry Rail",
    description: "Precision-ground dual linear rails providing high structural rigidity and sub-micron alignment.",
    zoomCamPos: [0.0, 1.0, 1.8],
    lookAtTarget: [0.0, 0.12, 0.05],
    modelRotation: [0.25, 0, 0],
  },
  {
    id: 3,
    number: "3",
    title: "Side Linear Motion Guide",
    description: "Heavy-duty recirculating ball linear guide ensuring smooth longitudinal carriage travel.",
    zoomCamPos: [-1.2, 0.4, 1.8],
    lookAtTarget: [-0.25, -0.05, 0.1],
    modelRotation: [0.2, -Math.PI * 0.3, 0],
  },
  {
    id: 4,
    number: "4",
    title: "Z-Axis Spindle Unit",
    description: "Integrated high-speed spindle assembly with liquid cooling for precision micro-machining.",
    zoomCamPos: [0.8, 1.0, 1.6],
    lookAtTarget: [0.15, 0.28, 0.1],
    modelRotation: [0.1, Math.PI * 0.15, 0],
  },
];

interface SceneControllerProps {
  scrollProgress: number; // 0.0 to 1.0
  activePointIndex: number;
  onStateUpdate: (activeIdx: number, isModalVisible: boolean) => void;
  onSelectPoint: (index: number) => void;
}

const SceneController: React.FC<SceneControllerProps> = ({
  scrollProgress,
  activePointIndex,
  onStateUpdate,
  onSelectPoint,
}) => {
  const modelGroupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);
  const smoothProgress = useRef(0);
  const currentScale = useRef(0.01);
  const isIntroComplete = useRef(false);

  useFrame((state, delta) => {
    // Continuous damp scroll progress for smooth responsive motion
    smoothProgress.current = THREE.MathUtils.damp(
      smoothProgress.current,
      scrollProgress,
      8.0,
      delta
    );

    const progress = smoothProgress.current;
    const totalPoints = POINTS_DATA.length;
    const rawStage = Math.min(Math.max(progress * (totalPoints - 1), 0), totalPoints - 1);

    const activeIdx = Math.round(rawStage);
    const idx1 = Math.floor(rawStage);
    const idx2 = Math.min(idx1 + 1, totalPoints - 1);
    const factor = rawStage - idx1; // 0.0 to 1.0 continuous factor between points

    // Update active point & modal visibility
    onStateUpdate(activeIdx, true);

    const p1 = POINTS_DATA[idx1];
    const p2 = POINTS_DATA[idx2];

    // Direct continuous lerp between point 1, 2, 3, 4
    const targetCamX = THREE.MathUtils.lerp(p1.zoomCamPos[0], p2.zoomCamPos[0], factor);
    const targetCamY = THREE.MathUtils.lerp(p1.zoomCamPos[1], p2.zoomCamPos[1], factor);
    const targetCamZ = THREE.MathUtils.lerp(p1.zoomCamPos[2], p2.zoomCamPos[2], factor);

    const targetLookX = THREE.MathUtils.lerp(p1.lookAtTarget[0], p2.lookAtTarget[0], factor);
    const targetLookY = THREE.MathUtils.lerp(p1.lookAtTarget[1], p2.lookAtTarget[1], factor);
    const targetLookZ = THREE.MathUtils.lerp(p1.lookAtTarget[2], p2.lookAtTarget[2], factor);

    const targetRotX = THREE.MathUtils.lerp(p1.modelRotation[0], p2.modelRotation[0], factor);
    const targetRotY = THREE.MathUtils.lerp(p1.modelRotation[1], p2.modelRotation[1], factor);

    // Apply Camera & Model rotation updates with fast 60fps responsiveness
    state.camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), delta * 6.0);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(new THREE.Vector3(targetLookX, targetLookY, targetLookZ), delta * 6.0);
      controlsRef.current.update();
    }

    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        modelGroupRef.current.rotation.x,
        targetRotX,
        delta * 6.0
      );
      modelGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        modelGroupRef.current.rotation.y,
        targetRotY,
        delta * 6.0
      );

      // Intro Scale Reveal on Load (0.01 -> 2.6)
      if (!isIntroComplete.current) {
        currentScale.current = THREE.MathUtils.lerp(currentScale.current, 2.6, delta * 2.5);
        modelGroupRef.current.scale.setScalar(currentScale.current);

        if (Math.abs(currentScale.current - 2.6) < 0.01) {
          currentScale.current = 2.6;
          modelGroupRef.current.scale.setScalar(2.6);
          isIntroComplete.current = true;
        }
      }
    }
  });

  return (
    <>
      <group ref={modelGroupRef} scale={0.01}>
        <Center>
          <Model showNumbers={true} activePointIndex={activePointIndex} onSelectPoint={onSelectPoint} />
        </Center>
      </group>

      <OrbitControls ref={controlsRef} enablePan={true} enableZoom={false} />
    </>
  );
};

const Practice02: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activePointIdx, setActivePointIdx] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const totalScroll = containerRef.current.scrollHeight - window.innerHeight;
        if (totalScroll > 0) {
          const currentScroll = window.scrollY;
          const progress = Math.min(Math.max(currentScroll / totalScroll, 0), 1.0);
          setScrollProgress(progress);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectPoint = (idx: number) => {
    if (containerRef.current) {
      const totalScroll = containerRef.current.scrollHeight - window.innerHeight;
      const targetProgress = idx / (POINTS_DATA.length - 1);

      window.scrollTo({
        top: targetProgress * totalScroll,
        behavior: "smooth",
      });
    }
  };

  const activePoint = POINTS_DATA[activePointIdx];

  return (
    <div ref={containerRef} className="w-full h-[400vh] bg-slate-950 relative font-sans overflow-x-hidden">
      {/* 3D Canvas Viewport - PERMANENTLY FIXED TO SCREEN */}
      <div className="fixed inset-0 w-full h-screen overflow-hidden z-0">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.12),_transparent_65%)] pointer-events-none" />

        {/* Dynamic Popup Modal (Title & Description ONLY) */}
        <div
          className={`absolute bottom-8 right-8 z-40 max-w-sm w-full bg-slate-950/85 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl transition-all duration-500 pointer-events-auto ${
            isModalVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-95 pointer-events-none"
          }`}
        >
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
            {activePoint?.title}
          </h3>

          <p className="text-slate-300 text-sm leading-relaxed font-light">
            {activePoint?.description}
          </p>
        </div>

        {/* 3D Canvas */}
        <Canvas
          shadows
          camera={{ position: POINTS_DATA[0].zoomCamPos, fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <SceneController
            scrollProgress={scrollProgress}
            activePointIndex={activePointIdx}
            onStateUpdate={(activeIdx, modalVisible) => {
              setActivePointIdx(activeIdx);
              setIsModalVisible(modalVisible);
            }}
            onSelectPoint={handleSelectPoint}
          />

          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-10, 8, -8]} intensity={1.5} color="#00f0ff" />
          <pointLight position={[5, -2, 5]} intensity={0.8} color="#ffaa00" />

          <Environment preset="city" environmentIntensity={0.6} />

          <Suspense fallback={null}>
            {/* Tech Grid Floor */}
            <Grid
              position={[0, -1.3, 0]}
              args={[20, 20]}
              cellSize={0.5}
              cellThickness={0.8}
              cellColor="#1e293b"
              sectionSize={2}
              sectionThickness={1.2}
              sectionColor="#06b6d4"
              fadeDistance={14}
              fadeStrength={1.5}
            />

            <ContactShadows
              position={[0, -1.29, 0]}
              opacity={0.75}
              scale={12}
              blur={2.5}
              far={5}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Practice02;
