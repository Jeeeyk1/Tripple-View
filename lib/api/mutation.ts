import axios from "axios";

export const approveOrDeclineReservation = async ({
  id,
  action,
}: {
  id: string;
  action: "accept" | "decline";
}) => {
  const response = await axios.put(`/api/reservation/${id}`, { action });
  return response.data;
};
