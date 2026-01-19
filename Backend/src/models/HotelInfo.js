import mongoose from "mongoose";

const hotelInfoSchema = new mongoose.Schema(
  {
    basicInfo: {
      name: {
        type: String,
        required: true
      },
      description: String,
      address: String,
      contactPhone: String,
      contactEmail: String
    },

    amenities: [
      {
        name: String,
        available: {
          type: Boolean,
          default: true
        }
      }
    ],

    services: [
      {
        name: String,
        description: String,
        available: {
          type: Boolean,
          default: true
        }
      }
    ],

    policies: [String],

    emergency: {
      frontDeskNumber: String,
      ambulanceNumber: String,
      fireSafetyInfo: String
    }
  },
  { timestamps: true }
);

const HotelInfo = mongoose.model("HotelInfo", hotelInfoSchema);
export default HotelInfo;
