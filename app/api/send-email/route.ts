import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, text } = await req.json() as {
      to: string;
      subject: string;
      text: string;
    };

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}




// export default function HomePage() {
//   return (
//     <main className="overflow-x-hidden">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 text-center">
//         <h1 className="text-4xl font-bold mb-4">Affordable Rooms for Students Before Exams</h1>
//         <p className="text-lg mb-6 max-w-2xl mx-auto">
//           Find safe, clean, and budget-friendly rooms near your exam centers to relax and refresh.
//         </p>
//         <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:bg-gray-100 transition">
//           Check Rooms
//         </button>
//       </section>

//       {/* Who We Are */}
//       <section className="py-16 px-6 text-center max-w-4xl mx-auto">
//         <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
//         <p className="text-gray-600 mb-4">
//           We are a dedicated platform created especially for students who travel across cities to appear for competitive and
//           university exams. We understand how stressful it can be to find a place to rest before an important test.
//         </p>
//         <p className="text-gray-600 mb-4">
//           Our mission is simple: to provide affordable, short-term, and comfortable stays near exam centers so students can
//           relax, refresh, and focus entirely on their performance. Instead of spending a lot on hotels or struggling with last-minute
//           arrangements, students can book a clean and peaceful room with us in just a few clicks.
//         </p>
//         <p className="text-gray-600">
//           Every room we list is verified, safe, and student-friendly. With us, you don’t just get a place to sleep—you get a
//           supportive environment that values your preparation, time, and peace of mind.
//         </p>
//       </section>

//       {/* Why Choose Us */}
//       <section className="py-16 bg-gray-50 px-6">
//         <h2 className="text-2xl font-bold text-center mb-10">Why Choose Us?</h2>
//         <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
//           <div className="p-6 bg-white rounded-2xl shadow-md text-center">
//             <span className="text-4xl">🏫</span>
//             <h3 className="font-semibold mt-3">Near Exam Centers</h3>
//           </div>
//           <div className="p-6 bg-white rounded-2xl shadow-md text-center">
//             <span className="text-4xl">💸</span>
//             <h3 className="font-semibold mt-3">Pocket-Friendly</h3>
//           </div>
//           <div className="p-6 bg-white rounded-2xl shadow-md text-center">
//             <span className="text-4xl">📖</span>
//             <h3 className="font-semibold mt-3">Peaceful for Revision</h3>
//           </div>
//           <div className="p-6 bg-white rounded-2xl shadow-md text-center">
//             <span className="text-4xl">🛡️</span>
//             <h3 className="font-semibold mt-3">Safe & Hygienic</h3>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="py-16 px-6 text-center">
//         <h2 className="text-2xl font-bold mb-10">How It Works</h2>
//         <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
//           <div className="bg-blue-50 p-6 rounded-2xl">
//             <h3 className="font-semibold mb-2">1. Search Exam City</h3>
//             <p className="text-gray-600">Enter the city where your exam is located.</p>
//           </div>
//           <div className="bg-blue-50 p-6 rounded-2xl">
//             <h3 className="font-semibold mb-2">2. Pick Nearby Room</h3>
//             <p className="text-gray-600">Choose from affordable rooms near your exam center.</p>
//           </div>
//           <div className="bg-blue-50 p-6 rounded-2xl">
//             <h3 className="font-semibold mb-2">3. Book Instantly</h3>
//             <p className="text-gray-600">Quick and easy booking process.</p>
//           </div>
//           <div className="bg-blue-50 p-6 rounded-2xl">
//             <h3 className="font-semibold mb-2">4. Stay & Refresh</h3>
//             <p className="text-gray-600">Relax before your exam and perform your best.</p>
//           </div>
//         </div>
//       </section>

//       {/* Sample Rooms */}
//       <section className="py-16 bg-gray-50 px-6">
//         <h2 className="text-2xl font-bold text-center mb-10">Available Near Exam Hubs</h2>
//         <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
//           <div className="bg-white shadow-md rounded-2xl overflow-hidden">
//             <img src="https://via.placeholder.com/400x200" alt="Room Patna" className="w-full" />
//             <div className="p-4">
//               <h3 className="font-semibold">Patna - Near RRB Exam Center</h3>
//               <p className="text-gray-600">₹500/day • 500m from exam hall</p>
//             </div>
//           </div>
//           <div className="bg-white shadow-md rounded-2xl overflow-hidden">
//             <img src="https://via.placeholder.com/400x200" alt="Room Delhi" className="w-full" />
//             <div className="p-4">
//               <h3 className="font-semibold">Delhi - Near SSC Exam Center</h3>
//               <p className="text-gray-600">₹600/day • 1km from metro</p>
//             </div>
//           </div>
//           <div className="bg-white shadow-md rounded-2xl overflow-hidden">
//             <img src="https://via.placeholder.com/400x200" alt="Room Lucknow" className="w-full" />
//             <div className="p-4">
//               <h3 className="font-semibold">Lucknow - Near UPSC Hall</h3>
//               <p className="text-gray-600">₹450/day • Walking distance</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-16 px-6 text-center max-w-4xl mx-auto">
//         <h2 className="text-2xl font-bold mb-8">Student Reviews</h2>
//         <div className="space-y-6">
//           <blockquote className="bg-gray-50 p-6 rounded-2xl shadow-md">
//             <p className="text-gray-700">“Stayed near Patna exam center, room was clean & budget-friendly. Helped me relax before exam!”</p>
//             <footer className="text-gray-500 mt-2">— Ankit, Patna</footer>
//           </blockquote>
//           <blockquote className="bg-gray-50 p-6 rounded-2xl shadow-md">
//             <p className="text-gray-700">“Easier than searching last-minute hotels. Very affordable and peaceful.”</p>
//             <footer className="text-gray-500 mt-2">— Priya, Delhi</footer>
//           </blockquote>
//         </div>
//       </section>

//       {/* Contact */}
//       <section className="py-16 bg-blue-700 text-white text-center">
//         <h2 className="text-2xl font-bold mb-4">Need Help Booking?</h2>
//         <p className="mb-6">Call us or WhatsApp for instant support.</p>
//         <p className="text-lg font-semibold">📞 +91-98765-43210</p>
//         <p className="text-lg">✉️ support@examstay.com</p>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-6 text-center text-sm">
//         <p>© 2025 ExamStay. All Rights Reserved.</p>
//         <p className="mt-2">About | FAQ | Privacy Policy | Terms</p>
//       </footer>
//     </main>
//   );
// }
