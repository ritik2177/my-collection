"use client"
import { Target, Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const teamMembers = [
  {
    name: 'Ritik Kumar',
    role: 'Founder & CEO',
    image: '/image/image3.jpg',
    bio: 'Alex started StudentStay with the vision of making it easier for students to find safe and affordable housing near their exam centres.',
  },
  {
    name: 'Lucie Chen',
    role: 'Head of Operations',
    image: '/image/image2.jpeg',
    bio: 'Maria ensures that every listing on our platform meets our high standards of quality and safety for our student users.',
  },
  {
    name: 'Aryan',
    role: 'Lead Developer',
    image: '/image/image4.jpg',
    bio: 'Sam is the brilliant mind behind our user-friendly platform, constantly working to improve the booking experience.',
  },
];

const AboutUsPage = () => {
  return (
    <div className="bg-white text-gray-800">
      <main className="container mx-auto px-6 py-24 pt-32">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-purple-800 mb-4">About StudentStay</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            We are dedicated to helping students find safe, convenient, and affordable short-term stays near their exam centres.
          </p>
        </section>

        {/* Our Mission Section */}
        <section className="mb-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-purple-800 mb-3">Our Mission</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our mission is to eliminate the stress of finding last-minute accommodation for exams. We provide a curated list of verified rooms, ensuring a peaceful and secure environment for students to focus on what matters most: their success.
            </p>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="mb-20 bg-purple-50 rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-purple-800 text-center mb-10">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-purple-200 p-4 rounded-full mb-4">
                <Target className="w-8 h-8 text-purple-700" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Student-Centric</h3>
              <p className="text-gray-600">Our platform is built around the needs of students. Every feature is designed to make your stay-finding process seamless.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-200 p-4 rounded-full mb-4">
                <Eye className="w-8 h-8 text-purple-700" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Trust & Safety</h3>
              <p className="text-gray-600">We verify every host and property to ensure your safety and peace of mind during your stay.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-200 p-4 rounded-full mb-4">
                <Heart className="w-8 h-8 text-purple-700" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Community</h3>
              <p className="text-gray-600">                 We are more than a service; we are a community of students and hosts supporting each other&apos;s academic journeys.</p>
            </div>
          </div>
        </section>

        {/* Meet Our Team Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-purple-800 text-center mb-10">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-gray-50 rounded-lg p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={100}
                  height={100}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-purple-800">{member.name}</h3>
                <p className="text-purple-600 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-purple-800 mb-4">Ready to Find Your Stay?</h2>
          <p className="text-gray-600 mb-8">Browse our listings to find the perfect room for your exam needs.</p>
          <Link href="/rooms">
            <span className="px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-800 to-pink-700 shadow-lg hover:opacity-90 transition cursor-pointer">
              Browse Rooms
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default AboutUsPage;