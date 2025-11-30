import { Form, data } from "react-router";
import type { Route } from "./+types/sign-in";
import prisma  from "../utils/prisma.server";


function generateToken(email: string) {
    const guid = crypto.randomUUID();
    return `${email}-${guid}`;
}


function genereateTempLink(token:string, url:URL) {
    return `${url.protocol}//${url.host}/anamnesis/${encodeURIComponent(token)}`;
}

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Sign In" },
        { name: "description", content: "Provide your e-mail to genereate a temp link" },
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
        errors.email = "Invalid email address";
    }

    if (Object.keys(errors).length > 0) {
        return data({ errors }, { status: 400 });
    }

    const token = generateToken(email);
    const tempLink = genereateTempLink(token,url);
  


     const tempLinks = await prisma.tempLink.create({
        data: {
            id: token,
            email: email,
            tempLink: tempLink
        }
    }); 


   
    console.log(`Generated temp link for ${email}: ${tempLink}`);

    return { tempLink: tempLink, email:email};
}

export default function SignIn({ actionData }: Route.ComponentProps) {

    let errors, tempLink, email;

    if(actionData && typeof actionData === "object" && 'errors' in actionData){
        errors = actionData.errors;
    }

    if(actionData && typeof actionData === "object" && 'tempLink' in actionData){
        tempLink = actionData.tempLink;
    }

     if(actionData && typeof actionData === "object" && 'email' in actionData){
        email = actionData.email;
    }

    return (<div>
        <h1>Sign In</h1>
        <p>This is the sign in page.</p>
        <Form method="post">
            <input type="text" name="email" />
            {errors?.email ? <p style={{ color: "red" }}>{errors.email}</p> : null}
            <button type="submit">Submit</button>
        </Form>
        {tempLink && tempLink!==undefined ? (<>
            <p>You just received an email {email}. Check your inbox</p>
            <p>Debug:Following Link can be used to access the anamnesis document: <a href={tempLink}>Login</a></p>
            </>
        ) : null}
    </div>)
}