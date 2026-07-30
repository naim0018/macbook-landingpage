import { useEffect, useRef } from "react"


const Banner = () => {
  const videoRef = useRef<HTMLVideoElement |  null>(null)
  useEffect(() => {
    if (videoRef.current) { 
      videoRef.current.playbackRate = 2;
    }
  },[videoRef])
  return (
      <div className="flex flex-col min-h-screen place-items-center justify-center">
        <h3>MacBook Pro</h3>
      <img src="/title.png" alt="" className="w-2/3"/>
      <video src="/videos/hero.mp4" ref={videoRef} autoPlay muted playsInline />
      <div className="flex flex-col items-center gap-4">
        <button className="bg-blue-500 px-8 py-2.5 rounded-full text-white cursor-pointer">Buy</button>
        <p>From $1599 or $133/mo for 12 months</p>
      </div>
      </div>  )
}

export default Banner