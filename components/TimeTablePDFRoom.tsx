import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import levenshtein from "js-levenshtein";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { TIMETABLE } from "../constants/time";
import { AssignedToEvent, Contact, MappedEvent } from "../types";
import { polishReplace } from "../utils/strings";
import { palette } from "./Calendar";
import TimelineEventPDF from "./TimelineEventPDF";

export const CELL_HEIGHT = 23;

export default function TimeTablePDF({
  events,
  room,
  contacts,
}: {
  events: { event: MappedEvent; assigned: AssignedToEvent }[] | undefined;
  room: string;
  contacts: Contact[];
}) {
  const times = TIMETABLE();

  function reverseName(name: string): string {
    const [lastName, firstName] = name.split(" ");
    return `${firstName} ${lastName}`;
  }
  function levenshteinMatch(name: string, target: string): boolean {
    return (
      levenshtein(target, name) <= 5 ||
      levenshtein(target, reverseName(name)) <= 5
    );
  }
  function findByName(data: Contact[], name: string): Contact | undefined {
    try {
      return data
        .filter((row) => row != null && row.fullName)
        .find((row) =>
          row?.fullName ? levenshteinMatch(row.fullName, name) : false
        );
    } catch (e) {
      return undefined;
    }
  }

  const mappedEvents = useMemo(() => {
    const evs = events?.map((e) => ({
      ...e,
      event: {
        ...e.event,
        start:
          typeof e.event.event.start === "string"
            ? DateTime.fromISO(e.event.event.start)
            : e.event.event.start,
        end:
          typeof e.event.event.end === "string"
            ? DateTime.fromISO(e.event.event.end)
            : e.event.event.end,
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
    },
    container: {
      marginTop: 10,
      display: "flex",
      flexDirection: "column",
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
      alignItems: "flex-start",
    },
    gridItem: {
      display: "flex",

      paddingLeft: 2,
      paddingRight: 2,
      fontSize: 6,

      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
  });

  return (
    //@ts-ignore
    <Document>
      {[26, 27, 28, 29, 30].map((date) => {
        const _date = DateTime.fromObject({
          year: 2022,
          month: 6,
          day: date,
        });
        return (
          //@ts-ignore
          <Page
            key={_date.toISO()}
            orientation="portrait"
            style={PDFStyles.page}
          >
            <Text style={{ padding: 5, fontWeight: 900 }}>Room: {room}</Text>
            <View style={PDFStyles.grid}>
              <View
                style={{
                  padding: 5,
                  width: mappedEvents?.filter(
                    (day) => day && day[0]?.event.start.day === date
                  ).length
                    ? "100%"
                    : "30%",

                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text style={{ padding: 5, fontSize: 8, fontWeight: 600 }}>
                  {_date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
                </Text>
                <View style={{ display: "flex", flexDirection: "column" }}>
                  {mappedEvents
                    ?.filter((day) => day && day[0]?.event.start.day === date)
                    .map((day, index) => {
                      return (
                        <View
                          key={index + "-event"}
                          style={{
                            padding: 5,
                            width: "100%",

                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {day?.map((event, index) => {
                            return (
                              <View
                                style={{
                                  backgroundColor:
                                    palette[index % palette.length],
                                  paddingTop: 5,
                                  paddingBottom: 5,
                                  marginTop: 5,
                                  borderRadius: 10,
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                }}
                                key={index + "-pdf-event"}
                              >
                                <Text
                                  style={{
                                    fontSize: 8,
                                    fontWeight: 800,
                                    marginBottom: 5,
                                    paddingBottom: 2,
                                    borderBottom: "1px solid #ccc",
                                  }}
                                >
                                  {event.event.event.event}
                                </Text>
                                {event.assigned.map((ass, id) => {
                                  return (
                                    <View
                                      key={
                                        ass.translator1.name +
                                        ass.translator2.name +
                                        id
                                      }
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      {[ass.translator1, ass.translator2].every(
                                        (t) => t.name !== "" && t.name != null
                                      ) && (
                                        <Text
                                          style={{
                                            fontSize: 7,
                                            lineHeight: 1.5,
                                          }}
                                        >
                                          {ass.languagePair.toUpperCase()}:
                                          {polishReplace(ass.translator1.name)}(
                                          {
                                            findByName(
                                              contacts,
                                              ass.translator1.name
                                            )?.phone
                                          }
                                          ) +{" "}
                                          {polishReplace(ass.translator2.name)}{" "}
                                          (
                                          {
                                            findByName(
                                              contacts,
                                              ass.translator2.name
                                            )?.phone
                                          }
                                          )
                                        </Text>
                                      )}
                                    </View>
                                  );
                                })}
                                <View
                                  style={{
                                    marginTop: 10,
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <View>
                                    <Text style={{ fontSize: 6 }}>
                                      Godzina zakonczenia:
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      marginLeft: 10,
                                      fontSize: 6,
                                      width: "100%",
                                      borderBottom: `1px dotted #ccc`,
                                    }}
                                  />
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      );
                    })}
                </View>
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
}
