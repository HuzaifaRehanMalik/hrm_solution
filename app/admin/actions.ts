"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSql, rows } from "@/app/lib/db";
import {
  ADMIN_EMAIL,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  checkCredentials,
  createSession,
  destroyOtherSessions,
  destroySession,
  hashPassword,
  requireAdmin,
  verifyPassword,
} from "@/app/lib/auth";
import { createRateLimiter } from "@/app/lib/rate-limit";

export type FormState = { error?: string; success?: string } | undefined;

// Enquiry ids are a bigint in the live database (older schema) and a UUID in
// fresh installs, so accept either shape.
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BIGINT_ID = /^[1-9][0-9]{0,18}$/;

function isEnquiryId(id: string) {
  return UUID.test(id) || BIGINT_ID.test(id);
}

// A stolen session shouldn't be a way to brute-force the current password.
const currentPasswordLimit = createRateLimiter({
  limit: 5,
  windowMs: 15 * 60_000,
});

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function login(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = field(formData, "email");
  const password = field(formData, "password");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }
  if (email.length > 254 || password.length > MAX_PASSWORD_LENGTH) {
    return { error: "Incorrect email or password." };
  }

  let result;
  try {
    result = await checkCredentials(email, password);
  } catch (error) {
    console.error("Admin login failed:", error);
    return { error: "Could not reach the database. Try again in a moment." };
  }

  if (!result.ok) {
    return {
      error:
        result.reason === "locked"
          ? "Too many failed attempts. Try again in 15 minutes."
          : "Incorrect email or password.",
    };
  }

  try {
    await createSession(result.userId);
  } catch (error) {
    console.error("Could not create admin session:", error);
    return { error: "Could not reach the database. Try again in a moment." };
  }
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireAdmin();

  const current = field(formData, "current");
  const next = field(formData, "next");
  const confirm = field(formData, "confirm");

  if (!current || !next || !confirm) {
    return { error: "Fill in all three fields." };
  }
  if (next.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `The new password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  if (next.length > MAX_PASSWORD_LENGTH || current.length > MAX_PASSWORD_LENGTH) {
    return {
      error: `Passwords can be at most ${MAX_PASSWORD_LENGTH} characters.`,
    };
  }
  if (next !== confirm) {
    return { error: "The new passwords don't match." };
  }
  if (next === current) {
    return { error: "Choose a password different from the current one." };
  }

  if (!currentPasswordLimit(session.userId)) {
    return { error: "Too many attempts. Try again in 15 minutes." };
  }

  const sql = getSql();
  const [admin] = (await sql`
    select password_hash from admin_users
    where id = ${session.userId} and email = ${ADMIN_EMAIL}
  `) as { password_hash: string }[];

  if (!admin || !(await verifyPassword(current, admin.password_hash))) {
    return { error: "Your current password is incorrect." };
  }

  // Only the password columns are ever written; the email is not an input.
  await sql`
    update admin_users
    set password_hash = ${await hashPassword(next)},
        password_changed_at = now()
    where id = ${session.userId} and email = ${ADMIN_EMAIL}
  `;
  await destroyOtherSessions(session);

  return {
    success: "Password updated. Any other signed-in browsers were signed out.",
  };
}

export async function setEnquiryStatus(formData: FormData) {
  await requireAdmin();

  const id = field(formData, "id");
  const status = field(formData, "status");
  if (!isEnquiryId(id) || (status !== "new" && status !== "accomplished")) {
    console.error("setEnquiryStatus: rejected input", { id, status });
    return;
  }

  const updated = rows<{ id: string }>(
    await getSql()`update enquiries set status = ${status} where id::text = ${id} returning id`,
  );
  if (updated.length === 0) console.error("setEnquiryStatus: no row with id", id);
  revalidatePath("/admin");
}

export async function deleteEnquiry(formData: FormData) {
  await requireAdmin();

  const id = field(formData, "id");
  if (!isEnquiryId(id)) {
    console.error("deleteEnquiry: rejected id", id);
    return;
  }

  const deleted = rows<{ id: string }>(
    await getSql()`delete from enquiries where id::text = ${id} returning id`,
  );
  if (deleted.length === 0) console.error("deleteEnquiry: no row with id", id);
  revalidatePath("/admin");
}
