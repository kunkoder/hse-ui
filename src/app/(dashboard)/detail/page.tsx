import { ComplaintForm } from './components/complaint-form'
import { dummyComplaint } from './data/complaint-data'

export default function ComplaintPage() {
  // const handleSave = (data: any) => {
  //   console.log('Saving complaint:', data)
  //   // API call here
  // }

  // const handleDelete = (id: string) => {
  //   console.log('Deleting complaint:', id)
  //   // API call here
  // }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Complaint Management</h1>
      <ComplaintForm 
        initialData={dummyComplaint}
        // onSave={handleSave}
        // onDelete={handleDelete}
      />
    </div>
  )
}