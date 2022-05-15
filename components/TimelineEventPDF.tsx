import { Text, View } from "@react-pdf/renderer";
import { DateTime } from "luxon";
import { MappedEvent } from "../types";
import { deepMatch } from "../utils/strings";

export default function TimelineEventPDF({
  events,
  time,
  style,
  translator,
  backgroundColor,
}: {
  events: any[];
  time: DateTime;
  style: any;
  translator: string;
  backgroundColor: string;
}) {
  const parsedEventName = events.map((event) => {
    const regex = /(\d{1,2}.\d{2})-(\d{2}.\d{2})\s(.*)/;
    const match = event.event.event.match(regex);
    if (match) {
      const [, start, end, name] = match;
      return { ...event, name: name };
    }
    return event;
  });

  const event = parsedEventName?.find(
    (e) => time >= e.event.start && time < e.event.end
  );

  if (!event) {
    return <Text style={style}>-</Text>;
  }
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        height: 40,
        width: "100%",
        backgroundColor,
      }}
    >
      <Text
        style={{
          ...style,
          fontWeight: 900,
          width: "100%",
        }}
      >
        Room: {event.room || "-"} ({event.languagePair})
      </Text>

      <Text style={style}>{event.event.event}</Text>
      <Text style={style}>
        {"With "}
        {deepMatch(
          event.translator1.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
          translator.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        )
          ? event.translator2.name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          : event.translator1.name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")}
      </Text>
    </View>
  );
}
