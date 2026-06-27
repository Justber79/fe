export async function copyEmails(emails: string[]) {
  await navigator.clipboard.writeText(emails.join("\n"));
}
