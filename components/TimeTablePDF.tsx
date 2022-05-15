//@ts-nocheck

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { TIMETABLE } from "../constants/time";
import { MappedEvent } from "../types";
import TimelineEventPDF from "./TimelineEventPDF";
import { colors } from "../styles/colors";

export default function TimeTablePDF({
  events,
  translator,
}: {
  events: MappedEvent[] | undefined;
  translator: string;
}) {
  const times = TIMETABLE();

  const mappedEvents = useMemo(() => {
    const evs = events?.map((e) => ({
      ...e,
      event: {
        ...e.event,
        start:
          typeof e.event.start === "string"
            ? DateTime.fromISO(e.event.start)
            : e.event.start,
        end:
          typeof e.event.end === "string"
            ? DateTime.fromISO(e.event.end)
            : e.event.end,
      },
    }));
    return [
      evs?.filter((event) => event.event.start.day === 26),
      evs?.filter((event) => event.event.start.day === 27),
      evs?.filter((event) => event.event.start.day === 28),
      evs?.filter((event) => event.event.start.day === 29),
      evs?.filter((event) => event.event.start.day === 30),
    ];
  }, [events]);

  if (!events) {
    return <View>Error. Check </View>;
  }

  const palette = [
    colors["amber-50"],
    colors["blue-50"],
    colors["yellow-50"],
    colors["green-50"],
    colors["red-50"],
    colors["purple-50"],
    colors["pink-50"],
    colors["indigo-50"],
    colors["teal-50"],
    colors["orange-50"],
    colors["cyan-50"],
  ];

  const PDFStyles = StyleSheet.create({
    page: {
      padding: 0,
      width: "100%",
      fontFamily: "Helvetica",
    },
    container: {
      marginTop: 10,
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    flex: {
      display: "flex",
      alignItems: "center",
    },
    text: {
      fontSize: 9,
      marginBottom: 5,
    },
    grid: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    gridItem: {
      display: "flex",

      paddingLeft: 5,
      paddingRight: 5,
      fontSize: 8,
      width: "100%",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
  });

  return (
    <Document>
      <Page orientation="landscape" style={PDFStyles.page}>
        <View style={PDFStyles.container}>
          <Text
            style={{
              ...PDFStyles.text,
              fontSize: 14,
              marginLeft: 8,
              fontWeight: 900,
            }}
          >
            {translator}
          </Text>
          <View style={PDFStyles.grid}>
            <Text style={{ ...PDFStyles.gridItem, width: 150 }}>Events</Text>
            {mappedEvents.map((t, index) => (
              <Text key={index + "-event"} style={PDFStyles.gridItem}>
                {times[0]
                  .plus({ day: index })
                  .toLocaleString(DateTime.DATE_SHORT)}
              </Text>
            ))}
          </View>
          {times
            .filter((day) => day.day === 26)
            .map((t) => (
              <View key={t.toLocaleString()} style={{ ...PDFStyles.grid }}>
                <Text
                  style={{
                    ...PDFStyles.gridItem,
                    width: 150,
                    borderRight: `1px solid #ccc`,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                  }}
                >
                  {t.toLocaleString(DateTime.TIME_24_SIMPLE)}
                </Text>
                {mappedEvents.map((events: any, index) => {
                  return (
                    <View
                      key={index + "-pdf-event"}
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderTop: "1px dashed #ccc",
                        borderRight: "1px dashed #ccc",
                        height: 40,
                      }}
                    >
                      <TimelineEventPDF
                        translator={translator}
                        key={index + "-event"}
                        style={PDFStyles.gridItem}
                        events={events}
                        time={t.plus({ day: index })}
                        backgroundColor={palette[index % palette.length]}
                      />
                    </View>
                  );
                })}
              </View>
            ))}
        </View>
      </Page>
    </Document>
  );
}
