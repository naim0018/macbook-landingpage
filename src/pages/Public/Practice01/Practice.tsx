import {  GizmoHelper, GizmoViewcube, GizmoViewport, OrbitControls } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import { useControls } from 'leva';
export const AnimatedBox = () => {
    const boxRef = useRef<THREE.Mesh>(null)
    const { color, speed } = useControls({
            color:'#00bfff' ,
        speed: {
                value: 0.0,
                min: 0.0,
                max: 0.2,
            step:0.0001,
            
        }
    })
    useFrame(() => { 
        if (boxRef.current) { 
            boxRef.current.rotation.x += speed;
            // // boxRef.current.rotation.y += 0.005;
            // boxRef.current.rotation.z += 0.005;
        }


    })

    return (
        <mesh ref={ boxRef} position={[3,3,3]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshPhongMaterial color={color} />
        </mesh>
    )
}

export const AnimatedBox3 = () => {
    const boxRef = useRef<THREE.Mesh>(null)
    useFrame(() => { 
        if (boxRef.current) { 
            // boxRef.current.rotation.x += 0.005;
            // // boxRef.current.rotation.y += 0.005;
            // boxRef.current.rotation.z += 0.005;
        }


    })
    return (
        <mesh ref={ boxRef} position={[3,3,3]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshPhongMaterial color='blue' />
        </mesh>
    )
}
export const AnimatedBox4 = () => {
    const boxRef = useRef<THREE.Mesh>(null)
    useFrame(() => { 
        if (boxRef.current) { 
            // boxRef.current.rotation.x += 0.005;
            // // boxRef.current.rotation.y += 0.005;
            // boxRef.current.rotation.z += 0.005;
        }


    })
    return (
        <mesh ref={ boxRef} position={[3,1,3]}>
            <cylinderGeometry args={[0.2, 0.2, 2]} />
            <meshPhongMaterial color='orange' />
        </mesh>
    )
}
export const AnimatedBox2 = () => {
    const boxRef = useRef<THREE.Mesh>(null)
    useFrame(() => {
        if (boxRef.current) {
            // boxRef.current.rotation.x += 0.005;
            // boxRef.current.rotation.y += 0.005;
            // boxRef.current.rotation.z += 0.005;

        }
    })
    return (
        <mesh ref={boxRef} position={[3,4.5,3]}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshPhongMaterial color='lightgreen' />
        </mesh>
    )
}

const Practice = () => {
  return (
      <div className="h-screen w-full bg-white">
          <Canvas camera={{ position: [0, 0, 10] }}>
              <mesh>
                  <GizmoHelper alignment="bottom-right" >
                      <GizmoViewcube />
                      <GizmoViewport />
                      
                  </GizmoHelper>
                  <axesHelper args={[10]} />
                  <gridHelper args={ [50,50]} />
                  {/* <FirstPersonControls movementSpeed={3} /> */}
                  <OrbitControls/>
                  {/* <sphereGeometry args={[2, 4, 4]} /> */}
                  {/* <boxGeometry args={[1,1,1]} /> */}
                  {/* <meshBasicMaterial color='blue' /> */}
                  <AnimatedBox/>
                  <AnimatedBox2/><cylinderGeometry args={[0.2, 0.2, 2]} />
                  <AnimatedBox3/>
                  <AnimatedBox4 />
              </mesh>
                  {/* <directionalLight position={[1, 1, 1] } /> */}
                  {/* <directionalLight position={[4, -0, 0] } /> */}
                  <ambientLight />

          </Canvas>

    </div>
  )
}

export default Practice