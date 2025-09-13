//'use client'

// import { useState } from "react";


// export default function GetLocation() {
//   const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

//   const getLocation = () => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//       }, (error) => {
//         console.error("Location error:", error);
//       });
//     } else {
//       alert("Geolocation not supported");
//     }
//   };
//   return (
//     <div>
//       <button type="button" onClick={getLocation}>Use My Location</button>
//       <button type="submit">Submit</button>
//       <p>Latitude: {location.latitude}</p>
//       <p>Longitude: {location.longitude}</p>
//     </div>
//   );
// };

// "use client";
// import React, { useState } from "react";

// export default function ImageUploadBox() {
//   const [preview, setPreview] = useState<string | null>(null);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     const file = files && files[0];
//     if (file) {
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <label
//         htmlFor="imageUpload"
//         className="w-64 aspect-square border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden"
//       >
//         {preview ? (
//           <img
//             src={preview}
//             alt="Preview"
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <span className="text-gray-500">Click to upload</span>
//         )}
//       </label>

//       <input
//         type="file"
//         id="imageUpload"
//         accept="image/*"
//         onChange={handleImageChange}
//         className="hidden"
//       />
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import CountUp from "react-countup";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-indigo-600">MyCompany</h1>
          <ul className="flex gap-6 text-gray-700 font-medium">
            <li><Link href="#hero">Home</Link></li>
            <li><Link href="#about">About</Link></li>
            <li><Link href="#stats">Stats</Link></li>
            <li><Link href="#features">Features</Link></li>
            <li><Link href="#services">Services</Link></li>
            <li><Link href="#portfolio">Portfolio</Link></li>
            <li><Link href="#testimonials">Testimonials</Link></li>
            <li><Link href="#team">Team</Link></li>
            <li><Link href="#pricing">Pricing</Link></li>
            <li><Link href="#faq">FAQ</Link></li>
            <li><Link href="#blog">Blog</Link></li>
            <li><Link href="#contact">Contact</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center px-6"
      >
        <h1 data-aos="fade-up" className="text-6xl font-extrabold">
          Building the Future with Next.js ⚡
        </h1>
        <p data-aos="fade-up" data-aos-delay="300" className="mt-6 text-xl max-w-2xl">
          High-performing websites and apps with beautiful design and smooth animations.
        </p>
        <button
          data-aos="zoom-in"
          data-aos-delay="600"
          className="mt-8 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:scale-105 hover:shadow-xl transition"
        >
          Get Started
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-50 text-center">
        <h2 data-aos="fade-up" className="text-4xl font-bold text-gray-800">About Us</h2>
        <p data-aos="fade-up" data-aos-delay="200" className="mt-4 max-w-3xl mx-auto text-gray-600">
          We are a team of passionate developers and designers creating scalable, reliable, and secure digital solutions.
        </p>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 bg-white text-center">
        <h2 data-aos="fade-up" className="text-4xl font-bold text-gray-800">Our Achievements</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { num: 150, label: "Projects Completed" },
            { num: 90, label: "Happy Clients" },
            { num: 10, label: "Years Experience" },
            { num: 24, label: "Customer Support/7" },
          ].map((stat, i) => (
            <div
              key={i}
              data-aos="zoom-in"
              data-aos-delay={i * 200}
              className="p-6 bg-gray-100 rounded-lg shadow hover:scale-105 hover:shadow-lg transition"
            >
              <h3 className="text-5xl font-bold text-indigo-600">
                <CountUp end={stat.num} duration={3} />+
              </h3>
              <p className="mt-2 text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 text-center">
        <h2 data-aos="fade-up" className="text-4xl font-bold text-gray-800">Why Choose Us</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {[
            { icon: "⚡", title: "Fast Performance", desc: "Optimized for speed and reliability." },
            { icon: "📱", title: "Responsive", desc: "Looks perfect on every device." },
            { icon: "🔒", title: "Secure", desc: "Best practices to keep your data safe." },
          ].map((f, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 200}
              className="p-6 bg-white rounded-xl shadow hover:shadow-xl hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold">{f.icon} {f.title}</h3>
              <p className="mt-2 text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- New Extra Sections --- */}

      {/* Case Studies */}
      <section id="case-studies" className="py-24 bg-white text-center">
        <h2 data-aos="fade-up" className="text-4xl font-bold text-gray-800">Case Studies</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6">
          <div data-aos="fade-right" className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg hover:scale-105 transition">
            <h3 className="text-2xl font-bold">E-commerce Growth</h3>
            <p className="mt-2 text-gray-600">Boosted sales 200% for a leading fashion brand with custom Next.js solution.</p>
          </div>
          <div data-aos="fade-left" className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg hover:scale-105 transition">
            <h3 className="text-2xl font-bold">Startup Success</h3>
            <p className="mt-2 text-gray-600">Scaled a SaaS platform to 1M users with optimized architecture.</p>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="py-24 bg-gray-50 text-center">
        <h2 data-aos="fade-up" className="text-4xl font-bold text-gray-800">Join Our Team</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          We're hiring talented developers, designers, and marketers. Build your career with us.
        </p>
        <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:scale-105 transition">
          View Openings
        </button>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-24 bg-indigo-600 text-white text-center">
        <h2 data-aos="fade-up" className="text-4xl font-bold">Stay Updated</h2>
        <p className="mt-2">Subscribe to get our latest news and offers</p>
        <form data-aos="zoom-in" className="mt-6 flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto">
          <input type="email" placeholder="Enter your email" className="p-3 rounded-lg text-gray-800 w-full" />
          <button className="px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-700 hover:scale-105 transition">
            Subscribe
          </button>
        </form>
      </section>

      {/* Partners/Logos Section */}
      <section id="partners" className="py-24 bg-gray-50 text-center">
        <h2 data-aos="fade-up" className="text-4xl font-bold text-gray-800">Trusted By</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-12">
          {["Google", "Amazon", "Netflix", "Microsoft"].map((brand, i) => (
            <div
              key={i}
              data-aos="zoom-in"
              data-aos-delay={i * 200}
              className="text-2xl font-bold text-gray-500 hover:scale-110 transition"
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-24 bg-white text-center">
        <h2 data-aos="fade-up" className="text-4xl font-bold text-gray-800">Our Partners</h2>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto px-6">
          {["Google", "Microsoft", "Amazon", "Netflix", "Spotify"].map((brand, i) => (
            <div
              key={i}
              data-aos="zoom-in"
              data-aos-delay={i * 100}
              className="p-6 bg-gray-50 rounded-lg shadow hover:scale-105 transition"
            >
              <img src={`https://logo.clearbit.com/${brand.toLowerCase()}.com`} alt={brand} className="mx-auto h-12" />
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-24 bg-indigo-600 text-center text-white">
        <h2 data-aos="fade-up" className="text-4xl font-bold">📬 Stay Updated</h2>
        <p data-aos="fade-up" data-aos-delay="200" className="mt-4">Join our newsletter to receive the latest updates.</p>
        <form data-aos="fade-up" data-aos-delay="400" className="mt-8 flex justify-center gap-4 max-w-xl mx-auto">
          <input type="email" placeholder="Enter your email" className="p-3 rounded-lg w-2/3 text-black" />
          <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition">
            Subscribe
          </button>
        </form>
      </section>

      {/* Call to Action */}
      <section id="cta" className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-center text-white">
        <h2 data-aos="fade-up" className="text-4xl font-bold">🚀 Ready to Start Your Project?</h2>
        <p data-aos="fade-up" data-aos-delay="200" className="mt-4">Let’s build something amazing together.</p>
        <button
          data-aos="zoom-in"
          data-aos-delay="400"
          className="mt-8 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow hover:scale-110 transition"
        >
          Contact Us Now
        </button>
      </section>


      {/* Footer */}
      <footer className="bg-indigo-600 text-white text-center py-6">
        <p>&copy; {new Date().getFullYear()} MyCompany. All rights reserved.</p>
      </footer>
    </main>
  );
}
