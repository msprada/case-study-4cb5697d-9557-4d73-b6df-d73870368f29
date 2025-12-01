import type { Route } from "./+types/anamnesis.$id";
import { data, Form, Link } from "react-router";
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

  const errors = {} as { firstname?: string, lastname?: string, address?: string, mainMedicalDisorder?: string };
  const formData = await request.formData();
  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const address = formData.get("address");
  const mainMedicalDisorder = formData.get("mainMedicalDisorder");
  const furtherMedicalDisorder = formData.get("furtherMedicalDisorder");


  if (!firstname) {
    errors.firstname = "Bitte geben Sie ein ihren Vornamen an.";
  }

  if (!lastname) {
    errors.lastname = "Bitte geben Sie ein ihren Nachnamen an.";
  }

  if (!address) {
    errors.address = "Bitte geben Sie ein ihre Adresse an.";
  }

  if (!mainMedicalDisorder) {
    errors.mainMedicalDisorder = "Bitte geben Sie ein ihre Hauptbeschwerde an.";
  }


  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }


  try {
    if (!process.env.API_RESSOURCE_ANAMNESIS_URL) {
      throw new Error("API_RESSOURCE_ANAMNESIS_URL is not defined");
    }

    const apiUrl = `${process.env.API_RESSOURCE_ANAMNESIS_URL}`;
    const payload = { firstname: firstname, lastname: lastname, address: address, mainMedicalDisorder: mainMedicalDisorder, furtherMedicalDisorder: furtherMedicalDisorder };
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

    return { submitted: true };
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

  let submitted, errors;

  if (actionData && typeof actionData === "object" && 'errors' in actionData) {
    errors = actionData.errors;
  }

  if (actionData && typeof actionData === "object" && 'submitted' in actionData) {
    submitted = actionData.submitted;
  }

  return (

    (tempLink && typeof tempLink === 'object' && 'id' in tempLink && tempLink.id) ? (<div>

      <div className="flex flex-col mb-4">
        <h1>Anamnese Bogen</h1>
        <p>Bitte füllen Sie Anamnesebogen aus und best&auml;tigen Sie im Anschluss die Schaltfläche.</p>
      </div>
      <Form method="post">
        <legend className="mb-4"><i>Registrierungsformular</i></legend>
        <fieldset>
          <div className="flex flex-row justify-end gap-2 mb-4">
            <label htmlFor="firstname">
              Vorname:
            </label>
            <input className="border-2 boder-solid" aria-required type="text" name="firstname" id="firstname" />
          </div>
          <div className="flex flex-row justify-end gap-2 mb-4">
            <span><strong>{errors?.firstname ? <p style={{ color: "red" }}>{errors.firstname}</p> : null}</strong></span>
          </div>

          <div className="flex flex-row justify-end gap-2 mb-4">
            <label htmlFor="lastname">
              Nachname:
            </label>
            <input className="border-2 boder-solid" aria-required type="text" name="lastname" id="lastname" />
          </div>
          <div className="flex flex-row justify-end gap-2 mb-4">
            <span><strong>{errors?.lastname ? <p style={{ color: "red" }}>{errors.lastname}</p> : null}</strong></span>
          </div>

          <div className="flex flex-row justify-end gap-2 mb-4">
            <label htmlFor="address">
              Adresse:
            </label>
            <input className="border-2 boder-solid" aria-required type="text" name="address" id="address" />
          </div>
          <div className="flex flex-row justify-end gap-2 mb-4">
            <span><strong>{errors?.address ? <p style={{ color: "red" }}>{errors.address}</p> : null}</strong></span>
          </div>

          <div className="flex flex-row justify-end gap-2 mb-4">
            <label htmlFor="mainMedicalDisorder">
              Hauptbeschwerde:
            </label>
            <input className="border-2 boder-solid" aria-required type="text" name="mainMedicalDisorder" id="mainMedicalDisorder" />
          </div>
          <div className="flex flex-row justify-end gap-2 mb-4">
            <span><strong>{errors?.mainMedicalDisorder ? <p style={{ color: "red" }}>{errors.mainMedicalDisorder}</p> : null}</strong></span>
          </div>

          <div className="flex flex-row justify-end gap-2 mb-4">
            <label htmlFor="furtherMedicalDisorder">
              Weitere Beschwerden:
            </label>
            <input className="border-2 boder-solid" type="text" name="furtherMedicalDisorder" id="furtherMedicalDisorder" />
          </div>

        </fieldset>
        <div className="flex flex-row justify-end gap-2 mb-4">
          <button className="btn text-white bg-orange-500 rounded-full w-64" type="submit">Absenden</button>
        </div>
      </Form>
      {submitted ? (
        <p>wurde erfolgreich versendet!</p>
      ) : null}
    </div>) : <p>Sie haben keine gültige Anmeldung und können den Anmeldebogen nicht aufrufen. Bitte erstellen Sie in Login. <Link to={{ pathname: "/sign-in", }}>hier geht es zu Anmeldung</Link></p>

  )
}