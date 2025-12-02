import { Link } from "react-router"

export type DataLine =
    { id: string,mainMedicalDisorder:string, email:string}


export default function TableRow({ id, mainMedicalDisorder, email}: DataLine) {

    return (
        <div className="flex gap-4">
            <div>
                <Link to={`/anamnesis/${id}`}>{id}</Link>
            </div>
            <div>
                {mainMedicalDisorder}
            </div>
                <div>
                {email}
            </div>
        </div>
    )
}