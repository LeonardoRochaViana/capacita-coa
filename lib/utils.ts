export const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");
export const initials = (name: string) => name.split(" ").slice(0,2).map(n=>n[0]).join("");
