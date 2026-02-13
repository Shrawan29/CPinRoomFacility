import { useState, useEffect } from "react";
import QRCodeGenerator from "../../components/guest/QRCodeGenerator";
import api from "../../services/api";

export default function QRCodeManager() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [baseURL, setBaseURL] = useState("https://cpinroomfacility-production.up.railway.app");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/admin/dashboard/rooms");
        const list = Array.isArray(res.data) ? res.data : [];
        const normalized = list
          .map((r) => String(r?.roomNumber ?? "").trim())
          .filter(Boolean)
          .sort((a, b) => Number(a) - Number(b));

        setRooms(normalized);
        setSelectedRoom((prev) => prev ?? normalized[0] ?? null);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load rooms");
        setRooms([]);
        setSelectedRoom(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
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

            {loading ? (
              <div className="text-sm text-gray-600">Loading rooms…</div>
            ) : error ? (
              <div className="text-sm text-red-600">{error}</div>
            ) : rooms.length === 0 ? (
              <div className="text-sm text-gray-600">No rooms found</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {rooms.map((roomNumber) => (
                  <button
                    key={roomNumber}
                    onClick={() => setSelectedRoom(roomNumber)}
                    className={`w-full px-4 py-2 rounded-lg font-semibold transition text-left ${
                      String(selectedRoom) === String(roomNumber)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Room #{roomNumber}
                  </button>
                ))}
              </div>
            )}
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
