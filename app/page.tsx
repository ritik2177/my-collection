'use client'
import { FlipWords } from "@/components/ui/flip-words";
import Footer from "@/components/footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [center, setCenter] = useState("");
  const [city, setCity] = useState("");
  const [guests, setGuests] = useState("");

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (center) query.append("center", center);
    if (city) query.append("city", city);
    if (guests) query.append("guests", guests);

    router.push(`/rooms?${query.toString()}`);
  };

  const words = ["STAY", "PEACE", "REST ROOM", "ON CENTER"];

  const [openPanel, setOpenPanel] = useState<string | null>("panel1");

  const togglePanel = (panel: string) => {
    setOpenPanel(openPanel === panel ? null : panel);
  }

  return (
    <div>
      <div className="relative bg-[url('/image/background-image.jpg')] bg-cover bg-center h-screen text-white">

        <div className="flex flex-col justify-end h-full px-6 md:px-16 md:pb-45 pb-20 ">

          {/* Header Section of home page*/}
          <button data-aos="fade-up" data-aos-delay="300" className="bg-gray-600 w-fit p-0.5 md:p-1 px-2 md:px-4 text-sm border-none rounded-2xl ml-1 md:ml-2 text-center flex justify-center items-center 
  hover:scale-105 active:scale-95 transition-transform duration-300 ease-in-out animate-bounce">
            🎉 get ready for exam
          </button>
          <div className="mb-3 ml-4">
            <h1 data-aos="fade-up" data-aos-delay="600" className="text-2xl sm:text-3xl md:text-5xl max-w-136 font-bold mb-1 drop-shadow-lg text-gray-700">
              Welcome to <br /> Student <FlipWords words={words} />
            </h1>
            <p data-aos="fade-up" data-aos-delay="900" className="text-sm sm:text-base md:text-[16px] leading-relaxed max-w-[500px] text-black drop-shadow-sm">
              “A calm stay before the big test,
              So you can give your absolute best.”
            </p>
          </div>

          {/* Search Section */}
          <div data-aos="fade-up" data-aos-delay="1200" className="w-full max-w-3xl bg-white/70 backdrop-blur-md rounded-xl p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 w-full">

              <input
                type="text"
                placeholder="Enter your center name"
                className="w-full p-3 rounded-md border border-gray-300 placeholder-gray-500 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={center}
                onChange={(e) => setCenter(e.target.value)}
              />

              <input
                type="text"
                placeholder="Enter your city"
                className="w-full p-3 rounded-md border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <input
                type="number"
                placeholder="Number of Guest"
                className="w-full p-3 rounded-md border border-gray-300 placeholder-gray-500 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />

              <button
                className="w-full md:w-auto bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-md transition"
                onClick={handleSearch}
              >
                Search
              </button>

            </div>
          </div>


        </div>
      </div>


      {/* 2nd page */}
      <div className="container mx-auto px-4 pt-18">
        <h3
          data-aos="fade-up"
          className="text-5xl text-center font-bold text-purple-700 mb-4"
        >
          Who we are
        </h3>
        <p
          data-aos="fade-up"
          data-aos-delay="300"
          className="text-center text-gray-600 mt-4 md:px-30"
        >
          We are a dedicated platform created especially for students who travel
          across cities to appear for competitive and University exams. We
          understand how stressful it can be to find a place to rest before an
          important test.
        </p>

        <div
          data-aos="fade-up"
          data-aos-delay="600"
          className="flex flex-wrap mt-2 w-full py-10 justify-center items-center"
        >
          {/* Left side image */}
          <div className="w-full md:w-5/12 flex justify-center items-center">
            <Image src="/image/home1.png" alt="Illustration of a person studying" width={500} height={500} />
          </div>

          {/* Right side accordion */}
          <div className="w-full md:w-7/12 flex flex-col justify-center items-center">
            <div className="w-full max-w-4xl space-y-4">
              {/* Panel 1 */}
              <div className="border rounded-lg shadow w-full">
                <button
                  className={"w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-white rounded-t-lg bg-purple-600 hover:bg-purple-700"}
                  onClick={() => togglePanel("panel1")}
                >
                  Stress-Free Stays for Exam Travelers
                  <span>{openPanel === "panel1" ? "−" : "+"}</span>
                </button>
                {openPanel === "panel1" && (
                  <div className="p-4 text-gray-700 bg-purple-50">
                    We are a dedicated platform created especially for students who
                    travel across cities to appear for competitive and University 
                    exams.  We understand how stressful it can be to find a place to
                    rest before an important test..
                  </div>
                )}
              </div>

              {/* Panel 2 */}
              <div className="border rounded-lg shadow w-full">
                <button
                  className={"w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-white rounded-t-lg bg-purple-600 hover:bg-purple-700"}
                  onClick={() => togglePanel("panel2")}
                >
                  Affordable, Comfortable Rooms Near Exams Centers
                  <span>{openPanel === "panel2" ? "−" : "+"}</span>
                </button>
                {openPanel === "panel2" && (
                  <div className="p-4 text-gray-700 bg-purple-50">
                    Our mission is simple: to provide affordable, short-term, and
                    comfortable stays near exam centers so students can relax,
                    refresh, and focus entirely on their performance. Instead of
                    spending a lot on hotels or struggling with last-minute
                    arrangements, students can book a clean and peaceful room with us
                    in just a few clicks.
                  </div>
                )}
              </div>

              {/* Panel 3 */}
              <div className="border rounded-lg shadow w-full">
                <button
                  className={"w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-white rounded-t-lg bg-purple-600 hover:bg-purple-700"}
                  onClick={() => togglePanel("panel3")}
                >
                  Verified, Safe, Student-Friendly Rooms
                  <span>{openPanel === "panel3" ? "−" : "+"}</span>
                </button>
                {openPanel === "panel3" && (
                  <div className="p-4 text-gray-700 bg-purple-50">
                    Every room we list is verified, safe, and student-friendly. With
                    us, you don’t just get a place to sleep—you get a supportive
                    environment that values your preparation, time, and peace of mind.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">Dream Destination</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
           ipsum dolor sit amet consectetur adipisicing elit. Ea similique reprehenderit labore animi cumque beatae.
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
      </div> */}

      <div className='flex justify-center'>
        <div className='py-30 container'>
          <h1 className='text-4xl font-bold text-purple-700 text-center'>Facility we Provide</h1>
          <p className='text-center px-2 md:px-40 md:text-sm mt-4 md:mt-10'> We provide affordable, safe, and comfortable stays near exam centers with all essential facilities for students. Our services include clean and hygienic rooms, 24/7 water supply, and a peaceful environment for focused preparation. With quick booking, time-saving check-ins, and reliable shelter, we ensure students experience a stress-free and comfortable stay.</p>
          <div className='flex flex-wrap w-full justify-center mt-5 md:mt-15'>
            <div data-aos="zoom-in" data-aos-delay="900" className='h-[120px] md:h-[200px] w-[120px] md:w-[200px] flex flex-col items-center justify-center mr-4 mt-4 rounded-2xl bg-purple-400 hover:shadow-xl transition-shadow duration-300'>
              <Image width="94" height="94" src="https://img.icons8.com/3d-fluency/94/money-bag.png" alt="Affordable Price Icon" />
              <p className="text-xl font-bold text-white">Affordable Price</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="600" className='h-[120px] md:h-[200px] w-[120px] md:w-[200px] flex flex-col items-center justify-center mr-4 mt-4 rounded-2xl bg-purple-400 hover:shadow-xl transition-shadow duration-300'>
              <Image width="94" height="94" src="https://img.icons8.com/3d-fluency/94/sand-clock-1.png" alt="Time Saving Icon" />
              <p className="text-xl font-bold text-white">Time Saving</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="300" className='h-[120px] md:h-[200px] w-[120px] md:w-[200px] flex flex-col items-center justify-center mr-4 mt-4 rounded-2xl bg-purple-400 hover:shadow-xl transition-shadow duration-300'>
              <Image width="94" height="94" src="https://img.icons8.com/3d-fluency/94/bed.png" alt="Comfortable Stay Icon" />
              <p className="text-xl font-bold text-white">Comfortable Stay</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="600" className='h-[120px] md:h-[200px] w-[120px] md:w-[200px] flex flex-col items-center justify-center mr-4 mt-4 rounded-2xl bg-purple-400 hover:shadow-xl transition-shadow duration-300'>
              <Image width="94" height="94" src="https://img.icons8.com/3d-fluency/94/shower.png" alt="Shower Icon" />
              <p className="text-xl font-bold text-white">Shower</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="900" className='h-[120px] md:h-[200px] w-[120px] md:w-[200px] flex flex-col items-center justify-center mr-4 mt-4 rounded-2xl bg-purple-400 hover:shadow-xl transition-shadow duration-300'>
              <Image width="94" height="94" src="https://img.icons8.com/3d-fluency/94/real-estate.png" alt="Shelter Icon" />
              <p className="text-xl font-bold text-white">Shelter</p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>

  );
}
