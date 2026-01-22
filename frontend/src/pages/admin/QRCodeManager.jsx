import { useState, useEffect } from "react";
import QRCodeGenerator from "../../components/guest/QRCodeGenerator";

export default function QRCodeManager() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [baseURL, setBaseURL] = useState("https://cpinroomfacility-production.up.railway.app");

  useEffect(() => {
    // In production, fetch rooms from backend
    // For now, generate sample room numbers
    const sampleRooms = Array.from({ length: 50 }, (_, i) => ({
      number: 101 + i,
    }));
    setRooms(sampleRooms);
    setSelectedRoom(sampleRooms[0].number);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">QR Code Manager</h1>
          <p className="text-gray-600">Generate and print QR codes for each room</p>
        </div>

        {/* CONFIG */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Base URL for Guest Portal
          </label>
          <input
            type="url"
            value={baseURL}
            onChange={(e) => setBaseURL(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="https://yourhotel.com"
          />
          <p className="text-xs text-gray-500 mt-2">
            This URL will be used in the QR codes. Update for production.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ROOM LIST */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Rooms</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {rooms.map((room) => (
                <button
                  key={room.number}
                  onClick={() => setSelectedRoom(room.number)}
                  className={`w-full px-4 py-2 rounded-lg font-semibold transition text-left ${
                    selectedRoom === room.number
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Room #{room.number}
                </button>
              ))}
            </div>
          </div>

          {/* QR CODE DISPLAY */}
          <div className="lg:col-span-3">
            {selectedRoom && (
              <QRCodeGenerator 
                roomNumber={selectedRoom} 
                baseURL={baseURL}
              />
            )}
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">📋 Instructions</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>✓ Select a room from the list</li>
            <li>✓ Download or print the QR code</li>
            <li>✓ Place the QR code in the room (wall, table, etc.)</li>
            <li>✓ Guests can scan it with Google Lens to access room service</li>
            <li>✓ The QR code contains the guest login URL with room information</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
