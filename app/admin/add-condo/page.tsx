import NewCondoForm from "@/app/components/NewCondoForm"
import CondoForm from "../../components/CondoForm"

export default function AddCondoPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Condo</h1>
      <NewCondoForm />
    </div>
  )
}

