import { Text, View } from "@react-pdf/renderer";
import { DateTime } from "luxon";
import { MappedEvent } from "../types";

export default function TimelineEventPDF({
  events,
  time,
  style,
}: {
  events: MappedEvent[];
  time: DateTime;
  style: any;
}) {
  console.log(events);
  const parsedEventName = events.map((event) => {
    const regex = /(\d{1,2}.\d{2})-(\d{2}.\d{2})\s(.*)/;
    const match = event.event.event.match(regex);
    if (match) {
      const [, start, end, name] = match;
      return { ...event, name: name };
    }
    return event;
  });

  const event = parsedEventName?.filter(
    (e) => time >= e.event.start && time <= e.event.end
  );

  if (event.length === 0) {
    return <Text style={style}>-</Text>;
  }
  return <Text style={style}>{event.map((e) => e.event.event)}</Text>;
}
