import EditRole from "../../edit-role"

interface EditRolePageProps {
  params: {
    id: string
  }
}

export default function EditRolePage({ params }: EditRolePageProps) {
  return <EditRole roleId={params.id} />
} 