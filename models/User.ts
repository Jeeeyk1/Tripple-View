import mongoose from "mongoose"

 enum UserType {
  USER = "USER",
  HOST = "HOST",
  ADMIN = "ADMIN",
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: Object.values(UserType), default: UserType.USER },
})

export default mongoose.models.User || mongoose.model("User", UserSchema)

