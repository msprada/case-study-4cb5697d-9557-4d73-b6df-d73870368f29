import type { Route } from "./+types/anamnesis";
import { Form } from "react-router";
import prisma from "../utils/prisma.server";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Anamnesis Request" },
    { name: "description", content: "Please fill in the request" },
  ];
}


export async function loader({ params }: Route.LoaderArgs) {
  const id = params.id;

  if (!id) {
    return { tempLink: null }
  }
  const tempLink = await prisma.tempLink.findFirst({
    where:{
      id: {equals: id}
    }
  })

  return { tempLink: tempLink }
}

export async function action({
  request,
}: Route.ActionArgs) {
  let formData = await request.formData();
  let title = formData.get("title");
  return { title: title ? title.toString() : "fallback" };
}

export default function Anamnesis({
  actionData, loaderData
}: Route.ComponentProps) {

  const { tempLink } = loaderData;

  return (

    (tempLink && typeof tempLink ==='object' && 'id' in tempLink && tempLink.id) ? (<div>
      <h1>Anamnese Bogen</h1>
      <Form method="post">
        <input type="text" name="title" />
        <button type="submit">Submit</button>
      </Form>
      {actionData ? (
        <p>{actionData.title} updated</p>
      ) : null}
    </div>) : <p>You are not allowed to see the document!</p>

  )
}