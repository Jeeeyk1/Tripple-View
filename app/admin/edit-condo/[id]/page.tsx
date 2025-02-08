import CondoForm from "../../../components/CondoForm"

export default function EditCondoPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Condo</h1>
      <CondoForm condoId={params.id} />
    </div>
  )
}

