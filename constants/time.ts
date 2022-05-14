
import { DateTime, Interval } from 'luxon';

export const GLOBAL_START = DateTime.local(2022, 6, 26, 8, 0, 0);

export const TIMETABLE = () => {

    // from 26.06 to 30.06 2022, 30 minute intervals, starting at 08:00, ending at 20:00

    function* days(interval: Interval) {
        let cursor = interval.start.startOf("day");
        while (cursor < interval.end) {
            yield cursor;
            cursor = cursor.plus({ days: 1 });
        }
    }
    let start = DateTime.local(2022, 6, 26, 8, 0, 0);
    let end = DateTime.local(2022, 6, 30, 20, 0, 0);
    let interval = Interval.fromDateTimes(start, end);

    var arr = Array.from(days(interval));

    let timetable: DateTime[] = [];

    for (let i = 26; i <= 30; i++) {
        const startTime = 8;
        for (let j = 0; j <= 24; j++) {
            const date = DateTime.fromObject({ day: i, month: 6, year: 2022, hour: startTime, minute: 0 });
            const time = date.plus({ minutes: 30 * j });
            timetable.push(time);
        }
    }








    return timetable;

}