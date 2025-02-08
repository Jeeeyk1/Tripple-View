import mongoose from "mongoose";

export enum ReservationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  DECLINED = "declined",
}

const ReservationSchema = new mongoose.Schema({
  condoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Condo",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  guestName: { type: String, required: true },
  email: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(ReservationStatus),
    default: ReservationStatus.PENDING,
  },
});

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);
