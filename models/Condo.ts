import mongoose from "mongoose";

const CondoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  images: { type: Array, required: false },
  amenities: [{ type: String }],
  isAvailable: { type: Boolean, required: true },
  location: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.models.Condo || mongoose.model("Condo", CondoSchema);
