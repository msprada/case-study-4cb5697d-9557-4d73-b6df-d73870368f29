import { Form } from "react-router"
export type AnamnesisError = { firstname?: string, lastname?: string, address?: string, mainMedicalDisorder?: string }

export function AnamnesisForm( {errors} : { errors: AnamnesisError|undefined }) {

     return (
        <Form method="post">
            <legend className="mb-4"><i>Registrierungsformular</i></legend>
            <fieldset>
                <div className="flex flex-row justify-end gap-2 mb-4">
                    <label htmlFor="firstname">
                        Vorname:
                    </label>
                    <input className="border-2 boder-solid border-white" aria-required type="text" name="firstname" id="firstname" />
                </div>
                <div className="flex flex-row justify-end gap-2 mb-4">
                    <span><strong>{errors?.firstname ? <p style={{ color: "red" }}>{errors.firstname}</p> : null}</strong></span>
                </div>

                <div className="flex flex-row justify-end gap-2 mb-4">
                    <label htmlFor="lastname">
                        Nachname:
                    </label>
                    <input className="border-2 boder-solid border-white" aria-required type="text" name="lastname" id="lastname" />
                </div>
                <div className="flex flex-row justify-end gap-2 mb-4">
                    <span><strong>{errors?.lastname ? <p style={{ color: "red" }}>{errors.lastname}</p> : null}</strong></span>
                </div>

                <div className="flex flex-row justify-end gap-2 mb-4">
                    <label htmlFor="address">
                        Adresse:
                    </label>
                    <input className="border-2 boder-solid border-white" aria-required type="text" name="address" id="address" />
                </div>
                <div className="flex flex-row justify-end gap-2 mb-4">
                    <span><strong>{errors?.address ? <p style={{ color: "red" }}>{errors.address}</p> : null}</strong></span>
                </div>

                <div className="flex flex-row justify-end gap-2 mb-4">
                    <label htmlFor="mainMedicalDisorder">
                        Hauptbeschwerde:
                    </label>
                    <input className="border-2 boder-solid border-white" aria-required type="text" name="mainMedicalDisorder" id="mainMedicalDisorder" />
                </div>
                <div className="flex flex-row justify-end gap-2 mb-4">
                    <span><strong>{errors?.mainMedicalDisorder ? <p style={{ color: "red" }}>{errors.mainMedicalDisorder}</p> : null}</strong></span>
                </div>

                <div className="flex flex-row justify-end gap-2 mb-4">
                    <label htmlFor="furtherMedicalDisorder">
                        Weitere Beschwerden:
                    </label>
                    <input className="border-2 boder-solid border-white" type="text" name="furtherMedicalDisorder" id="furtherMedicalDisorder" />
                </div>

            </fieldset>
            <div className="flex flex-row justify-end gap-2 mb-4">
                <button className="btn text-white bg-orange-500 rounded-full w-64" type="submit">Absenden</button>
            </div>
            <input type="hidden" value="dummy@mail.de" name="email"></input>
        </Form>
    )
}