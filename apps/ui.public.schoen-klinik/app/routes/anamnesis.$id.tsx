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



  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const email = formData.get("email");





  try {
    if (!process.env.API_RESSOURCE_ANAMNESIS_URL) {
      throw new Error("API_RESSOURCE_ANAMNESIS_URL is not defined");
    }

    const apiUrl = `${process.env.API_RESSOURCE_ANAMNESIS_URL}`;
    const payload = { title: title, content: content, email: email };
    const body = JSON.stringify(payload)

    const res = await fetch(apiUrl, {
      headers: {
        // Authorization: `Bearer ${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*',
        'Accept': 'application/json'
      },
      method: "POST",
      body: body,
    });

    const data = await res.json();
    console.log("Response from API:", data);

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
        <input type="text" name="title" value="Test Title FE New" />
        <input type="text" name="content" value="Content Test FE New" />
        <input type="email" name="email" value="email@email.de" />
        <button type="submit">Submit</button>
      </Form>
      {title ? (
        <p>{title} updated</p>
      ) : null}
    </div>) : <p>You are not allowed to see the document!</p>

  )
}