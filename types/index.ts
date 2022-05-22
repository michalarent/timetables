import _ from "lodash";
import { DateTime } from "luxon";
import { Event, parseTimeBrackets } from "../utils/finders";
import { cleanString, deepMatch } from "../utils/strings";
import levenshtein from "js-levenshtein";


export class Translator {
    readonly name: string;
    readonly language: string[];

    constructor(name: string, language: string[]) {
        this.name = name;
        this.language = language;
    }
}

type LanguageColumnRow =
    {
        job1: string;
        job2: string;
        room: string;
        indicator: string;
        translator1: Translator;
        translator2: Translator;
        languagePair: string;
    }

export type GDocDataRow = {
    event: Event;
    assigned: { [languagePair: string]: LanguageColumnRow }
    date: DateTime;
}

export type Contact = {
    index: string;
    lastName: string;
    firstName: string;
    fullName: string;
    languagePairs: string[];
    phone: string;
    email: string;
}

export class Contacts {
    readonly data: Contact[];

    constructor(data: string[][]) {
        this.data = this.parseContactData(data);
    }

    parseContactData(data: string[][]): Contact[] {
        return data.slice(1).map((row, index) => {
            const [indexStr, lastName, firstName, lp1, lp2, lp3, phone, email] = row;
            return {
                index: indexStr,
                lastName: lastName,
                firstName: firstName,
                fullName: `${lastName} ${firstName}`,
                languagePairs: [lp1, lp2, lp3].filter(x => x !== ""),
                phone: phone,
                email: email,
            }
        });
    }

    reverseName(name: string): string {
        const [lastName, firstName] = name.split(" ");
        return `${firstName} ${lastName}`;
    }

    levenshteinMatch(name: string, target: string): boolean {
        return levenshtein(target, name) <= 5 || levenshtein(target, this.reverseName(name)) <= 5;
    }
    findByName(name: string): Contact | undefined {
        try {
            console.log(this.data);
            console.log(name);
            return this.data
                .filter((row) => row != null && row.fullName)
                .find((row) => row?.fullName ? this.levenshteinMatch(row.fullName, name) : false);
        } catch (e) {
            return undefined;
        }
    }

}

export class GDocData {
    readonly data: GDocDataRow[];
    DAY_REGEX = /(\d{2}\.\d{2})/;

    constructor(data: string[][]) {
        this.data = this.parseGDocData(data);
    }

    parseGDocData(data: string[][]): GDocDataRow[] {
        const allLanguagePairs = this.getaAllLanguagePairs(data);
        const result: GDocDataRow[] = [];

        let CURRENT_DAY = "";
        data.forEach((row) => {
            if (!row[0]) return;
            if (row[0].startsWith("Day")) {
                CURRENT_DAY = row[0];
                return;
            }
            if (row[0].startsWith("Total") || row[0].startsWith("MAX")) {
                return;
            }



            if (CURRENT_DAY !== "") {
                const eventName = row[0];

                const { start, end } = parseTimeBrackets(CURRENT_DAY, eventName);
                const assigned = () => {
                    const result: { [languagePair: string]: LanguageColumnRow } = {};
                    allLanguagePairs.forEach((lang: string) => {
                        const langColStartlIndex = data[0].findIndex((c) => {

                            return deepMatch(c, lang);
                        });

                        result[lang] = {
                            job1: row[langColStartlIndex],
                            job2: row[langColStartlIndex + 1],
                            room: row[langColStartlIndex + 2],
                            indicator: row[langColStartlIndex + 3],
                            translator1: {
                                name: row[langColStartlIndex + 4],
                                language: [lang]
                            },
                            translator2: {
                                name: row[langColStartlIndex + 5],
                                language: [lang]
                            },
                            languagePair: lang
                        }

                    })
                    return result;

                }
                result.push({
                    event: {
                        day: CURRENT_DAY,
                        event: eventName,
                        start,
                        end
                    },
                    date: start,
                    assigned: assigned()

                })
            }

        })


        return result;
    }

    getaAllLanguagePairs(data: string[][]) {

        return data[0]
            .slice(1)
            .filter((c) => c !== "" && c != null)
            .map((c) => c.trim().toLowerCase());
    }

    getAllRooms() {
        const result: string[] = [];
        this.data.forEach((row) => {
            Object.keys(row.assigned).forEach((lang) => {
                const { room } = row.assigned[lang];
                if (room !== "" && room !== null) {
                    result.push(room);
                }
            })
        })

        return _.uniq(result);
    }



    getAllTranslators() {
        const result: Translator[] = [];
        this.data.forEach((row) => {
            Object.keys(row.assigned).forEach((lang) => {
                const { translator1, translator2 } = row.assigned[lang];
                if (translator1.name !== "" && translator1.name !== null) {
                    result.push({
                        ...translator1,
                        name: cleanString(translator1.name)
                    });

                }
                if (translator2.name !== "" && translator2.name !== null) {
                    result.push({
                        ...translator2,
                        name: cleanString(translator2.name)
                    });
                }
            })
        })



        return _.uniqBy(result, 'name');
    }

    getAllEventsForTranslator(translator: Translator) {
        const result: MappedEvent[] = [];
        this.data.forEach((row) => {
            Object.keys(row.assigned).forEach((lang) => {
                const { translator1, translator2 } = row.assigned[lang];

                if (deepMatch(translator1.name, translator.name) || deepMatch(translator2.name, translator.name)) {
                    result.push({
                        event: row.event,
                        job1: row.assigned[lang].job1,
                        job2: row.assigned[lang].job2,
                        room: row.assigned[lang].room,
                        indicator: row.assigned[lang].indicator,
                        languagePair: lang,
                        translator1: translator1,
                        translator2: translator2,
                    });
                }
            })
        })

        return result;

    }

    getAllEventsForRoom(room: string): { event: MappedEvent; assigned: AssignedToEvent }[] {

        const result: MappedEvent[] = [];
        this.data.forEach((row) => {
            Object.keys(row.assigned).forEach((lang) => {
                const { room: r } = row.assigned[lang];
                if (deepMatch(r, room)) {
                    result.push({
                        event: row.event,
                        job1: row.assigned[lang].job1,
                        job2: row.assigned[lang].job2,
                        room: row.assigned[lang].room,
                        indicator: row.assigned[lang].indicator,
                        languagePair: lang,
                        translator1: row.assigned[lang].translator1,
                        translator2: row.assigned[lang].translator2,
                    });
                }
            })
        })

        console.log("RESULT:", result);
        return _.uniqBy(result, (e) => e.event.event).map((event) => ({
            event,
            assigned: result.filter((e) => e.event.event === event.event.event).map((e) => (
                {
                    translator1: e.translator1,
                    translator2: e.translator2,
                    job1: e.job1,
                    job2: e.job2,
                    languagePair: e.languagePair,
                }
            ))
        }))
    }

    findAllTranslatorPairsForEvent(event: MappedEvent, room: string): AssignedToEvent {

        const result: AssignedToEvent = [];
        this.data.forEach((row) => {
            Object.keys(row.assigned).forEach((lang) => {
                const { job1, job2, room: r, translator1, translator2, languagePair } = row.assigned[lang];
                if (deepMatch(r, room) && deepMatch(event.event.event, job1) && deepMatch(event.event.event, job2)) {
                    result.push({

                        job1: row.assigned[lang].job1,
                        job2: row.assigned[lang].job2,
                        languagePair: lang,
                        translator1: translator1,
                        translator2: translator2,
                    });
                }
            })
        }
        )
        return result;


    }

}


export type AssignedToEvent =
    { translator1: Translator; translator2: Translator, languagePair: string, job1: string; job2: string }[];

export type RoomMappedEvent = {
    event: MappedEvent;
    assigned: AssignedToEvent;
}

export type MappedEvent = {
    event: Event;
    translator1: Translator;
    translator2: Translator;
    room: string;
    job1: string;
    indicator: string;
    job2: string;
    languagePair: string;
}

export type MappedRoomEvent = {
    [room: string]: MappedEvent[];
}









