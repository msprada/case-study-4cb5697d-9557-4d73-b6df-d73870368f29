import type {Route} from "./+types/anamnesis";
import { Form } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Anamnesis Request" },
    { name: "description", content: "Please fill in the request" },
  ];
}
//https://reactrouter.com/start/framework/actions
export default function Anamnesis() {
    return (
        <div>
            <h1>Anamnese Bogen</h1>
            <Form method="post">

            </Form>
        </div>>
    )
}