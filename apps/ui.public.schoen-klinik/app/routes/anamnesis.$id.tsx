import type { Route } from "./+types/anamnesis.$id";
import { data, Form } from "react-router";
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
    where: {
      id: { equals: id }
    }
  })

  return { tempLink: tempLink }
}

export async function action({
  request,
}: Route.ActionArgs) {



  let formData = await request.formData();
  let title = formData.get("title");


  const apiUrl = `${process.env.API_URL}/anamnesis`;

  try {
    if (!process.env.API_RESSOURCE_ANAMNESIS_URL) {
      throw new Error("API_RESSOURCE_ANAMNESIS_URL is not defined");
    }

    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
      method: "POST",
      body: JSON.stringify({ title }),
    });

    const data = await res.json();

    return { title: title ? title.toString() : "fallback" };
  }

  catch (error) {
    console.error("Error creating anamnesis:", error);
    return data({ error }, { status: 400 })
  }


}

export default function Anamnesis({
  actionData, loaderData
}: Route.ComponentProps) {

  const { tempLink } = loaderData;

  let title;

  if (actionData && typeof actionData === "object" && 'title' in actionData) {
    title = actionData.title;
  }

  return (

    (tempLink && typeof tempLink === 'object' && 'id' in tempLink && tempLink.id) ? (<div>
      <h1>Anamnese Bogen</h1>
      <Form method="post">
        <input type="text" name="title" />
        <button type="submit">Submit</button>
      </Form>
      {title ? (
        <p>{title} updated</p>
      ) : null}
    </div>) : <p>You are not allowed to see the document!</p>

  )
}