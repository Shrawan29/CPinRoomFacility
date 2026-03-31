import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import logo from "../../assets/logo.png";

export default function FointsPage() {
  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Centre Point Logo" className="h-16 mb-2" />
          <h1 className="text-3xl font-bold text-yellow-500 mb-2 text-center">Foints Loyalty Program</h1>
          <p className="text-lg text-gray-700 text-center">Your Food Points by Centre Point Hospitality</p>
        </div>

        {/* What are Foints? */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">What are Foints?</h2>
          <p className="text-gray-800 mb-1">Foints are Food Points. It's a cashback loyalty program where you earn points on your food and beverage spends.</p>
          <p className="text-gray-800 font-bold">1 Foint = 1 Rupee</p>
        </section>

        {/* How it works */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">How does it work?</h2>
          <ul className="list-disc pl-6 text-gray-800">
            <li>You get <span className="font-bold">10% cashback</span> as Foints on every visit at any participating outlet.</li>
            <li>Cashback is <span className="font-bold">doubled on every 5th visit</span> at any outlet.</li>
            <li>You become eligible for <span className="font-bold">30% cashback</span> on your birthday and anniversary weeks.</li>
            <li>More visits = More cashback!</li>
          </ul>
        </section>

        {/* Where can I use Foints? */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Where can I use Foints?</h2>
          <p className="text-gray-800 mb-4">You can redeem your Foints at all participating restaurants and outlets:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-yellow-100 rounded p-2 flex items-center justify-center font-semibold">Meeting Point</div>
            <div className="bg-yellow-100 rounded p-2 flex items-center justify-center font-semibold">Freakk de Bistro</div>
            <div className="bg-yellow-100 rounded p-2 flex items-center justify-center font-semibold">Bougainvillea</div>
            <div className="bg-yellow-100 rounded p-2 flex items-center justify-center font-semibold">Pablo (Nagpur & Navi Mumbai)</div>
            <div className="bg-yellow-100 rounded p-2 flex items-center justify-center font-semibold">High Steaks (Pool Side)</div>
            <div className="bg-yellow-100 rounded p-2 flex items-center justify-center font-semibold">Core Spa • Salon • Gym</div>
            <div className="bg-yellow-100 rounded p-2 flex items-center justify-center font-semibold">Centre Point Navi Mumbai</div>
            <div className="bg-yellow-100 rounded p-2 flex items-center justify-center font-semibold">Micky's by CP Food</div>
            <div className="bg-yellow-100 rounded p-2 flex items-center justify-center font-semibold">Dali The Art Café</div>
            <div className="bg-yellow-100 rounded p-2 flex items-center justify-center font-semibold">Centre Point Nagpur</div>
          </div>
        </section>

        {/* Privileges */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-yellow-600 mb-2">Privileges & Benefits</h2>
          <ul className="list-disc pl-6 text-gray-800">
            <li>Preference in all our events, festivals, and offers</li>
            <li>Exclusive offers throughout the year</li>
            <li>Bonus Foints for referring new members</li>
          </ul>
        </section>

        {/* Quick Links */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Quick Links</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://l.reelo.io/DQbBj"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Check Your Points
            </a>
            <a
              href="https://l.reelo.io/xQTqO"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Register for Foints
            </a>
          </div>
        </section>

        {/* Contact Info */}
        <section className="mt-8 text-center text-gray-600 text-sm">
          <div>For more details, visit the <a href="https://centrepointnagpur.com/foints/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">official Foints page</a>.</div>
          <div className="mt-2">Contact: <a href="tel:+919266923456" className="text-blue-700">+91 9266923456</a> | <a href="tel:0712-6699000" className="text-blue-700">0712-6699000</a> | <a href="mailto:info.nagpur@cpgh.in" className="text-blue-700">info.nagpur@cpgh.in</a></div>
        </section>
      </div>
    </AdminLayout>
  );
}
