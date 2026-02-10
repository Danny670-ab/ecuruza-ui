
function Hero() {
  return (
    <div
      className="min-h-screen mt-10 ml-4 w-full bg-center bg-cover flex items-start justify-start"
    >
      <div className="max-w-6xl w-full pl-4 sm:pl-6 lg:pl-12 py-8 flex flex-col items-start text-left">
        <h1 className="text-black font-bold">
          WELCOME TO E-CURUZA
        </h1>

        <h2 className="text-green-800 mt-3">
          Innovative Solution To Empower Your Business
        </h2>

        <a
          href="#"
          className="mt-5 inline-flex items-center justify-center w-28 h-8 text-sm font-bold rounded-md text-white bg-emerald-800"
        >
          Get Started
        </a>
      </div>
    </div>
  )
}

export default Hero