import { capitalize } from "lodash";



export function capitalizeName(name: string) {
    if (!name) return "";
    // if name includes -, split it and capitalize each part then join them

    if (name.includes("-")) {
        let [surname, firstName] = name.split(" ");
        const parts = surname.split("-");
        surname = parts.map(capitalize).join("-");

        return surname + " " + capitalize(firstName);
    }

    // if name doesn't include -, just capitalize first letter

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

// replace special polish characters
const polishChars = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ź: "z",
    ż: "z",
    Ą: "A",
    Ć: "C",
    Ę: "E",
    Ł: "L",
    Ń: "N",
    Ó: "O",
    Ś: "S",
    Ź: "Z",
    Ż: "Z",
};

//function to replace polish characters
export const polishReplace = (str: string) => {
    return str.replace(
        /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g,
        //@ts-ignore
        (match: any) => polishChars[match]
    );
};