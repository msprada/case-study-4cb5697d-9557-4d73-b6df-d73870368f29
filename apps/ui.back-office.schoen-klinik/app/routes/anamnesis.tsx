

import type { Route } from "./+types/anamnesis";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Anamnesebogen Übrsicht" },
    { name: "description", content: "Hier finden Sie die Übersicht der Anamnesebögen" },
  ];
}



export default function AnamnesisDocumentOverview(){

    return (<h2>Übersicht der Anamnesebögen</h2>)
}

