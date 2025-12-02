

import type { Route } from "./+types/anamnesis._index";
import type { DataLine } from "~/components/tables/table-row";
import Table from "~/components/tables/table";
import { data } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Anamnesebogen Übrsicht" },
    { name: "description", content: "Hier finden Sie die Übersicht der Anamnesebögen" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {

 const apiUrl = `${process.env.API_RESSOURCE_GRAPHQL_URL}`;
   const payload = {"query": `query {  anamnesisDocuments{id mainMedicalDisorder email} }` }
    const body = JSON.stringify(payload)

    const res = await fetch(apiUrl, {
      headers: {
        // Authorization: `Bearer ${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json'
      },
      method: "POST",
      body: body,
    });

    const data = await res.json();
    console.log("Response from API:", data);


  return { response: data }
}


export default function AnamnesisDocumentOverview({
  loaderData
}: Route.ComponentProps) {

  const {response} = loaderData
  const {data} = response;
  const {anamnesisDocuments}  = data;
  
  const value= anamnesisDocuments as DataLine[];

  return (
    <>

      <div className="flex flex-col mb-4">
        <h2>Übersicht der Anamnesebögen</h2>
        <p>Hier sehen Sie die Übersicht der Anmeldungen.</p>
      </div>

      <Table data={value} />

    </>
  )
}

