import { toast } from "react-toastify";

export async function copyEmails(emails: string[]) {
  try {
    await navigator.clipboard.writeText(emails.join(", "));
    toast.success(`Copied ${emails.length} emails`);
  } catch {
    toast.error("Couldn't copy emails");
  }
}
