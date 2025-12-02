import { AnamnesisForm } from "packages.ui-components/forms";
import type { Route } from "./+types/anamnesis.$id";

import 'packages.ui-components/global.css'

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Anamnesebogen" },
        { name: "description", content: "Hier können Sie den Bogen editieren!" },
    ];
}

export default function AnamnesisDetailPage() {

    return (
        <>
            <div className="flex flex-col mb-4">
                <h1>Anamnese Bogen</h1>
                <p>Hier können Sie den Anamnesebogen editieren.</p>
            </div>
            <AnamnesisForm errors={undefined} />
          
        </>


    )
}