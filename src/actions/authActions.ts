"use server";

export async function handleRegister(_prevState: any, formData: FormData) {
  console.log(formData.get("gender"));
}
