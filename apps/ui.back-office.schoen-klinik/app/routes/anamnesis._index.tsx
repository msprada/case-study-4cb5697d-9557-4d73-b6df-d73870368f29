

import type { Route } from "./+types/anamnesis._index";
import type { DataLine } from "~/components/tables/table-row";
import Table from "~/components/tables/table";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Anamnesebogen Übrsicht" },
    { name: "description", content: "Hier finden Sie die Übersicht der Anamnesebögen" },
  ];
}



const dummyData: DataLine[] = [

  {
    "id": "1",
    "email": "mail@test.de",
    "status": "New"
  },
  {
    "id": "2",
    "email": "mail@test3.de",
    "status": "In Progress"
  },
  {
    "id": "3",
    "email": "mail@test2.de",
    "status": "Done"
  }

];



export default function AnamnesisDocumentOverview() {

  return (
    <>

      <div className="flex flex-col mb-4">
        <h2>Übersicht der Anamnesebögen</h2>
        <p>Hier sehen Sie die Übersicht der Anmeldungen.</p>
      </div>

      <Table data={dummyData} />

    </>
  )
}

