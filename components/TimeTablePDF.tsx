//@ts-nocheck

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { TIMETABLE } from "../constants/time";
import { MappedEvent } from "../types";
import TimelineEventPDF from "./TimelineEventPDF";

export default function TimeTablePDF({
  events,
  translator,
}: {
  events: MappedEvent[] | undefined;
  translator: string;
}) {
  const times = TIMETABLE();

  const mappedEvents = useMemo(() => {
    return [
      events?.filter((event) => event.event.start.day === 26),
      events?.filter((event) => event.event.start.day === 27),
      events?.filter((event) => event.event.start.day === 28),
      events?.filter((event) => event.event.start.day === 29),
      events?.filter((event) => event.event.start.day === 30),
    ];
  }, [events]);

  if (!events) {
    return <View>Error. Check </View>;
  }

  const PDFStyles = StyleSheet.create({
    page: {
      padding: 20,
      width: "100%",
    },
    container: {
      marginTop: "1rem",
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    flex: {
      display: "flex",
      alignItems: "center",
    },
    text: {
      fontSize: 12,
      marginBottom: "0.5rem",
    },
    grid: {
      paddingTop: 10,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    gridItem: {
      display: "flex",
      borderRight: "1px dashed #ccc",
      paddingLeft: 5,
      paddingRight: 5,
      fontSize: 10,
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <Document>
      <Page style={PDFStyles.page}>
        <View style={PDFStyles.container}>
          <Text style={PDFStyles.text}>{translator}</Text>
          <View style={PDFStyles.grid}>
            <Text style={PDFStyles.gridItem}>Events</Text>
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
              <View key={t.toLocaleString()} style={PDFStyles.grid}>
                <Text style={{ ...PDFStyles.gridItem, width: 150 }}>
                  {t.toLocaleString(DateTime.TIME_24_SIMPLE)}
                </Text>
                {mappedEvents.map((events, index) => {
                  if (events)
                    return (
                      <TimelineEventPDF
                        key={index + "-event"}
                        style={PDFStyles.gridItem}
                        events={events}
                        time={t.plus({ day: index })}
                      />
                    );
                })}
              </View>
            ))}
        </View>
      </Page>
    </Document>
  );
}
