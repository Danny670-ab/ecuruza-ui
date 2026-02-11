import iphone from "../assets/iphone.png"

function Hero() {
  return (
    <div className='max-w-screen-xl px-6 mx-auto mt-10 bg-[#3F4E40] ml-5 mr-5 w-full h-[470px] flex items-center justify-cente'>
      <div >
      <img 
        src={iphone} 
        alt="iPhone" 
        className="h-[470px] px-4 bg-gray-200 object-contain "
      />
    </div>
    <div className=''>

    </div>
    </div>
   
  )
}

export default Hero