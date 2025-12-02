import { AnamnesisForm } from "packages.ui-components/forms";
import type { Route } from "./+types/anamnesis.$id";

import "packages.ui-components/global.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Anamnesebogen" },
    { name: "description", content: "Hier können Sie den Bogen editieren!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;

  const apiUrl = `${process.env.API_RESSOURCE_GRAPHQL_URL}`;
  const payload = {
    query: `query {  anamnesisDocument(id:"${id}"){
    id
    mainMedicalDisorder
    email
  } }`,
  };
  const body = JSON.stringify(payload);

  const res = await fetch(apiUrl, {
    headers: {
      // Authorization: `Bearer ${process.env.API_TOKEN}`,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
    },
    method: "POST",
    body: body,
  });

  const data = await res.json();
  console.log("Response from API:", data);
  return { response: data };
}

export default function AnamnesisDetailPage({
  loaderData,
}: Route.ComponentProps) {
  const { response } = loaderData;
  const { data } = response;
  const { anamnesisDocument } = data;
  console.log({ anamnesisDocument });
  return (
    <>
      <div className="flex flex-col mb-4">
        <h1>Anamnese Bogen</h1>
        <p>Hier können Sie den Anamnesebogen editieren.</p>
      </div>
      <AnamnesisForm
        errors={undefined}
        formFieldValueSet={{ ...anamnesisDocument }}
      />
    </>
  );
}
