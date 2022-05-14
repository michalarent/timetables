import { capitalize } from "lodash";



export function capitalizeName(name: string) {
    if (!name) return "";
    return name.split(" ").map((s) => capitalize(s)).join(" ");
}

export function deepMatch(a: string, b: string) {
    if (!a || !b) return false;
    return a.toLowerCase().trim() === b.toLowerCase().trim();
}

export function cleanString(a: string) {
    if (!a) return "";
    return a.trim().toLowerCase();
}