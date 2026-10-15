type Mention = { name: string; kind: "person" | "agent"; id: number };

const AGENT_TOKEN = /<@agent:(\d+)>/g;

export function formatMentions(text: string, mentions: Mention[]) {
  let formatted = text;
  const taggedPersonIds = new Set<number>();
  [...mentions]
    .sort((first, second) => second.name.length - first.name.length)
    .forEach((mention) => {
      const escapedName = mention.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      formatted = formatted.replace(new RegExp(`@${escapedName}(?![\\p{L}\\p{N}_])`, "gu"), () => {
        if (mention.kind === "person") taggedPersonIds.add(mention.id);
        return `<@${mention.kind}:${mention.id}>`;
      });
    });
  const taggedAgentIds = [...new Set([...formatted.matchAll(AGENT_TOKEN)].map((match) => Number(match[1])))];
  return { text: formatted, taggedPersonIds: [...taggedPersonIds], taggedAgentIds };
}
