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
    description: "Elegant furniture to transform your home hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh.",
    shopDescription: "Elegant furniture to transform your home hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh.",
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
    description: "Organic and fresh vegetables directly from farms hhhhhhhhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh hhhh.",
    shopDescription: "Organic and fresh vegetables directly from farms hhhhhhhhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh hhhhkkkkkkkkkkkkkkkkkkkkkk kkkkkkkkkkkkkkkhhbbjbjbjcb jb jfjbjbfbj bjbjb kkkkkkkkkkkkkk hbububdbvrhbvyhbdhb  uefbu buffffffffffffffffffff ffffffffffffffffffffffffffff fffffffffffffffffffffffff.",
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

  const getDescriptionFontSize = (text: string) => {
    const length = text.length
    if (length > 200) return "text-[10px]"
    if (length > 180) return "text-[11px]"
    if (length > 160) return "text-[12px]"
    if (length > 140) return "text-[13px]"
    if (length > 120) return "text-sm"
    if (length > 100) return "text-base"
    return "text-lg"
  }

  const getShopDescriptionFontSize = (text: string) => {
    const length = text.length
    if (length > 200) return "text-[10px]"
    if (length > 180) return "text-[11px]"
    if (length > 160) return "text-[12px]"
    if (length > 140) return "text-[13px]"
    if (length > 120) return "text-sm"
    if (length > 100) return "text-base"
    return "text-lg"
  }

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

  return (
    <div className="w-full mt-3 h-105 overflow-hidden">
      <div
        className={`flex ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full shrink-0 h-105 flex items-start justify-start px-7 text-white">
            
            <div className="flex justify-start relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-105 w-155 bg-gray-200  object-cover"
              />
              <button className="sponsored-badge absolute top-4 right-4 bg-[#1976D2] text-white px-3 py-1 text-sm font-bold rounded-3xl">
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
            </div>
            
            {/* Content - Middle - Split into two sections */}
            <div className=" h-105 w-full flex bg-cover bg-center" style={{ backgroundImage: `url(${bg_bunner})` }}>
              {/* Left side - Product details */}
              <div className="w-1/2 p-6 flex flex-col">
                <span className="inline-block font-bold border-white px-7 border-[3px] rounded-[7px] text-sm w-fit">
                  {slide.category}
                </span>

                <h2 className="text-3xl mt-5 font-extrabold text-white">
                  {slide.title}
                </h2>
                <div className="flex-1 overflow-hidden">
                  <h1 className="text-[#18C850] font-bold mt-5 text-xl">Details</h1>
                  <p className={`mt-2 text-white leading-relaxed ${getDescriptionFontSize(slide.description)}`}>
                    {slide.description}
                  </p>
                  <p className="mt-15 text-white text-md ml-2 w-40 flex place-items-baseline gap-2">
                  <i className="fas fa-map-marker-alt text-[#18C85082]  text-3xl location-icon"></i>
                  {slide.location}/RWANDA
                </p>
                  <span className="absolute flex bottom-4  bg-[#3F4E40] text-white border-[#07f051] px-4 text-lg font-bold rounded-3xl">
                  {slide.price}
                 </span>
             
                </div>
                <div className="flex items-center mt-4">
                <button className=" ml-50 bottom-4 absolute w-33 text-sm justify-center border  border-[#07f051] bg-[#3F4E40] text-white rounded-3xl font-bold flex items-center hover:bg-[#27bb56] hover:text-[#3F4E40] transition-colors duration-300">
                  <img src={cart} alt="cart" className="w-8 h-8" />
                  {"Add To Cart".split("").map((letter, index) => (
                    <span
                      key={index}
                      className="sponsored-letter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </button>
                </div>
              </div>
              
              {/* Right side - Cover image and profile - Top right of gradient bg */}
              <div className="w-1/2 relative">
                <div className="absolute top-3 right-2 w-full">
                  <img
                    src={slide.coverImage}
                    alt={`Cover ${slide.shopName}`}
                    className="h-25 w-92.5 object-cover rounded-t-3xl ml-auto"
                  />
                  <div className="absolute  right-5 flex gap-1 mt-1">
                    <i className="fas fa-star text-yellow-400 text-[10px]"></i>
                    <i className="fas fa-star text-yellow-400 text-[10px]"></i>
                    <i className="fas fa-star text-yellow-400 text-[10px]"></i>
                    <i className="fas fa-star text-yellow-400 text-[10px]"></i>
                    <i className="fas fa-star text-yellow-400 text-[10px]"></i>
                    <p className="text-white items-center flex text-[10px]">{slide.star}</p>
                  </div>
                  <p className="absolute right-5 flex mt-4 text-white text-xs">{slide.views} Views</p>
                </div>
                <div className="absolute top-12 left-20 transform -translate-x- flex flex-col">
                  <div className="profile-border-container">
                    <img
                      src={slide.profileImage}
                      alt={`Profile ${slide.shopName}`}
                      className="h-20 w-20 object-cover rounded-full"
                    />
                  </div>
              
                  <p className="text-[#1CA225] font-bold text-3xl mt-2 ">{slide.shopName}</p>
                 
                  <p className="mt-5 text-white text-md w-40 flex place-items-baseline gap-2">
                  <i className="fas fa-map-marker-alt text-[#18C85082] text-3xl location-icon"></i>
                  {slide.location}/RWANDA
                </p>
                  <h1 className="text-[#1CA225] mt-5 text-xl font-bold">About Shop</h1>
                  <p className={`text-white mt-1 text-semibold ${getShopDescriptionFontSize(slide.shopDescription)}`}>{slide.shopDescription}</p>
                 
                </div>
                <div className="mt-90 ml-30">
                   <button className="absolute bottom-4 right-4 px-3 border border-[#07f051] bg-[#3F4E40] text-white rounded-3xl font-bold flex items-center hover:bg-[#27bb56]">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>       
          </div>
        ))}
      </div>
    </div>
  )
}

export default Hero


