import _ from "lodash";
import { DateTime } from "luxon";
import { Event, parseTimeBrackets } from "../utils/finders";
import { cleanString, deepMatch } from "../utils/strings";


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
                console.log(eventName);
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










