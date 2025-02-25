'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const POSTS = [
  {
    img: "/images/bg1.webp",
    title: "Host Success Stories in Riyadh",
    desc: "Discover how our hosts in the capital transformed their properties into exceptional tourist destinations",
  },
  {
    img: "/images/bg2.webp", 
    title: "Property Management Guide",
    desc: "Professional tips and guidelines for managing your property and achieving the highest ROI with HiHome",
  },
  {
    img: "/images/bg3.webp",
    title: "Saudi Hospitality Experience",
    desc: "How to provide an authentic hospitality experience that combines tradition and modernity for your global guests",
  },
];

export default function Home() {
  const [isStepsFullWidth, setIsStepsFullWidth] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Steps section logic only
      const stepsSection = document.getElementById('steps-section');
      if (stepsSection) {
        const rect = stepsSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const triggerPoint = rect.top + (rect.height * 0.7);
        const isStartingToShow = triggerPoint <= viewportHeight;
        setIsStepsFullWidth(isStartingToShow);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const column1Images = [
    '/images/Fexperience2.webp',
    '/images/Fexperience1.webp',
    '/images/Fexperience2.webp',
    '/images/Fexperience1.webp',
  ];

  const column2Images = [
    '/images/Fexperience1.webp',
    '/images/Fexperience2.webp',
    '/images/Fexperience1.webp',
    '/images/Fexperience2.webp',
  ];

  const column3Images = [
    '/images/Fexperience2.webp',
    '/images/Fexperience1.webp',
    '/images/Fexperience2.webp',
    '/images/Fexperience1.webp',
  ];

  const column4Images = [
    '/images/Fexperience1.webp',
    '/images/Fexperience2.webp',
    '/images/Fexperience1.webp',
    '/images/Fexperience2.webp',
  ];


  const stats = [
    {
      number: 1500,
      label: 'Host Partners',
      icon: '/images/city-svg.svg',
      description: 'Join our growing network of trusted hosts across Saudi Arabia'
    },
    {
      number: 20000,
      label: 'Happy Guests',
      icon: '/images/smile.svg',
      description: 'Creating memorable experiences for local and international visitors'
    },
    {
      number: 25,
      label: 'Cities Covered',
      icon: '/images/location-grow.svg',
      description: 'Exploring the beauty of Saudi Arabia from coast to coast'
    }
  ];

  const { ref: counterRef, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <>
    
  {/* ------------------------------------ Hero Section ---------------------------------- */}
  <section className="bg-gray-100 overflow-hidden pb-9 px-4 md:px-8">
  <div className="sm:px-5 md:px-5 xl:px-32 2xl:px-62 relative py-4 my-12">
    {/* SVG Decorations */}
    <svg width="736" height="423" className="absolute top-[50px] sm:top-[200px] sm:right-[-150px] hidden sm:block" viewBox="0 0 736 423"
            fill="none">
            <path d="M738.5 4.5C491.667 -7.66666 -0.900015 58.9 3.49999 422.5" stroke="url(#paint0_linear_16_172)"
          strokeWidth="6"></path>
            <defs>
          <linearGradient id="paint0_linear_16_172" x1="700.5" y1="-3.99998" x2="14.5" y2="361"
              gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff"></stop>
              <stop offset="1" stopColor="#ffffff"></stop>
          </linearGradient>
            </defs>
        </svg>

        <svg className="absolute sm:right-28 md:right-6  hidden sm:block" width="383" height="846" viewBox="0 0 383 846" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
          d="M3.19293 0C-0.0879101 140.127 37.2087 433.314 212.642 485.053C388.075 536.792 391.776 746.576 371.697 845"
          stroke="url(#paint0_linear_16_173)" strokeWidth="6"></path>
            <defs>
          <linearGradient id="paint0_linear_16_173" x1="16.5" y1="39.5" x2="363" y2="814"
              gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff"></stop>
              <stop offset="1" stopColor="#ffffff"></stop>
          </linearGradient>
            </defs>
        </svg>

        <svg className="absolute -top-14 sm:right-7 hidden sm:block" width="416" height="675" viewBox="0 0 416 675" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M415 3C325.774 17.8434 155.913 102.224 190.271 320.998C224.63 539.772 78.4065 646.155 1 672"
          stroke="url(#paint0_linear_16_171)" strokeWidth="6"></path>
            <defs>
          <linearGradient id="paint0_linear_16_171" x1="365.5" y1="28" x2="110" y2="594"
              gradientUnits="userSpaceOnUse">
               <stop stopColor="#ffffff"></stop>
               <stop offset="1" stopColor="#ffffff"></stop>
          </linearGradient>
            </defs>
        </svg>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-9 items-center">
            {/* Right Content */}
            <div className="lg:col-span-6 lg:col-start-7 z-20 order-1 lg:order-2">
            <div className="p-4 bg-white rounded-[100px] md:rounded-bl-[200px] lg:rounded-bl-[250px] bg-opacity-20">
              <Image 
              className="w-full rounded-[100px] md:rounded-bl-[200px] lg:rounded-bl-[250px] bg-fixed bg-center bg-no-repeat bg-cover" 
              src="/images/hero-img.webp" 
              alt="" 
              width={500}
              height={500}
              />
            </div>
            </div>

          {/* Left Content */}
          <div className="lg:col-span-6 lg:col-start-1 z-20 order-2 lg:order-1">
            <h1 className="text-3xl md:text-4xl lg:text-4xl leading-[1.7] text-black font-bold">
              <span className="text-primary">Transform</span> Your Property <br />
              Into A <span className="text-primary">Saudi Success Story</span>
            </h1>
            <p className="text-base text-black mt-6 mb-8">
              Join Hihome exclusive network of hosts and share the authentic Saudi hospitality experience with guests from around the world. Manage your properties efficiently and grow your hosting business.
            </p>
            <div className="flex gap-6 sm:gap-10">
              <button className="font-semibold text-md rounded-4xl py-2 lg:py-4 px-4 lg:px-9 text-primary border-2 border-primary cursor-pointer">
              Start Your Host Journey
              </button>
            </div>
            </div>
            </div>
            </div>

            {/* Hero Contact Form */}
            <div className="sm:px-5 md:px-5 xl:px-32 2xl:px-62">
            {/* Desktop View */}
            <div className="hidden sm:flex relative z-30 justify-between gap-5 items-center mt-6 rounded-full py-3 px-3 sm:p-8 lg:p-3 bg-white border-1 border-primary">
            <div className="flex sm:flex-1 gap-4 lg:gap-6 lg:ml-4">
            <Image src="/images/location-red.svg" alt="location" width={32} height={32} />
            <div className="text-black">
            <h2 className="hidden sm:inline-block text-xl font-bold">Main Office</h2>
            <p className="text-sm mt-3">Riyadh, Saudi Arabia</p>
            </div>
            </div>
            <span className="h-20 w-[1px] hidden sm:inline-block bg-primary"></span>
            <div className="hidden sm:flex flex-1 gap-4 lg:gap-6">
            <Image src="/images/call.svg" alt="call" width={32} height={32} />
            <div className="text-black">
            <h2 className="text-xl font-bold">Host Support</h2>
            <p className="text-sm mt-3">+975 2000 0000</p>
            </div>
            </div>
            <span className="hidden lg:inline-block h-20 w-[1px] bg-primary"></span>
            <div className="hidden lg:flex flex-1 gap-4 lg:gap-6">
            <Image src="/images/message-icon.svg" alt="message" width={32} height={32} />
            <div className="text-black">
            <h2 className="text-xl font-bold">Contact Us</h2>
            <p className="text-sm mt-3">hosts@hihome.sa</p>
            </div>
            </div>
            </div>

            {/* Mobile Slider View */}
            <div className="sm:hidden relative z-30 mt-6">
            <Swiper
            slidesPerView={1}
            loop={true}
            className="rounded-full bg-white"
            modules={[Pagination, Autoplay]}
            autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            }}
            >
            {/* Location Slide */}
            <SwiperSlide className="p-6">
            <div className="flex items-center gap-4">
              <Image src="/images/location-red.svg" alt="location" width={32} height={32} className="w-8 h-8" />
              <div className="text-black">
              <h2 className="text-lg font-bold">Main Office</h2>
              <p className="text-sm mt-1">Riyadh, Saudi Arabia</p>
              </div>
            </div>
            </SwiperSlide>

            {/* Call Slide */}
            <SwiperSlide className="p-6">
            <div className="flex items-center gap-4">
              <Image src="/images/call.svg" alt="call" width={32} height={32} className="w-8 h-8" />
              <div className="text-black">
              <h2 className="text-lg font-bold">Host Support</h2>
              <p className="text-sm mt-1">920000000</p>
              </div>
            </div>
            </SwiperSlide>

            {/* Message Slide */}
            <SwiperSlide className="p-6">
            <div className="flex items-center gap-4">
              <Image src="/images/message-icon.svg" alt="message" width={32} height={32} className="w-8 h-8" />
              <div className="text-black">
              <h2 className="text-lg font-bold">Contact Us</h2>
              <p className="text-sm mt-1">hosts@hihome.sa</p>
              </div>
            </div>
            </SwiperSlide>
            </Swiper>
            </div>
          </div>
  </section>
        

    {/* ------------------------------------ Our Growth Section ---------------------------------------*/}
<section className="relative px-4 sm:px-5 md:px-5 xl:px-32 2xl:px-62 py-24 ">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
    Our Growth in Numbers
  </h2>
  <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16">
    Experience the rapid growth and success of HiHome. Our platform continues to expand across Saudi Arabia, 
    connecting quality properties with guests seeking authentic experiences.
  </p>
  <div ref={counterRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {stats.map((stat, index) => (
      <div key={index} className="p-6">
        <div className="pattern-dots-md ">
          <div className="bg-white rounded-xl shadow-md p-8 transform translate-x-6 -translate-y-6 hover:translate-y-4 transition-transform duration-300">
            <div className="w-16 h-16 border-2 border-primary bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Image src={stat.icon} alt={stat.label} className="w-8 h-8 " width={32} height={32} />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mt-2">
                {inView && (
                  <CountUp
                    end={stat.number}
                    duration={2.5}
                    separator=","
                  />
                )}
                <span className="text-2xl">+</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-3 mb-3">{stat.label}</h3>
              <p className="text-gray-600">
                {stat.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

{/* ---------------------------------- Steps Section -------------------------------------*/}
<section id="steps-section" className="relative py-16">
  {/* Background container that animates - Only on desktop */}
  <div className={`absolute inset-0 transition-all duration-700 ${
    isStepsFullWidth ? 'mx-0' : 'mx-4 sm:mx-5 md:mx-5 xl:mx-32 2xl:mx-62'
  }`}>
    <div 
      className={`w-full h-full bg-[url('/images/bg5.webp')] bg-fixed bg-center bg-no-repeat bg-cover transition-all duration-700 ${
        isStepsFullWidth ? '' : 'rounded-3xl'
      }`}
    />
    <div className={`absolute inset-0 bg-primary/90 transition-all duration-700 ${
      isStepsFullWidth ? '' : 'rounded-3xl'
    }`} />
  </div>

    {/* ---------------------------Steps Section------------------------------ */}
    <div className="relative z-10 px-4 sm:px-5 md:px-5 xl:px-32 2xl:px-62">
    <div className="text-center max-w-3xl mx-auto mb-4">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
        Start Your Journey as a Host
      </h2>
      <p className="text-lg text-white/90">
        Join our community of successful hosts and share your unique space with guests from around the world. Follow these simple steps to get started.
      </p>
    </div>

    {/* Steps Row */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
      {/* Step 1 */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex flex-col items-center text-center">
          <div className="step-number-container w-16 h-16 relative mb-4">
            <div className="step-number absolute inset-0 bg-primary/20 rounded-full"></div>
            <div className="absolute inset-2 bg-primary/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black bg-gradient-to-r from-primary to-[#B43D23] bg-clip-text text-transparent">1</span>
            </div>
            <svg className="step-circle absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" 
                strokeWidth="2" className="text-primary/20"
                strokeDasharray="20,5" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Tell us about your place</h3>
            <p className="text-gray-600 text-sm">
              Share the unique features and amenities of your property that make it special.
            </p>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex flex-col items-center text-center">
          <div className="step-number-container w-16 h-16 relative mb-4">
            <div className="step-number absolute inset-0 bg-primary/20 rounded-full"></div>
            <div className="absolute inset-2 bg-primary/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black bg-gradient-to-r from-primary to-[#B43D23] bg-clip-text text-transparent">2</span>
            </div>
            <svg className="step-circle absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" 
                strokeWidth="2" className="text-primary/20"
                strokeDasharray="20,5" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">about your Experience</h3>
            <p className="text-gray-600 text-sm">
              Describe what makes your hosting style unique and what guests can expect.
            </p>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex flex-col items-center text-center">
          <div className="step-number-container w-16 h-16 relative mb-4">
            <div className="step-number absolute inset-0 bg-primary/20 rounded-full"></div>
            <div className="absolute inset-2 bg-primary/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black bg-gradient-to-r from-primary to-[#B43D23] bg-clip-text text-transparent">3</span>
            </div>
            <svg className="step-circle absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" 
                strokeWidth="2" className="text-primary/20"
                strokeDasharray="20,5" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Specify your availability</h3>
            <p className="text-gray-600 text-sm">
              Set your preferred check-in times and availability for welcoming guests.
            </p>
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex flex-col items-center text-center">
          <div className="step-number-container w-16 h-16 relative mb-4">
            <div className="step-number absolute inset-0 bg-primary/20 rounded-full"></div>
            <div className="absolute inset-2 bg-primary/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black bg-gradient-to-r from-primary to-[#B43D23] bg-clip-text text-transparent">4</span>
            </div>
            <svg className="step-circle absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" 
                strokeWidth="2" className="text-primary/20"
                strokeDasharray="20,5" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Complete your listing</h3>
            <p className="text-gray-600 text-sm">
              Add your location details and upload high-quality photos of your space.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="text-center mt-8">
      <button className="bg-white text-primary px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300 font-semibold cursor-pointer">
        Start Hosting Today
      </button>
    </div>
  </div>
</section>

{/*------------------------------- Additional Steps Section ----------------------------------- */}
<section className="bg-gray-100 py-16 mb-24">
  <div className="px-4 sm:px-5 md:px-5 xl:px-32 2xl:px-62">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
        Your Path to Hosting Excellence
      </h2>
      <p className="text-lg text-gray-600">
        We provide comprehensive support at every stage of your hosting journey. Follow our proven process to maximize your success on HiHome.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Steps */}
      <div className="lg:col-span-4 space-y-6 flex flex-col">
        {/* Step 1 */}
        <div className="bg-white rounded-2xl p-6 transform hover:-translate-y-1 transition-transform duration-300 flex-1">
          <div className="flex items-start gap-4 h-full">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Image src="/images/city-svg.svg" alt="experience" width={32} height={32} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Property Assessment</h3>
              <p className="text-gray-600">Share what makes your hosting style unique and what guests can expect. Expert evaluation of your property's potential and market positioning.</p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-2xl p-6 transform hover:-translate-y-1 transition-transform duration-300 flex-1">
          <div className="flex items-start gap-4 h-full">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Image src="/images/city-svg.svg" alt="experience" width={32} height={32} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Optimization Strategy</h3>
              <p className="text-gray-600">Share what makes your hosting style unique and what guests can expect. Customized plan to enhance your property's appeal and earning potential.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Center Image */}
      <div className="lg:col-span-4 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <Image
            src="/images/steps-img.jpeg"
            alt="House Illustration"
            width={200} 
            height={200}
            className="w-full h-96 rounded-2xl object-fill"
          />
          <div className="absolute inset-0 bg-primary/20 rounded-2xl"></div>
        </div>
      </div>

      {/* Right Steps */}
      <div className="lg:col-span-4 space-y-6 flex flex-col">
        {/* Step 3 */}
        <div className="bg-white rounded-2xl p-6 transform hover:-translate-y-1 transition-transform duration-300 flex-1">
          <div className="flex items-start gap-4 h-full">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Image src="/images/city-svg.svg" alt="experience" width={32} height={32} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Professional Setup</h3>
              <p className="text-gray-600">Share what makes your hosting style unique and what guests can expect. Complete property preparation and profile creation by our experts.</p>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-2xl p-6 transform hover:-translate-y-1 transition-transform duration-300 flex-1">
          <div className="flex items-start gap-4 h-full">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Image src="/images/city-svg.svg" alt="experience" width={32} height={32} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Active Management</h3>
              <p className="text-gray-600">Share what makes your hosting style unique and what guests can expect. Ongoing support and optimization to maintain peak performance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="text-center mt-12">
      <button className="bg-gray-100 text-primary px-8 py-3 rounded-full border-1 border-primary transition-colors duration-300 font-semibold cursor-pointer">
        Get Started Now
      </button>
    </div>
  </div>
</section>

  {/* ------------------------------------ Discover Your Stay Section ---------------------------------------*/}
  <section className="relative h-[500px] px-4 sm:px-5 md:px-5 xl:px-32 2xl:px-62 flex flex-col lg:flex-row overflow-hidden mt-4 mb-24">
        
        {/* Left Columns */}
        <div className="lg:hidden w-full overflow-hidden relative p-4 z-10">
          <Swiper
            slidesPerView={1.8}
            spaceBetween={10}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="h-full [&_.swiper-slide]:!h-auto [&_.swiper-wrapper]:h-full"
          >
            {column1Images.map((slide, index) => (
              <SwiperSlide key={`mobile-${index}`} className="py-3">
                <div className="aspect-square rounded-xl overflow-hidden relative">
                  <Image 
                    src={slide} 
                    alt="" 
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="hidden lg:flex gap-6 w-1/3 h-full z-10">
          <div className="w-1/2 h-full pb-10">
            <Swiper
              direction="vertical"
              slidesPerView={2.8}
              spaceBetween={10}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              className="!pb-4 h-full [&_.swiper-wrapper]:h-full"
            >
              {column1Images.map((slide, index) => (
                <SwiperSlide key={`col-1-${index}`} className="!h-auto">
                  <div className="aspect-square rounded-xl overflow-hidden relative">
                    <Image 
                      src={slide} 
                      alt="" 
                      fill
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="w-1/2 h-full pt-10">
            <Swiper
              direction="vertical"
              slidesPerView={2.8}
              spaceBetween={10}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              className="!pb-4 h-full [&_.swiper-wrapper]:h-full"
            >
              {column2Images.map((slide, index) => (
                <SwiperSlide key={`col-2-${index}`} className="!h-auto">
                  <div className="aspect-square rounded-xl overflow-hidden relative">
                    <Image 
                      src={slide} 
                      alt="" 
                      fill
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 lg:px-8 z-10 relative">
          <h2 className="text-xl lg:text-2xl xl:text-4xl font-bold mt-4 lg:mt-4 mb-4 lg:mb-6 text-black">
            Discover Your Perfect Stay
          </h2>
          <p className="text-lg lg:text-xl text-black mb-6 lg:mb-8 max-w-2xl">
            Experience luxury and comfort in our carefully curated properties. Each location offers a unique blend of style and convenience.
          </p>
          <button className="bg-primary text-white px-6 py-2.5 lg:px-8 lg:py-3 rounded-full hover:bg-[#B43D23] transition-colors duration-300 cursor-pointer">
            Explore Properties
          </button>
        </div>

        {/* Right Columns */}
        <div className="hidden lg:flex gap-6 w-1/3 h-full z-10">
          <div className="w-1/2 h-full pt-10">
            <Swiper
              direction="vertical"
              slidesPerView={2.8}
              spaceBetween={10}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              className="!pb-4 h-full [&_.swiper-wrapper]:h-full"
            >
              {column3Images.map((slide, index) => (
                <SwiperSlide key={`col-3-${index}`} className="!h-auto">
                  <div className="aspect-square rounded-xl overflow-hidden relative">
                    <Image 
                      src={slide} 
                      alt="" 
                      fill
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="w-1/2 h-full pb-10">
            <Swiper
              direction="vertical"
              slidesPerView={2.8}
              spaceBetween={10}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
              }}
              className="!pb-4 h-full [&_.swiper-wrapper]:h-full"
            >
              {column4Images.map((slide, index) => (
                <SwiperSlide key={`col-4-${index}`} className="!h-auto">
                  <div className="aspect-square rounded-xl overflow-hidden relative">
                    <Image 
                      src={slide} 
                      alt="" 
                      fill
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* ----------------------------------App Download Section--------------------------------- */}
      <section className="sm:px-5 md:px-5 xl:px-32 2xl:px-62 ">
      <div className="relative mt-56 ">
        {/* Background container */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-[url('/images/bg5.webp')] bg-fixed bg-center bg-no-repeat bg-cover rounded-3xl" />
          <div className="absolute inset-0 bg-primary/90 rounded-3xl" />
        </div>
        {/* Content container */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Mobile Image */}
            <div className="lg:col-span-5 relative z-20 flex justify-center lg:justify-end px-0 lg:px-4 pt-0 lg:pt-4">
              <div className="relative -mt-[100px]">
               <Image
                src="/images/mobilemockup.webp"
                alt="Mobile App"
                width={275}
                height={550}
                className="h-[600px] w-auto object-contain"
              />
              </div>
            </div>
            {/* Content Area */}
            <div className="lg:col-span-6 relative z-10">
               <div className="h-full flex items-center">
                <div className="w-full px-4 lg:px-24 py-6 lg:py-0 text-center lg:text-left mx-auto lg:mx-0">
                  <h2 className="text-4xl font-bold text-white mb-6">
                  Experience the Future in Your Pocket
                  </h2>
                  <p className="text-white text-lg mb-6">
                  Transform your smartphone into a powerful command center! With the Hihome app, manage your activities effortlessly, connect with others, and enjoy a seamless experience. Your journey to success begins with a simple tap.
                  </p>
                   {/* Apple and Play Store */}
                  <div className="flex flex-col lg:flex-row justify-center lg:justify-start gap-3 items-center lg:items-start">
                    <a href="https://play.google.com/store" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 transition-colors rounded-xl px-6 py-2 w-[220px] lg:w-auto justify-center"
                    >
                     <Image src="/images/GooglePlay.svg" alt="Google Play" width={32} height={32} />
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-primary">GET IT ON</span>
                        <span className="text-sm font-semibold text-primary">Google Play</span>
                      </div>
                    </a>
                    
                    <a href="https://apps.apple.com" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 transition-colors rounded-xl px-6 py-2 w-[220px] lg:w-auto justify-center"
                    >
                     <Image src="/images/AppleStore.svg" alt="Apple Store" width={32} height={32} />
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-primary">Download on the</span>
                        <span className="text-sm font-semibold text-primary">App Store</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>     

       {/* ------------------------------------What We Offer---------------------------------------*/}
       <section className="px-4 sm:px-5 md:px-5 xl:px-32 2xl:px-62 py-24 bg-gray-100 mt-24 mb-16">
            <div
            className="h-[620px] overflow-y-scroll bg-cover bg-fixed bg-center bg-no-repeat rounded-2xl scrollbar-hide relative"
            style={{ 
              backgroundImage: "url('/images/bg5.webp')",
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            >
            <div className="absolute inset-0 bg-primary/0"></div>
            <div className="mt-110 transition-transform duration-500 ease-out relative z-10"></div>
              <div className="bg-white p-8 sm:py-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 mt-2 text-black">
          What We Offer at Hi Home
              </h2>
              <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16">
          Join our growing community of hosts and access comprehensive tools designed to elevate 
          your hosting experience in the Saudi hospitality market.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {/* Property Management Card */}
          <div className="relative">
          <div className="absolute top-1 left-1 w-full h-full bg-primary rounded-2xl"></div>
          <div className="relative bg-white shadow-md p-6 rounded-2xl h-full">
            <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 p-2">
              <Image src="/images/city-svg.svg" alt="experience" width={32} height={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Smart Management</h3>
            </div>
            <p className="text-gray-600">
              Manage your properties effortlessly with our advanced platform. Handle bookings, track revenue, and automate tasks all in one place. Optimize pricing and maintain high occupancy rates across your Saudi properties.
            </p>
            </div>
          </div>
          </div>

          {/* Host Support Card */}
          <div className="relative">
          <div className="absolute top-1 left-1 w-full h-full bg-primary rounded-2xl"></div>
          <div className="relative bg-white shadow-md p-6 rounded-2xl h-full">
            <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 p-2">
              <Image src="/images/city-svg.svg" alt="experience" width={32} height={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">24/7 Host Support</h3>
            </div>
            <p className="text-gray-600">
              Access our multilingual support team anytime for hosting assistance. Get expert help with technical issues and guest relations, plus regular training to enhance your hosting skills.
            </p>
            </div>
          </div>
          </div>

          {/* Marketing & Visibility Card */}
          <div className="relative">
          <div className="absolute top-1 left-1 w-full h-full  bg-primary rounded-2xl"></div>
          <div className="relative bg-white p-6  shadow-md rounded-2xl h-full">
            <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 p-2">
              <Image src="/images/city-svg.svg" alt="experience" width={32} height={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Enhanced Visibility</h3>
            </div>
            <p className="text-gray-600">
              Increase your property's exposure through our marketing network. Get professional photos, optimized listings, and targeted campaigns to attract quality guests.
            </p>
            </div>
          </div>
          </div>
              </div>
              <div className="text-center mt-16">
          <button className="bg-primary text-white px-8 py-3 rounded-full hover:bg-[#B43D23] transition-colors duration-300 cursor-pointer">
          Learn More About Our Services
          </button>
              </div>
              </div>
            </div>
        </section>

       
{/* ------------------------------------ Blog Section ---------------------------------- */}
<section className="sm:px-5 md:px-5 xl:px-32 2xl:px-62 p-4 mb-16">
  <div className="text-center max-w-3xl mx-auto mb-12">
    <h2 className="text-4xl font-bold mb-4 text-black">
      Latest Updates
    </h2>
    <p className="text-lg text-gray-600">
      Join our community of successful hosts and share your unique space with guests from around the world. Follow these simple steps to get started.
    </p>
  </div>
  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 ">
    {POSTS.map(({ img, title, desc }) => (
      <div
        key={title}
        className="relative grid min-h-[30rem] items-end overflow-hidden rounded-3xl border-0"
      >
        <div className="absolute inset-0">
          <Image
            src={img}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover bg-fixed bg-center bg-no-repeat bg-cover"
            width={500}
            height={500}
          />
        </div>
        <div className="p-8 relative">
            <div className="bg-gradient-to-t from-black/90 to-black/20 p-6 rounded-[32px] h-[200px] flex flex-col justify-end">
            <h3 className="text-2xl font-bold text-white mb-4">
              {title}
            </h3>
            <div className="text-lg text-white/80">
              {desc}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
    </>
  );
}
