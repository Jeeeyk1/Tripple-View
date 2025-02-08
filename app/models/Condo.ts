import mongoose from "mongoose"

const CondoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  amenities: [{ type: String }],
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
})

export default mongoose.models.Condo || mongoose.model("Condo", CondoSchema)

