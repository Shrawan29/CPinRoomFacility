import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Simple fallback page for guests who don't have access to QR scanner
 * They can manually enter their room number and get a QR token from staff
 */
export default function GuestAccessFallback() {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState("");
  const [qrToken, setQrToken] = useState("");
  const [step, setStep] = useState("room"); // room, token

  const handleProceed = (e) => {
    e.preventDefault();

    if (step === "room" && !roomNumber) {
      alert("Please enter your room number");
      return;
    }

    if (step === "token" && !qrToken) {
      alert("Please enter the QR token provided by reception");
      return;
    }

    if (step === "token") {
      // Redirect to login with parameters
      navigate(`/guest/login?token=${qrToken}&room=${roomNumber}`);
    } else {
      setStep("token");
    }
  };

  const goBack = () => {
    if (step === "token") {
      setStep("room");
      setQrToken("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          🏨 Room Service Access
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          Don't have access to QR scanner?
        </p>

        <form onSubmit={handleProceed} className="space-y-4">
          {/* STEP 1: ROOM NUMBER */}
          {step === "room" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number
              </label>
              <input
                type="number"
                placeholder="101"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter your room number as shown on your room key
              </p>
            </div>
          )}

          {/* STEP 2: QR TOKEN */}
          {step === "token" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Token
              </label>
              <input
                type="text"
                placeholder="Ask at reception desk"
                value={qrToken}
                onChange={(e) => setQrToken(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                Ask the reception staff for the QR token for room {roomNumber}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {step === "room" ? "Next" : "Access Room Service"}
          </button>

          {step === "token" && (
            <button
              type="button"
              onClick={goBack}
              className="w-full text-blue-600 hover:text-blue-700 font-medium py-2"
            >
              ← Back
            </button>
          )}
        </form>

        {/* OR DIVIDER */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <p className="text-gray-500 text-sm">OR</p>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* QR SCANNER LINK */}
        <a
          href="/guest/login"
          className="block w-full text-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition"
        >
          📱 Scan QR Code
        </a>

        <p className="text-center text-gray-500 text-xs mt-6">
          Problems? Contact reception at ext. 0
        </p>
      </div>
    </div>
  );
}
