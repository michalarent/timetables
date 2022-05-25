import { Text, View } from "@react-pdf/renderer";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { colors } from "../styles/colors";
import { MappedEvent } from "../types";
import { deepMatch, polishReplace } from "../utils/strings";
import { CELL_HEIGHT } from "./TimeTablePDF";

export default function TimelineEventPDF({
  eventsForGivenDay,
  time,
  style,
  translator,
  backgroundColor,
  alreadyGenerated,
  setAlreadyGenerated,
}: {
  eventsForGivenDay: MappedEvent[] | undefined;
  time: DateTime;
  style: any;
  translator: string;
  backgroundColor: string;
  alreadyGenerated: string[];
  setAlreadyGenerated: any;
}) {
  const parsedEvents =
    eventsForGivenDay &&
    eventsForGivenDay.map((event) => {
      return event;
    });

  const event = parsedEvents?.find(
    (e) => time >= e.event.start && time < e.event.end
  );

  if (!event) {
    return <Text style={style}>-</Text>;
  }

  function parseEventName(str: string): string {
    const regex = /(\d{1,2}.\d{2})-(\d{2}.\d{2})\s(.*)/;
    const match = str.match(regex);
    if (match) {
      const [, start, end, name] = match;

      return name;
    }
    return str;
  }

  const getOtherTranslatorName = () => {
    try {
      if (!event) return false;
      return deepMatch(event?.translator1?.name, translator)
        ? polishReplace(event?.translator2?.name)
        : polishReplace(event?.translator1?.name);
    } catch {
      return "-";
    }
  };

  if (!event) {
    return <Text style={style}>-</Text>;
  }

  if (false) {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          height: 40,
          width: "100%",
          backgroundColor,
        }}
      ></View>
    );
  }

  function getBorderRadius() {
    if (!event) return "0px";
    if (
      time.equals(event.event.end.minus({ minutes: 30 })) &&
      time.equals(event.event.start)
    ) {
      return "10px";
    }
    if (time.equals(event.event.start)) {
      return "10px 10px 0px 0px";
    }
    if (time.equals(event.event.end.minus({ minutes: 30 }))) {
      return "0px 0px 10px 10px";
    }
  }

  function getPadding() {
    if (!event) return "0px";
    if (
      time.equals(event.event.end.minus({ minutes: 30 })) &&
      time.equals(event.event.start)
    ) {
      return "0px 0px";
    }
    if (time.equals(event.event.start)) {
      return "2px 0px 0px 0px";
    }
    if (time.equals(event.event.end.minus({ minutes: 30 }))) {
      return "0px 0px 2px 0px";
    }
  }

  function getBorder() {
    if (!event) return "0px";
    if (
      time.equals(event.event.end.minus({ minutes: 30 })) &&
      time.equals(event.event.start)
    ) {
      return { border: "1px solid" };
    }
    if (time.equals(event.event.start)) {
      return { border: "1px solid", borderBottom: 0 };
    }
    if (time.equals(event.event.end.minus({ minutes: 30 }))) {
      return { border: "1px solid", borderTop: 0 };
    } else {
      return { borderRight: "1px solid", borderLeft: "1px solid" };
    }
  }

  const timeDiff =
    Math.abs(event.event.end.diff(event.event.start).as("hours")) * 80;

  // !background && console.log(!background ? "Error!" : "");

  if (!time.equals(event.event.start)) return null;

  const DURATION = Math.round(
    Math.abs(event.event.end.diff(event.event.start).as("hours") * 4)
  );

  return (
    <View style={{ position: "relative", width: "100%" }}>
      <View
        style={{
          display: "flex",

          flexDirection: "column",
          height: DURATION * CELL_HEIGHT,
          backgroundColor,
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          borderColor: "black",
          position: "absolute",
          zIndex: 0,

          borderTop: time.equals(event.event.start) ? "1px solid #ccc" : "none",
          borderBottom: time.equals(event.event.end.minus({ minutes: 15 }))
            ? "1px solid #ccc"
            : "none",
        }}
      >
        {/* {time.equals(event.event.start) && ( */}
        <View style={{ width: "100%", zIndex: 100 }}>
          <View
            style={{
              position: "absolute",

              width: "100%",
              zIndex: 100,
            }}
          >
            <Text
              style={{
                ...style,
                zIndex: 10000,

                display: "flex",
                flexDirection: "row",
                fontWeight: 900,
                width: "100%",

                left: 0,
                top: 0,
              }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  padding: 0,
                }}
              >
                Room: {event.room || "-"} {event.languagePair?.toUpperCase()}{" "}
                with {getOtherTranslatorName()}{" "}
              </Text>
            </Text>
            <View style={{ width: "100%" }}>
              <Text style={{ ...style, width: "100%" }}>
                {event.event.start.toLocaleString(DateTime.TIME_24_SIMPLE)} -{" "}
                {event.event.end.toLocaleString(DateTime.TIME_24_SIMPLE)}{" "}
                {parseEventName(event.event.event)}
              </Text>
            </View>
          </View>
        </View>
        {/* )} */}
      </View>
    </View>
  );
}
