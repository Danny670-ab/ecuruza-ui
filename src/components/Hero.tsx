import { useEffect, useRef, useState } from "react"
import { FaStar, FaMapMarkerAlt } from "react-icons/fa"
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
    description: "Experience the latest Apple smartphone with powerful performance, advanced camera system, and stunning display.",
    shopDescription: "Your trusted Apple dealer in Rwanda offering authentic products with warranty.",
    buttonText: "Visit Shop",
    price: "1,099,000 Rwf",
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
    title: "Modern Furniture Set",
    description: "Elegant and contemporary furniture to transform your living space into a modern sanctuary.",
    shopDescription: "Premium furniture designs for homes and offices at affordable prices.",
    buttonText: "Visit Shop",
    price: "599,000 Rwf",
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
    title: "Fresh Organic Vegetables",
    description: "Farm-fresh organic vegetables delivered directly to your doorstep. Healthy and nutritious.",
    shopDescription: "Fresh produce from local farms. Quality guaranteed with same-day delivery.",
    buttonText: "Visit Shop",
    price: "5,000 Rwf",
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
    description: "High-quality professional sports equipment for athletes and enthusiasts.",
    shopDescription: "Top sports gear and equipment for all your athletic needs.",
    buttonText: "Visit Shop",
    price: "4,900 Rwf",
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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getDescriptionFontSize = (text: string) => {
    const length = text.length
    if (length > 200) return "text-xs"
    if (length > 180) return "text-sm"
    if (length > 160) return "text-sm"
    if (length > 140) return "text-base"
    return "text-base"
  }

  const getShopDescriptionFontSize = (text: string) => {
    const length = text.length
    if (length > 200) return "text-xs"
    if (length > 180) return "text-sm"
    if (length > 160) return "text-sm"
    if (length > 140) return "text-base"
    return "text-base"
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
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
    <div className="w-full mt-3 h-[500px] overflow-hidden relative">
      <div
        className={`flex ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0 h-[500px] flex items-start justify-start px-4 md:px-7 text-white">
            
            {/* Image Section */}
            <div className="flex justify-start relative w-full md:w-auto">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-[300px] md:h-[420px] w-full md:w-[500px] lg:w-[620px] bg-gray-200 object-cover"
              />
              <span className="absolute top-4 right-4 bg-[#1976D2] text-white px-3 py-1 text-xs md:text-sm font-bold rounded-full">
                Sponsored
              </span>
            </div>
            
            {/* Content Section */}
            <div className="h-[500px] w-full bg-gradient-to-r from-[#0c2d1a] via-[#1ca225] to-[#3f4e40] flex flex-col md:flex-row">
              {/* Left side - Product details */}
              <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col relative">
                <span className="inline-block border border-white px-4 md:px-7 text-sm w-fit">
                  {slide.category}
                </span>

                <h2 className="text-2xl md:text-3xl mt-4 md:mt-5 font-extrabold text-white">
                  {slide.title}
                </h2>
                <div className="flex-1 overflow-hidden mt-2">
                  <h1 className="text-[#0fbe46] font-bold mt-3 md:mt-5 text-lg md:text-xl">Details</h1>
                  <p className={`mt-2 text-white leading-relaxed ${getDescriptionFontSize(slide.description)}`}>
                    {slide.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3 md:mt-4">
                    <FaMapMarkerAlt className="text-[#18C850]" />
                    <span className="text-white">{slide.location}, RWANDA</span>
                  </div>
                  <div className="mt-4">
                    <span className="bg-[#3F4E40] text-[#11e257] border border-[#07f051] px-4 py-2 text-base md:text-lg font-bold rounded-full">
                      {slide.price}
                    </span>
                  </div>
              
                </div>
                <div className="flex items-center mt-2">
                  <button className="w-28 md:w-32 justify-center border border-[#07f051] bg-[#3F4E40] text-white rounded-full font-bold flex items-center gap-2 py-2">
                    <img src={cart} alt="cart" className="w-5 h-5" />
                    Cart
                  </button>
                </div>
              </div>
              
              {/* Right side - Shop details */}
              <div className="w-full md:w-1/2 relative p-4 md:p-6 flex flex-col">
                {/* Cover image */}
                <div className="w-full">
                  <img
                    src={slide.coverImage}
                    alt={`Cover ${slide.shopName}`}
                    className="h-[80px] md:h-[100px] w-full object-cover rounded-t-xl md:rounded-t-3xl"
                  />
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-xs" />
                    ))}
                    <span className="text-white text-xs ml-1">{slide.star}</span>
                  </div>
                  <p className="text-white text-xs mt-1">{slide.views} Views</p>
                </div>

                {/* Profile and shop info */}
                <div className="mt-4 md:mt-6 flex flex-col">
                  <img
                    src={slide.profileImage}
                    alt={`Profile ${slide.shopName}`}
                    className="h-[70px] w-[70px] md:h-[98px] md:w-[98px] rounded-full border-4 border-white object-cover -mt-8 md:-mt-10"
                  />
               
                  <p className="text-[#1CA225] font-bold text-xl md:text-3xl mt-2">{slide.shopName}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <FaMapMarkerAlt className="text-[#18C85082] text-lg" />
                    <span className="text-white">{slide.location}, RWANDA</span>
                  </div>
                  <h1 className="text-[#1CA225] mt-4 text-lg md:text-xl font-bold">About Shop</h1>
                  <p className={`text-white mt-1 ${getShopDescriptionFontSize(slide.shopDescription)}`}>
                    {slide.shopDescription}
                  </p>
                  
                  <button className="mt-4 md:mt-auto px-6 py-2 border border-[#07f051] bg-[#3F4E40] text-white rounded-full font-bold flex items-center justify-center self-start">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>       
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-[#1CA225] w-6 md:w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero
