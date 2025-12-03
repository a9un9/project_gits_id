export async function loginRequest(email: string, password: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message };
    }

    return {
      success: true,
      token: data.access_token,
    };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
