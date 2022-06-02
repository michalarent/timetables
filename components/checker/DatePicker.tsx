import { DateTime } from "luxon";
import { useState } from "react";
import { TIMETABLE } from "../../constants/time";
import Select from "../Select";

export default function DatePicker({
  time,
  setTime,
  day,
  smallerThan,
  greaterThan,
}: {
  time: DateTime;
  setTime: (time: DateTime) => void;
  day: number;
  smallerThan?: DateTime;
  greaterThan?: DateTime;
}) {
  const dateOptions = TIMETABLE();
  const [date, setDate] = useState<DateTime>(DateTime.local());

  return (
    <Select
      options={dateOptions
        .filter((option) => {
          const getDay = option.day === 26;
          if (smallerThan) {
            return (
              getDay && option.set({ day: 26 }) < smallerThan.set({ day: 26 })
            );
          }
          if (greaterThan) {
            return (
              getDay && option.set({ day: 26 }) > greaterThan.set({ day: 26 })
            );
          }
        })
        .map((option) => option.toLocaleString(DateTime.TIME_24_SIMPLE))}
      label={time.toLocaleString(DateTime.TIME_24_SIMPLE)}
      onSelect={(option) =>
        setTime(
          DateTime.fromFormat(option, "HH:mm").set({
            day,
            month: 6,
            year: 2022,
          })
        )
      }
      itemLabel={null}
    />
  );
}
