import { Form, data } from "react-router";
import type { Route } from "./+types/sign-in";
import prisma from "../utils/prisma.server";


function generateToken(email: string) {
    const guid = crypto.randomUUID();
    return `${email}-${guid}`;
}


function genereateTempLink(token: string, url: URL) {
    return `${url.protocol}//${url.host}/anamnesis/${encodeURIComponent(token)}`;
}

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Anmeldung" },
        { name: "description", content: "Bitte geben Sie eine gültige E-Mailadresse ein" },
    ];
}

export async function action({
    request,
}: Route.ActionArgs) {
    const formData = await request.formData();
    const email = String(formData.get("email"));
    const url = new URL(request.url);

    const errors = {} as { email?: string };

    if (!email.includes("@")) {
        errors.email = "Bitte geben Sie ein gültige E-Mailadresse an.";
    }

    if (Object.keys(errors).length > 0) {
        return data({ errors }, { status: 400 });
    }

    const token = generateToken(email);
    const tempLink = genereateTempLink(token, url);



    const tempLinks = await prisma.tempLink.create({
        data: {
            id: token,
            email: email,
            tempLink: tempLink
        }
    });



    console.log(`Generated temp link for ${email}: ${tempLink}`);

    return { tempLink: tempLink, email: email };
}

export default function SignIn({ actionData }: Route.ComponentProps) {

    let errors, tempLink, email;

    if (actionData && typeof actionData === "object" && 'errors' in actionData) {
        errors = actionData.errors;
    }

    if (actionData && typeof actionData === "object" && 'tempLink' in actionData) {
        tempLink = actionData.tempLink;
    }

    if (actionData && typeof actionData === "object" && 'email' in actionData) {
        email = actionData.email;
    }

    return (<div className="flex flex-col">

        {!tempLink ? (<>

            <div className="flex flex-col mb-4">
                <h1>Anmeldung</h1>
                <p>Bitte geben Sie eine E-Mailadresse ein und best&auml;tigen Sie die Schaltfläche.</p>
                <p>Nach dem Absenden des Formulars wird Ihnen eine E-Mail zugesendet mit einem Link.</p>
                <p>Diesen nutzen Sie dann um den Anamnesbogen aufzurufen.</p>
                <p>Im Anschluss können Sie diesen dann ausfüllen.</p>
            </div>
            <Form method="post">
                <legend className="mb-4"><i>Registrierungsformular</i></legend>
                <fieldset>
                    <div className="flex flex-row gap-2 mb-4">
                        <label htmlFor="email">
                            E-Mailadresse:
                        </label>
                        <input className="border-2 boder-solid" aria-required type="text" name="email" id="email" />
                        <span><strong>{errors?.email ? <p style={{ color: "red" }}>{errors.email}</p> : null}</strong></span>
                    </div>
                </fieldset>
                <button className="btn text-white bg-orange-500 rounded-full w-64" type="submit">Absenden</button>
            </Form>
        </>
        ) : <>
            <div className="flex flex-col mb-4">
                <h1>Anmeldung</h1>
                <p>Es wurde soeben eine E-Mail and  die E-Mailadresse {email} versendet. Bitte prüfen Sie den Posteingang.</p>
            </div>
            <p className="text-lg text-yellow-900">DEBUG:Following Link can be used to access the anamnesis document: <a href={tempLink}>Login</a></p>
        </>}
    </div>)
}