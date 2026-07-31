import React from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Mesh }
  materials: { [key: string]: THREE.Material }
}

interface MacbookProps extends React.ComponentPropsWithoutRef<'group'> {
  color?: string;
  texturePath?: string;
}

export default function Macbook16({ color, texturePath = '/screen.png', ...props }: MacbookProps) {
  const { nodes, materials } = useGLTF('/models/macbook-16-transformed.glb') as unknown as GLTFResult
  const texture = useTexture(texturePath)

  const originalColors = React.useRef<Record<string, THREE.Color>>({});

  React.useLayoutEffect(() => {
    if (materials) {
      // 1. Save original colors on first run
      Object.keys(materials).forEach((key) => {
        if (!originalColors.current[key]) {
          const mat = materials[key] as any;
          if (mat.color) {
            originalColors.current[key] = mat.color.clone();
          }
        }
      });

      // 2. Apply color override
      Object.keys(materials).forEach((key) => {
        const material = materials[key] as any;
        const origColor = originalColors.current[key];
        
        if (material.isMeshStandardMaterial && origColor) {
          // Check if original color was light grey/silver (R, G, B within 0.1 of each other and > 0.25)
          const isGrey = Math.abs(origColor.r - origColor.g) < 0.1 && 
                         Math.abs(origColor.g - origColor.b) < 0.1 && 
                         origColor.r > 0.25;

          const isMetallic = material.metalness > 0.1;
          const isScreen = key === 'sfCQkHOWyrsLmor';

          if ((isGrey || isMetallic) && !isScreen) {
            material.color.set(color || '#adb5bd');
            material.needsUpdate = true;
          }
        }
      });
    }
  }, [color, materials]);

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_10.geometry} material={materials.PaletteMaterial001} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_16.geometry} material={materials.zhGRTuGrQoJflBD} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_20.geometry} material={materials.PaletteMaterial002} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_22.geometry} material={materials.lmWQsEjxpsebDlK} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_30.geometry} material={materials.LtEafgAVRolQqRw} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_32.geometry} material={materials.iyDJFXmHelnMTbD} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_34.geometry} material={materials.eJObPwhgFzvfaoZ} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_38.geometry} material={materials.nDsMUuDKliqGFdU} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_42.geometry} material={materials.CRQixVLpahJzhJc} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_48.geometry} material={materials.YYwBgwvcyZVOOAA} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_54.geometry} material={materials.SLGkCohDDelqXBu} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_58.geometry} material={materials.WnHKXHhScfUbJQi} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_66.geometry} material={materials.fNHiBfcxHUJCahl} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_74.geometry} material={materials.LpqXZqhaGCeSzdu} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_82.geometry} material={materials.gMtYExgrEUqPfln} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_96.geometry} material={materials.PaletteMaterial003} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_107.geometry} material={materials.JvMFZolVCdpPqjj} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_123.geometry} material={materials.sfCQkHOWyrsLmor} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial map={texture} />
      </mesh>
      <mesh geometry={nodes.Object_127.geometry} material={materials.ZCDwChwkbBfITSW} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/models/macbook-16-transformed.glb')
