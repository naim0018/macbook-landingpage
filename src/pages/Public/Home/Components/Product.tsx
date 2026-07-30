
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setColor, setSize } from "@/store/features/AuthSlice/variableSlice";
import { Canvas } from "@react-three/fiber";
import Macbook14 from "./Macbook-14";
import Macbook16 from "./Macbook-16";
import { Environment, OrbitControls } from "@react-three/drei";


const Product = () => {
    const variables = useAppSelector((state: any) => state.variables)
    const dispatch = useAppDispatch()
  return (
      <div>
          <h4 className="text-white text-xl font-bold mb-4">Take a closer look</h4>
          <div className="w-full h-[80vh]">
              <Canvas
                  camera={{ position: [0, 1.5, 12], fov: 30, near: 0.1, far: 1000 }}
                  shadows 
                  className="w-full h-full"
              >    
                  <ambientLight intensity={1.5} />
                  <directionalLight position={[10, 10, 10]} intensity={2} />
                  <Environment preset="city" />

                  {variables?.size === '16' ? (
                      <Macbook16 scale={0.07} position={[0, -1.1, 0]} />
                  ) : (
                      <Macbook14 scale={0.05} position={[0, -1.1, 0]} />
                  )}

                  <OrbitControls enableZoom={false} enableRotate={true} />
              </Canvas>
          </div>
          <div className="">
          <p className="text-white">MacbookPro {variables?.size} inch - {variables?.color === "#adb5bd" ?"Silver" : "Black" }</p>
          <div className="flex gap-4 items-center">
              
          </div>
          <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-neutral-900 w-fit">
              <div onClick={()=>dispatch(setColor('#adb5bd'))} className={`size-6 rounded-full bg-[#adb5bd] cursor-pointer ${variables?.color==='#adb5bd'?'border-2':''}`}></div>
              <div onClick={()=>dispatch(setColor('#2e2c2e'))} className={`size-6 rounded-full bg-[#2e2c2e] cursor-pointer ${variables?.color==='#2e2c2e'?'border-2':''}`}></div>
          </div>
          <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-neutral-900 w-fit">
              <div onClick={()=>dispatch(setSize('14'))} className={`size-6 flex items-center justify-center text-sm rounded-full  cursor-pointer ${variables?.size==='14'?'border-2 bg-white':''}`}>14</div>
              <div onClick={()=>dispatch(setSize('16'))} className={`size-6 flex items-center justify-center text-sm rounded-full cursor-pointer ${variables?.size==='16'?'border-2 bg-white':''}`}>16</div>
          </div>
        </div>
    </div>
  )
}

export default Product