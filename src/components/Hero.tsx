import { useEffect, useRef, useState } from "react"
import iphone from "../assets/iphone.png"
import ball from "../assets/ball.png"
import furniture from "../assets/furniture.png"
import vegetable from "../assets/vegetable.png"
import cart from "../assets/cart.png"
import caver from "../assets/caver.jpg"
import Ellipse from "../assets/Ellipse.png"
import first from "../assets/first.png"
import log1 from "../assets/log1.png"
import second from "../assets/second.jpg"
import glo from "../assets/glo.png"
import logo2 from "../assets/logo2.png"
import curuza from "../assets/curuza.png"
import bg_bunner from "../assets/bg_banner.png"

interface Slide {
  image: string
  category: string
  title: string
  description: string
  shopDescription: string
  buttonText: string
  price: string
  location: string
  coverImage: string
  profileImage: string
  shopName: string
  star: string
  views: string
}

const slides: Slide[] = [
  {
    image: iphone,
    category: "Electronics",
    title: "iPhone 15 Pro Max",
    description: "Latest Apple smartphone with powerful performance hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhhhhhhhhhh.",
    shopDescription: "Latest Apple smartphone with powerful performance hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhhhhhhhhhh.",
    buttonText: "Visit Shop",
    price: "1,099Rwf",
    location: "Kigali",
    coverImage: caver,
    profileImage: Ellipse,
    shopName: "Apple Store",
    star: "4.9",
    views: "3K"
  },
  {
    image: furniture,
    category: "Furniture",
    title: "Modern Furniture",
    description: "Elegant furniture to transform your home hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh.",
    shopDescription: "Elegant furniture to transform your home hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh.",
    buttonText: "Visit Shop",
    price: "5998Rwf",
    location: "Kigali",
    coverImage: first,
    profileImage: log1,
    shopName: "Furniture Hub",
    star: "4.7",
    views: "2K"
  },
  {
    image: vegetable,
    category: "Vegetables",
    title: "Fresh Vegetables",
    description: "Organic and fresh vegetables directly from farms hhhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhhhh hhhhhhhhhhh hhhhhhhhhhh.",
    shopDescription: "Organic and fresh vegetables directly from farms hhhhhhhhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhhhhhhhhhhh hhhhkkkkkkkkkkkkkkkkkkkkkk kkkkkkkkkkkkkkkhhbbjbjbjcb jb jfjbjbfbj bjbjb kkkkkkkkkkkkkk hbububdbvrhbvyhbdhb  uefbu buffffffffffffffffffff ffffffffffffffffffffffffffff fffffffffffffffffffffffff.",
    buttonText: "Visit Shop",
    price: "5000Rwf",
    location: "Remera",
    coverImage: second,
    profileImage: curuza,
    shopName: "Fresh Farm",
    star: "4.8",
    views: "1.2K"
  },
  {
    image: ball,
    category: "Sports",
    title: "Premium Sports Ball",
    description: "High-quality professional sports equipment.",
    shopDescription: "High-quality professional sports equipment.",
    buttonText: "Visit Shop",
    price: "4900Rwf",
    location: "Kigali",
    coverImage: glo,
    profileImage: logo2,
    shopName: "Sports World",
    star: "4.5",
    views: "800"
  }
]

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => prev + 1)
    }, 5000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleTransitionEnd = () => {
    if (currentSlide >= slides.length) {
      setIsTransitioning(false)
      setCurrentSlide(0)
      setTimeout(() => setIsTransitioning(true), 50)
    }
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="w-full mt-3 h-auto lg:h-105 overflow-hidden relative">
      <div
        className={`max-w-screen-2xl mx-auto flex ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full shrink-0 h-auto lg:h-105 flex flex-col lg:flex-row items-start justify-start px-6 lg:px-6 text-white">
            
            {/* Image section - on top for mobile, left for large screen */}
            <div className="w-full lg:w-auto flex justify-start relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-56 lg:h-105 w-full lg:w-155 bg-gray-200 object-cover"
              />
              <button className="sponsored-badge absolute top-3 lg:top-4 right-3 lg:right-4 bg-[#1976D2] text-white px-3 lg:px-3 py-1 text-xs lg:text-sm font-bold rounded-2xl lg:rounded-3xl">
                {"Sponsored".split("").map((letter, index) => (
                  <span
                    key={index}
                    className="sponsored-letter"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {letter}
                  </span>
                ))}
              </button>    
              {/* Left Arrow - only on large screen */}
             <button
              onClick={goToPrevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-50 hover:bg-[#18c82f] bg-[#1CA22599] text-white p-3 rounded-full transition-colors duration-300 hidden lg:block"
              aria-label="Previous slide"
               >
              <i className="fa-solid fa-chevron-left text-lg font-bold"></i>
              </button>
            </div>
            
            {/* Content - Middle - Split into two sections */}
            <div className="w-full h-140 lg:h-105 flex flex-col lg:flex-row bg-cover bg-center" style={{ backgroundImage: `url(${bg_bunner})` }}>
              
              {/* Left side - Product details */}
              <div className="w-full lg:w-1/2 p-6 flex flex-col">
                <span className="inline-block font-bold border-white px-3 lg:px-7 border-2 lg:border-[3px] rounded-md lg:rounded-[7px] text-[12px] lg:text-sm w-fit">
                  {slide.category}
                </span>

                <h2 className="text-1xl lg:text-3xl mt-1 lg:mt-5 font-extrabold text-white">
                  {slide.title}
                </h2>
                <div className="flex-1 overflow-hidden">
                  <h1 className="text-[#18C850] font-bold mt-0 lg:mt-5 text-sm lg:text-xl">Details</h1>
                  <p
                    className="mt-2 lg:mt-2 text-white leading-relaxed text-sm lg:text-sm"
                    style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {slide.description}
                  </p>
                  <p className="mt-1 lg:mt-15 text-white text-sm lg:text-md w-36 lg:w-40 flex place-items-baseline gap-2">
                  <i className="fas fa-map-marker-alt text-[#18C85082] text-2xl lg:text-3xl location-icon"></i>
                  {slide.location}/RWANDA
                </p>
                  <span className="absolute lg:flex mt-4 lg:bottom-4 bg-[#3F4E40] text-white border-[#07f051] px-3 lg:px-4 text-sm lg:text-lg font-bold rounded-2xl lg:rounded-3xl">
                  {slide.price}
                 </span>
                </div>
                <div className="flex items-center justify-center mt-2 lg:mt-4">
                <button 
                  key={`addtocart-${currentSlide}`}
                  className="bottom-3 lg:bottom-4 w-28 ml-40 lg:w-36 text-sm lg:text-sm justify-center border border-[#07f051] bg-[#3F4E40] text-white rounded-2xl lg:rounded-3xl font-bold flex items-center hover:bg-[#27bb56] hover:text-white transition-colors duration-300"
                >
                  <img src={cart} alt="cart" className="w-6 flex lg:w-8 h-6 lg:h-8 addtocart-icon" />
                  <span className=" items-center text-sm">
                    {"Add To Cart".split("").map((letter, idx) => (
                      <span
                        key={idx}
                        className="addtocart-letter"
                        style={{ animationDelay: `${idx * 0.08}s` }}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </span>
                    ))}
                  </span>
                </button>
       
                </div>
              </div>
              
              {/* Right side - Cover image and profile */}
              <div className="w-full lg:w-1/2 relative">
                <div className="absolute top-2 lg:top-3 right-4 lg:right-4 ">
                  <img
                    src={slide.coverImage}
                    alt={`Cover ${slide.shopName}`}
                    className="h-20 lg:h-25 w-80 lg:w-92.5 object-cover rounded-t-2xl lg:rounded-t-3xl"
                  />
                  <div className="absolute right-4 lg:right-4 flex gap-1 mt-1">
                    <i className="fas fa-star text-yellow-400 text-[10px] lg:text-[10px]"></i>
                    <i className="fas fa-star text-yellow-400 text-[10px] lg:text-[10px]"></i>
                    <i className="fas fa-star text-yellow-400 text-[10px] lg:text-[10px]"></i>
                    <i className="fas fa-star text-yellow-400 text-[10px] lg:text-[10px]"></i>
                    <i className="fas fa-star text-yellow-400 text-[10px] lg:text-[10px]"></i>
                    <p className="text-white items-center flex text-[10px] lg:text-[10px]">{slide.star}</p>
                  </div>
                  <p className="absolute right-4 lg:right-4 flex mt-3 lg:mt-4 text-white text-xs lg:text-xs">{slide.views} Views</p>
                </div>
                <div className="absolute top-10 lg:top-12 left-8 lg:left-20 transform -translate-x- flex flex-col">
                  <div className="profile-border-container">
                    <img
                      src={slide.profileImage}
                      alt={`Profile ${slide.shopName}`}
                      className="h-16 lg:h-20 w-16 lg:w-20 object-cover rounded-full"
                    />
                  </div>
            
                  <p className="text-[#1CA225] font-bold text-1xl lg:text-3xl  lg:mt-2 ">{slide.shopName}</p>
                 
                  <p className="mt-1 lg:mt-5 text-white text-sm lg:text-md w-30 lg:w-40 flex place-items-baseline gap-2">
                  <i className="fas fa-map-marker-alt text-[#18C85082] text-2xl lg:text-3xl location-icon"></i>
                  {slide.location}/RWANDA
                </p>
                  <h1 className="text-[#1CA225] mt-1 lg:mt-5 text-md lg:text-xl font-bold">About Shop</h1>
                  <p
                    className="text-white mt-1 text-sm lg:text-sm"
                    style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {slide.shopDescription}
                  </p>
                  
                </div>
                <div className="mt-70 lg:mt-90 flex justify-center">
                   <button className="absolute bottom-2 lg:bottom-4 right-3 lg:right-4 px-3 lg:px-3 border border-[#07f051] bg-[#3F4E40] text-white rounded-2xl lg:rounded-3xl font-bold flex items-center hover:bg-[#27bb56] text-sm lg:text-sm">
                    {slide.buttonText}
                  </button>
                </div>
                {/* Right Arrow - only on large screen */}
               <button
               onClick={goToNextSlide}
               className="absolute right-2 top-1/2 -translate-y-1/2 z-50 hover:bg-[#18c82f] bg-[#1CA22599] text-white p-3 rounded-full transition-colors duration-300 hidden lg:block"
               aria-label="Next slide"
              >
              <i className="fa-solid fa-chevron-right text-xl font-bold"></i>
              </button>
              </div>
            </div>       
          </div>
        ))}

      </div>
    </div>
  )
}

export default Hero
