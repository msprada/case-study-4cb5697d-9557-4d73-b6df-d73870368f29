
export type DataLine =
    { id: string, email: string, status: 'New' | 'Done' | 'In Progress' }


export default function TableRow({ id, email, status }: DataLine) {

    return (
        <div className="flex gap-4">
            <div>
                {id}
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