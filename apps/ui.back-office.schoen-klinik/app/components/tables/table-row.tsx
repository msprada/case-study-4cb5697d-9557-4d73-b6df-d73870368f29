import { Link } from 'react-router';

export type DataLine = { id: string; mainMedicalDisorder: string; email: string; status: string };

export default function TableRow({ id, mainMedicalDisorder, email, status }: DataLine) {
  return (
    <div className="flex gap-4">
      <div>
        <Link to={`/anamnesis/${id}`}>{id}</Link>
      </div>
      <div>{mainMedicalDisorder}</div>
      <div>{email}</div>
      <div>{status}</div>
    </div>
  );
}
