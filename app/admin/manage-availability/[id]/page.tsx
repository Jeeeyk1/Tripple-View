import AvailabilityCalendar from "../../../components/AvailabilityCalendar"

// This is a mock function to fetch initial available dates
// In a real application, you would fetch this data from your backend
const fetchAvailableDates = async (id: string): Promise<Date[]> => {
  // Simulating an API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate some random dates for the next 30 days
  const dates = []
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    if (Math.random() > 0.5) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
  }
  return dates
}

export default async function ManageAvailabilityPage({ params }: { params: { id: string } }) {
  const availableDates = await fetchAvailableDates(params.id)

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Availability</h1>
      <AvailabilityCalendar condoId={params.id} initialAvailableDates={availableDates} />
    </div>
  )
}

