import { Link } from "react-router"

export type DataLine =
    { id: string, email: string, status: 'New' | 'Done' | 'In Progress' }


export default function TableRow({ id, email, status }: DataLine) {

    return (
        <div className="flex gap-4">
            <div>
                <Link to={`/anamnesis/${id}`}>{id}</Link>
            </div>
            <div >
                {email}
            </div>
            <div>
                {status}
            </div>
        </div>
    )
}