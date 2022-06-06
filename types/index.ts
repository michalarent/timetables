import _ from "lodash";
import { DateTime } from "luxon";
import { Event, parseTimeBrackets } from "../utils/finders";
import { cleanString, deepMatch } from "../utils/strings";
import levenshtein from "js-levenshtein";
import { assert } from "console";


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
    location: string;
}

export function reverseName(name: string): string {
    const [lastName, firstName] = name.split(" ");
    return `${firstName} ${lastName}`;
}

export function levenshteinMatch(name: string, target: string): boolean {
    return levenshtein(target, name) <= 5 || levenshtein(target, reverseName(name)) <= 5;
}

export class Contacts {
    readonly data: Contact[];
    readonly allUniqueLanguages: string[];
    readonly allUniqueLocations: string[];

    constructor(data: string[][]) {
        this.data = this.parseContactData(data);
        this.allUniqueLanguages = this.parseAllUniqueLanguages();
        this.allUniqueLocations = this.parseAllUniqueLocations();
    }

    parseContactData(data: string[][]): Contact[] {
        const contacts = data.slice(1).map((row, index) => {
            const [indexStr, lastName, firstName, lp1, lp2, lp3, phone, email, location] = row;
            return {
                index: indexStr,
                lastName: lastName,
                firstName: firstName,
                fullName: `${lastName} ${firstName}`,
                languagePairs: [lp1, lp2, lp3].filter(x => x !== ""),
                phone: phone,
                email: email,
                location: location,
            }
        });
        return _.uniqBy(contacts, x => x.email);
    }

    parseAllUniqueLanguages(): string[] {
        return _.uniq(this.data.flatMap(x => x.languagePairs));
    }

    parseAllUniqueLocations(): string[] {
        return _.uniq(this.data.flatMap(x => x.location)).filter(x => x !== "" && x != null);
    }

    private filterByLanguage(language: string): Contact[] {
        return this.data.filter(x => x.languagePairs.includes(language));
    }

    public filterByLanguages(languages: string[]): Contact[] {
        const data = this.data.filter((x) => {

            return languages.every(language => x.languagePairs.includes(language));
        }
        );
        console.log(data)
        return data;
    }



    public filterByLocations(locations: string[]): Contact[] {
        console.log(locations);
        if (locations.length)
            return this.data.filter((x) => !_.isUndefined(x.location)).filter(x => locations.map((x) => x.toLowerCase()).includes(x.location.toLowerCase()));

        return this.data;
    }



    findByName(name: string): Contact | undefined {
        try {

            return this.data
                .filter((row) => row != null && row.fullName)
                .find((row) => row?.fullName ? levenshteinMatch(row.fullName, name) : false);
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
                console.log(eventName)
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
                        end,
                        languagePairs: row[1] ? row[1].split(",").map(x => x.trim()).filter(x => x !== "") : undefined
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
            .filter((c) => c !== "" && c != null && !deepMatch(c, "Kombinacje językowe"))
            .map((c) => c.trim().toLowerCase());
    }


    getAllUniqueLanguages() {
        const result: string[] = [];
        this.data.forEach((row) => {
            Object.keys(row.assigned).forEach((lang) => {
                const { translator1, translator2 } = row.assigned[lang];
                if (translator1.language) {
                    result.push(...translator1.language);
                }
                if (translator2.language) {
                    result.push(...translator2.language);
                }
            })
        })

        return _.uniq(result);
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



    getAllEventsInTimeRange(startTime: DateTime, endTime: DateTime): GDocDataRow[] {
        const filteredEvents = this.data.filter((row) => row.event.start >= startTime && row.event.end <= endTime);
        return filteredEvents;
    }

    getAllTranslatorsAssignedToEvent(row: GDocDataRow) {
        const allTranslators = this.getAllTranslators();
        const assignedTranslators = this.findAllTranslatorsForEvent(row.event);
        return assignedTranslators;
    }

    matchTranslatorWithContact(contact: Contact): Translator | undefined {
        if (!contact) return undefined;
        return this.getAllTranslators().find((t) => levenshteinMatch(t.name, contact.fullName));
    }

    checkIfTranslatorIsFree(startTime: DateTime, endTime: DateTime, translator: Translator): boolean {

        const translatorEvents = this.getAllEventsForTranslator(translator);

        const eventsInTimeRange = translatorEvents.filter((event) => event.event.start.day === startTime.day).filter((event) => {


            const isEventInRange = event.event.start >= startTime && event.event.start < endTime;
            const isStartTimeBetweenEvent = event.event.start < startTime && event.event.end > startTime;
            const isEndTimeBetweenEvent = event.event.start < endTime && event.event.end > endTime;

            return isEventInRange || isStartTimeBetweenEvent || isEndTimeBetweenEvent;

            return true;

        });



        if (eventsInTimeRange.length) return false;
        return true;

    }

    checkIfTranslatorUsesLanguages(translator: Translator, languages: string[]): boolean {
        const translatorEvents = this.getAllEventsForTranslator(translator);
        const filteredLanguages = translatorEvents.filter((event) => {
            return languages.some((lang) => event.languagePair === lang);

        }
        );

        if (filteredLanguages.length) return true;
        return false;
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

    findAllTranslatorsForEvent(event: Event) {

        const result: Translator[] = [];
        this.data.forEach((row) => {
            Object.keys(row.assigned).forEach((lang) => {
                const { job1, job2, room, translator1, translator2, languagePair } = row.assigned[lang];
                if (deepMatch(event.event, event.event) && deepMatch(event.event, event.event)) {
                    result.push(translator1, translator2);
                }
            })
        }
        )
        return result;
    }

    findAllEventsWithoutARoom() {

        return this.data.filter((row) => {
            return Object.keys(row.assigned).some((lang) => {
                return row.assigned[lang].room === '';
            })
        }
        );
    }

    findAllTranslatorPairsWithoutTwoTranslators(showEventsWithoutBothTranslators: boolean) {

        return this.data.filter((row) => {
            return Object.keys(row.assigned).some((lang) => {
                if (!showEventsWithoutBothTranslators) {
                    return row.assigned[lang].translator1.name === "" || row.assigned[lang].translator2.name === "" || row.assigned[lang].translator1 === undefined || row.assigned[lang].translator2 === undefined;
                }
                if (showEventsWithoutBothTranslators && row.event.languagePairs?.some((lp) => deepMatch(lp, lang))) {
                    return row.assigned[lang].translator1.name === "" || row.assigned[lang].translator2.name === "" || row.assigned[lang].translator1 === undefined || row.assigned[lang].translator2 === undefined;
                }
            })
        }
        );
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









