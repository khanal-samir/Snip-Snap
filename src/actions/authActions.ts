"use server";

export async function handleRegister(_prevState: unknown, formData: FormData) {
  // console.log(formData.get("gender"));
  try {
    return {
      status: 201,
      message: "User created successfully",
    };
  } catch (error) {
    return {
      status: 400,
      message: "User created successfully",
      errors: error,
      data: formData.getAll,
    };
  }
}
