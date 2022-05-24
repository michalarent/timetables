import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { TIMETABLE } from "../constants/time";
import { MappedEvent } from "../types";
import TimelineEventPDF from "./TimelineEventPDF";
import { colors } from "../styles/colors";
import { useState } from "react";
import { palette } from "./Calendar";

export const CELL_HEIGHT = 23;

export default function TimeTablePDF({
  events,
  translator,
}: {
  events: MappedEvent[] | undefined;
  translator: string;
}) {
  const times = TIMETABLE();

  const [alreadyGenerated, setAlreadyGenerated] = useState([]);

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
    },
    grid: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    gridItem: {
      display: "flex",

      paddingLeft: 2,
      paddingRight: 2,
      fontSize: 6,
      width: "100%",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
  });

  return (
    //@ts-ignore
    <Document>
      {/*@ts-ignore*/}
      <Page orientation="landscape" style={PDFStyles.page}>
        <View style={PDFStyles.container}>
          <Text
            style={{
              ...PDFStyles.text,
              fontSize: 14,
              marginLeft: 8,
              marginBottom: 8,
              fontWeight: 900,
            }}
          >
            {translator}
          </Text>
          <View style={PDFStyles.grid}>
            <Text style={{ ...PDFStyles.gridItem, width: 150 }}>Events</Text>
            {mappedEvents.map((t, index) => (
              <Text key={index + "-event-time"} style={PDFStyles.gridItem}>
                {times[0]
                  .plus({ day: index })
                  .toLocaleString(DateTime.DATE_SHORT)}
              </Text>
            ))}
          </View>
          {times
            .filter((day) => day.day === 26)
            .filter((day) => day.hour < 19)
            .map((t, i) => (
              <View
                key={t.toLocaleString() + `-${i}`}
                style={{ ...PDFStyles.grid, width: "100%" }}
              >
                <Text
                  style={{
                    ...PDFStyles.gridItem,
                    width: 150,
                    borderRight: `1px solid #eee`,
                    height: CELL_HEIGHT,

                    color: "#aaa",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  {t.toLocaleString(DateTime.TIME_24_SIMPLE)}
                </Text>
                {mappedEvents?.map(
                  (events: MappedEvent[] | undefined, index) => {
                    return (
                      <View
                        key={index + "-pdf-event"}
                        style={{
                          width: "100%",
                          display: "flex",

                          flexDirection: "column",
                          borderTop: "1px solid #eee",
                          borderRight: "1px solid #eee",
                          height: CELL_HEIGHT,
                          position: "relative",
                        }}
                      >
                        <TimelineEventPDF
                          setAlreadyGenerated={setAlreadyGenerated}
                          alreadyGenerated={alreadyGenerated}
                          translator={translator}
                          key={index + "-event"}
                          style={PDFStyles.gridItem}
                          eventsForGivenDay={events}
                          backgroundColor={palette[index % palette.length]}
                          time={t.plus({ day: index })}
                        />
                      </View>
                    );
                  }
                )}
              </View>
            ))}
        </View>
      </Page>
    </Document>
  );
}
