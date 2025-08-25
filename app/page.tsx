'use client'
import Image from 'next/image';
import { FlipWords } from "@/components/ui/flip-words";

export default function Home() {
  const words = ["stay", "rest-room", "pleace", "on-center"];

  // npm install --save-dev @types/jsonwebtoken
  // npm i bcryptjs
  // npm install next-auth
  //  npm i mongoose  
  // npm install @mui/material @emotion/react @emotion/styled  
  // npm install @mui/icons-material  
  //npm install material-ui-popup-state 
  //npm install lucide-react
  //npm install zod
  //npm i --save-dev @types/nodemailer




  return (
    <div>
      <div className="relative bg-[url('/image/background-image.jpg')] bg-cover bg-center h-screen text-white">

        {/* Content */}
        <div className="flex flex-col justify-center h-full px-6 md:px-16">

          {/* Text Section */}
          <div className="mb-3 ml-4">

            <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                <span>
                  Tailwind Connect
                </span>
                <svg
                  fill="none"
                  height="16"
                  viewBox="0 0 24 24"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.75 8.75L14.25 12L10.75 15.25"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
            </button>

            <h1 className="text-2xl sm:text-3xl md:text-5xl max-w-116 font-bold mb-1 drop-shadow-lg text-gray-700">
              Welcome to <br /> Student <FlipWords words={words} />
            </h1>
            <p className="text-sm sm:text-base md:text-[16px] leading-relaxed max-w-[500px] text-black drop-shadow-sm">
              “A calm stay before the big test,
              So you can give your absolute best.”
            </p>
          </div>

          {/* Search Section */}
          <div className="w-full max-w-4xl bg-white/70 backdrop-blur-md rounded-xl p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 w-full">

              <input
                type="text"
                placeholder="Enter your center name"
                className="w-full p-3 rounded-md border border-gray-300 placeholder-gray-500 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                className="w-full p-3 rounded-md border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                placeholder="Enter area PIN Code"
                className="w-full p-3 rounded-md border border-gray-300 placeholder-gray-500 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button className="w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md transition">
                Search
              </button>

            </div>
          </div>


        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">Dream Destination</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea similique reprehenderit labore animi cumque beatae.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition duration-300">
            <Image
              src="/image/image2.jpeg"
              alt="A tropical beach with palm trees and clear water"
              width={400}
              height={192}
              className="w-full h-48 object-cover" />
            <p className="p-4 text-center text-gray-700 font-medium">Tropical Beach</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition duration-300">
            <Image
              src="/image/image3.jpg"
              alt="Misty mountains at sunrise"
              width={400}
              height={192}
              className="w-full h-48 object-cover" />
            <p className="p-4 text-center text-gray-700 font-medium">Misty Mountains</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition duration-300">
            <Image
              src="/image/image4.jpg"
              alt="A modern cityscape at night with illuminated skyscrapers"
              width={400}
              height={192}
              className="w-full h-48 object-cover" />
            <p className="p-4 text-center text-gray-700 font-medium">Modern Cityscape</p>
          </div>
        </div>
      </div>


    </div>

  );
}
