import { useState, useEffect, useRef } from "react"
import iphone from "../assets/iphone.png"
import ball from "../assets/ball.png"
import furniture from "../assets/furniture.png"
import vegetable from "../assets/vegetable.png"

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const slides = [iphone, furniture, vegetable, ball]
  const extendedSlides = [...slides, slides[0]]

  const handleSlideChange = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentSlide((prev) => prev + 1)
      return
    }

    const nextSlide = currentSlide + 1

    if (nextSlide >= extendedSlides.length) {
      setIsTransitioning(false)
      setCurrentSlide(0)
    } else {
      setCurrentSlide(nextSlide)
    }
  }

  const handleTransitionEnd = () => {
    if (currentSlide >= extendedSlides.length - 1) {
      setIsTransitioning(false)
      setCurrentSlide(0)
    }
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      handleSlideChange()
    }, 5000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [currentSlide, isTransitioning])

  return (
    <div className="w-full h-[450px] overflow-hidden">
      <div
        className="flex"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: isTransitioning ? "transform 1s ease-in-out" : "none"
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedSlides.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0">

            {/* SLIDE 1 - IPHONE */}
            {index === 0 && (
              <div className="flex items-center justify-between px-7 text-white h-[420px] ">
                <div className=" flex justify-center">
                  <img src={image} className="h-[420px] w-[620px] bg-gray-200" />
                </div>
                 <div className="h-[420px] w-full bg-[linear-gradient(80deg,_#0c2d1a_50%,_#1ca225_45%,_#3f4e40_70%)]">
                  <h1 className="mt-10 ml-5">Electronics</h1>
                  <h2 className="text-3xl mt-5 ml-5 font-extrabold bg-gradient-to-r from-[#1CA225] via-[#10381C] to-[#18C850] bg-clip-text text-transparent">iPhone 15 Pro Max</h2>
                  <p className="mt-4 ml-5 text-lg">
                    Experience the most powerful iPhone ever created.
                  </p>
                  <button className="mt-6 ml-20 px-8 py-3 bg-white text-black rounded-xl">
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* SLIDE 2 - FURNITURE */}
            {index === 1 && (
              <div className="flex items-center justify-between px-7 text-white h-[420px]">
                <div className="flex justify-center">
                  <img src={image} className="h-[420px] w-[620px] bg-gray-200" />
                </div>
                  <div className="h-[420px] w-full bg-[linear-gradient(80deg,_#0c2d1a_50%,_#1ca225_45%,_#3f4e40_70%)]">
                  <h1 className="mt-10 ml-5">Furniture</h1>
                  <h2 className="text-3xl mt-5 ml-5 font-extrabold bg-gradient-to-r from-[#1CA225] via-[#10381C] to-[#18C850] bg-clip-text text-transparent ">Modern Furniture</h2>
                  <p className="mt-4 ml-5 text-lg">
                    Elegant furniture to transform your home.
                  </p>
                  <button className="mt-6 ml-5 px-8 py-3 bg-white text-black rounded-xl">
                    Shop Furniture
                  </button>
                </div>
              </div>
            )}

            {/* SLIDE 3 - VEGETABLES */}
            {index === 2 && (
              <div className="flex items-center justify-between px-7  text-white h-[420px]">
                <div className="flex justify-center">
                  <img src={image} className="h-[420px] w-[620px] bg-gray-200" />
                </div>
                  <div className="h-[420px] w-full bg-[linear-gradient(80deg,_#0c2d1a_50%,_#1ca225_45%,_#3f4e40_70%)]">
                  <h1 className="mt-10 ml-5">Vegetables </h1>
                  <h2 className="text-3xl  mt-5 ml-5 font-extrabold bg-gradient-to-r from-[#1CA225] via-[#10381C] to-[#18C850] bg-clip-text text-transparent ">Fresh Vegetables</h2>
                  <p className="mt-4 ml-5 text-lg">
                    Organic and fresh vegetables directly from farms.
                  </p>
                  <button className="mt-6 ml-5 px-8 py-3 bg-white text-black rounded-xl">
                    Order Now
                  </button>
                </div>
              </div>
            )}

            {/* SLIDE 4 - BALL */}
            {index === 3 && (
              <div className="flex items-center justify-between px-7  text-white h-[420px]">      
                <div className="flex justify-center">
                  <img src={image} className="h-[420px] w-[620px] bg-gray-200" />
                </div>
                  <div className="h-[420px] w-full bg-[linear-gradient(80deg,_#0c2d1a_50%,_#1ca225_45%,_#3f4e40_70%)]">
                  <h1 className="mt-10 ml-5"></h1>
                  <h2 className="text-3xl mt-5 ml-5 font-extrabold bg-gradient-to-r from-[#1CA225] via-[#10381C] to-[#18C850] bg-clip-text text-transparent ">Premium Sports Ball</h2>
                  <p className="mt-4 ml-5 text-lg">
                    High-quality professional sports equipment.
                  </p>
                  <button className="mt-6 ml-5 px-8 py-3 bg-white text-black rounded-xl">
                    Shop Sports
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}

export default Hero