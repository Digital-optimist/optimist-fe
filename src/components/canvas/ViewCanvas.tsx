"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";

function LoadingFallback() {
  return null;
}

function WashingMachinePlaceholder() {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh position={[2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 1.5, 32]} />
        <meshStandardMaterial
          color="#e8e8e8"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Door detail */}
      <mesh position={[2, 0, 0.8]}>
        <circleGeometry args={[0.7, 32]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#4f46e5" />
      
      <WashingMachinePlaceholder />
      
      <Environment preset="city" />
    </>
  );
}

export function ViewCanvas() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: "transparent" }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default ViewCanvas;

