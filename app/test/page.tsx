"use client";

import React, { useState } from "react";

export default function CustomAccordion() {
  // First one opened by default
  const [openPanel, setOpenPanel] = useState<string | null>("panel1");

  const togglePanel = (panel: string) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pt-30">
      {/* Panel 1 */}
      <div className="border rounded-lg shadow">
        <button
          className={`w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-white rounded-t-lg ${
            openPanel === "panel1" ? "bg-purple-700" : "bg-purple-600 hover:bg-purple-700"
          }`}
          onClick={() => togglePanel("panel1")}
        >
          Stress-Free Stays for Exam Travelers
          <span>{openPanel === "panel1" ? "−" : "+"}</span>
        </button>
        {openPanel === "panel1" && (
          <div className="p-4 text-gray-700 bg-purple-50">
            We are a dedicated platform created especially for students who
            travel across cities to appear for competitive and university exams.
            We understand how stressful it can be to find a place to rest before
            an important test..
          </div>
        )}
      </div>

      {/* Panel 2 */}
      <div className="border rounded-lg shadow">
        <button
          className={`w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-white rounded-t-lg ${
            openPanel === "panel2" ? "bg-purple-700" : "bg-purple-600 hover:bg-purple-700"
          }`}
          onClick={() => togglePanel("panel2")}
        >
          Affordable, Comfortable Rooms Near Exams
          <span>{openPanel === "panel2" ? "−" : "+"}</span>
        </button>
        {openPanel === "panel2" && (
          <div className="p-4 text-gray-700 bg-purple-50">
            Our mission is simple: to provide affordable, short-term, and
            comfortable stays near exam centers so students can relax, refresh,
            and focus entirely on their performance. Instead of spending a lot
            on hotels or struggling with last-minute arrangements, students can
            book a clean and peaceful room with us in just a few clicks.
          </div>
        )}
      </div>

      {/* Panel 3 */}
      <div className="border rounded-lg shadow">
        <button
          className={`w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-white rounded-t-lg ${
            openPanel === "panel3" ? "bg-purple-700" : "bg-purple-600 hover:bg-purple-700"
          }`}
          onClick={() => togglePanel("panel3")}
        >
          Verified, Safe, Student-Friendly Rooms
          <span>{openPanel === "panel3" ? "−" : "+"}</span>
        </button>
        {openPanel === "panel3" && (
          <div className="p-4 text-gray-700 bg-purple-50">
            Every room we list is verified, safe, and student-friendly. With us,
            you don’t just get a place to sleep—you get a supportive environment
            that values your preparation, time, and peace of mind.
          </div>
        )}
      </div>
    </div>
  );
}
