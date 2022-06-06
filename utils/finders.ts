import _ from "lodash";
import { DateTime } from "luxon";
import { start } from "repl";
import { Translator } from "../types";
import { deepMatch } from "./strings";

export type Event = {
    event: string;
    day: string;
    start: DateTime;
    end: DateTime;
    languagePairs?: string[];
};

export function langPairAndReverse(langPair: string): [string, string] {
    const [lang1, lang2] = langPair.split("-");

    const pair1 = lang1 + "-" + lang2;
    const pair2 = lang2 + "-" + lang1;
    return [pair1, pair2];
}

export function findTranslatorsForLanguagePair(
    languagePair: string,
    d: {
        data: string[][];
    }
): Translator[] {
    const { data } = d;

    const index = data[0].findIndex((c) => c === languagePair);

    const col: Translator[] = [];

    data.forEach((row) => {

        col.push({
            name: row[index + 4],
            language: [languagePair],
        });
        col.push({
            name: row[index + 5],
            language: [languagePair],
        })
    });

    return _.uniqBy(
        col
            .filter((c) => c.name !== "" && c.name != null)
            .map((c) => {
                return { name: c.name.trim().toLowerCase(), language: c.language };
            }), 'name'
    );
}

export function findAllEvents(d: { data: string[][] }) {
    const { data } = d;

    const index = data[0].findIndex((c) => c === "PL-EN");

    const col: string[] = [];

    data.forEach((row) => {
        col.push(row[0]);
    });

    return _.uniq(
        col
            .filter((c) => c !== "" && c != null)
            .map((c) => {
                return c.trim().toLowerCase();
            })
    );
}

export function findPairsByColumn(column: string, d: { data: string[][] }) {
    const { data } = d;

    const index = data[0].findIndex((c) => c === column);

    const col: { t1: string; t2: string }[] = [];

    data.forEach((row) => {
        if ([row[index + 1], row[index + 2]].every((c) => c !== "" && c != null)) {
            return;
        } else {
            col.push({
                t1: row[index + 1],
                t2: row[index + 2],
            });
        }
    });

    return col;
}



export function findAllTranslators(pairs: string[], data: { data: string[][] }): Translator[] {
    const translators: Translator[] = [];
    pairs.forEach((pair) => {
        const trs = findTranslatorsForLanguagePair(pair, data);
        trs.forEach((tr) => {
            if (!translators.filter((t) => t.name === tr.name).length) {
                translators.push({
                    name: tr.name,
                    language: [pair],
                });
            } else {
                const trs = translators.filter((t) => t.name === tr.name);
                trs[0].language.push(pair);
            }
        });
    });

    return _.uniqBy(translators, "name");
}

function findLanguagePairColumnIndex(pair: string, data: string[][]) {
    const index = data[0].findIndex((c) => c === pair);
    return index;
}

export function findAllTranslatorCoordinates(
    translator: string,
    data: { data: string[][] }
) {
    const indexes: number[] = [];

    data.data.forEach((row, i) => {
        row.forEach((col) => {
            if (col.toLowerCase().trim() === translator.toLowerCase().trim()) {
                indexes.push(i);
            }
        });
    });
    return indexes;
}

export function findAllEventsForTranslator(
    translator: Translator,
    data: { data: string[][] }
) {
    try {
        const indexes = findAllTranslatorCoordinates(translator.name, data);

        const events: string[] = [];

        const eventsWithDays: {
            event: string;
            day: string;
            start: DateTime;
            end: DateTime;
            pair: [Translator, Translator],
        }[] = [];


        indexes.forEach((index) => {
            let day = "";
            for (let i = index; i > 0; i--) {
                if (
                    data.data[i][0]
                        ? data.data[i][0].includes("Day")
                        : data.data[i][0] && data.data[i][0].includes("Day")
                ) {
                    day = data.data[i][0];

                    break;
                }
            }
            const event =
                data.data[index][0] === "" ? data.data[index][1] : data.data[index][0];

            const otherTranslator = () => {
                const colIndex = findLanguagePairColumnIndex(
                    translator.language[0],
                    data.data
                );
                const _column = data.data[index][colIndex + 1];
                const _column2 = data.data[index][colIndex + 2];


                return deepMatch(_column, translator.name) ? _column2 : _column;


            }

            const { start, end } = parseTimeBrackets(day, event);

            eventsWithDays.push({
                event,
                day,
                start,
                end,
                pair: [translator, { name: otherTranslator(), language: translator.language }],
            });
        });


        return eventsWithDays;
    } catch (e) {
        console.log(e)
    }
}

export function parseTimeBrackets(
    day: string,
    event: string
): { start: DateTime; end: DateTime } {
    // day pattern is like: Dzień 1 (niedziela, 26.06)
    // year is 2022
    // regex: .*\(\w*,\s(.*)\)

    const regex = /(\d{2}\.\d{2})/;
    const match = day.match(regex);

    if (match) {
        const date = match[1];
        const [day, month] = date.split(".");

        const year = "2022";
        const { startTime, endTime } = parseTimeFromEventName(event);

        return {
            start: DateTime.fromObject({
                day: +day,
                month: +month,
                year: +year,
                hour: +startTime.hour,
                minute: +startTime.minute,
            }),
            end: DateTime.fromObject({
                day: +day,
                month: +month,
                year: +year,
                hour: +endTime.hour,
                minute: +endTime.minute,
            }),
        };
    }
    return {
        start: DateTime.fromObject({ day: 1, month: 1, year: 2020 }),
        end: DateTime.fromObject({ day: 1, month: 1, year: 2020 }),
    };
}

export function parseTimeFromEventName(eventName: string): {
    startTime: { hour: number; minute: number };
    endTime: { hour: number; minute: number };
} {
    // event name pattern is like: "10.00-18.00 Assembly 1"
    const regex = /(\d{1,2}.\d{1,2})\s{0,1}-\s{0,1}(\d{1,2}.\d{1,2})/;
    const match = eventName.match(regex);


    if (match) {
        const _start = match[1].replace(":", ".");
        const _end = match[2].replace(":", ".");

        const start = _start.split(".");
        const end = _end.split(".");
        return {
            startTime: { hour: +start[0], minute: +start[1] },
            endTime: { hour: +end[0], minute: +end[1] },
        };
    }
    return {
        startTime: { hour: 0, minute: 0 },
        endTime: { hour: 0, minute: 0 },
    };
}