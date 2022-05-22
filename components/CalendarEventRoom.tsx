import { Transition } from "@headlessui/react";
import Tippy from "@tippyjs/react";
import { DateTime } from "luxon";
import { Fragment } from "react";
import { GLOBAL_START } from "../constants/time";
import {
  AssignedToEvent,
  Contacts,
  GDocDataRow,
  MappedEvent,
  Translator,
} from "../types";
import { capitalizeName, deepMatch } from "../utils/strings";
import TranslatorWithContact from "./TranslatorWithContact";

export default function CalendarEvent({
  startTime,
  endTime,
  name,
  color,
  event,
  currentRoom,
  assigned,
  contacts,
}: {
  startTime: DateTime;
  endTime: DateTime;
  name: string;
  color: string;
  event: MappedEvent;
  currentRoom: string;
  assigned: AssignedToEvent;
  contacts: Contacts;
}) {
  // 1 row === half hour

  const DAYS_DIFF = Math.round(
    Math.abs(GLOBAL_START.diff(startTime, "days").as("days"))
  );

  const HOURS_DIFF = Math.abs(
    GLOBAL_START.diff(startTime.set({ day: GLOBAL_START.day })).as("hours") * 2
  );
  const DURATION = Math.abs(endTime.diff(startTime).as("hours") * 2);

  return (
    <>
      <div
        className={`relative p-0 m-0 flex col-span-1 col-start-${
          DAYS_DIFF + 1
        }  `}
        style={{ gridRow: `${HOURS_DIFF + 2} / span ${DURATION}` }}
      >
        <div
          style={{ background: color }}
          className="px-1 group absolute inset-1 shadow flex flex-col overflow-y-auto justify-start text-xs leading-1  "
        >
          <div className="mb-1 border-b w-full">
            <b>{event.event.event}</b>
          </div>
          {assigned.map((ass) => {
            console.log(ass.translator1);
            return (
              <div
                key={ass.job1 + ass.translator1.name}
                className="w-full flex pb-1 border-b gap-2 justify-between items-center"
              >
                <div className="w-max">
                  {ass.translator1.name === "" ||
                  !ass.translator1! ||
                  !ass.translator2 ||
                  ass.translator2.name === "" ? (
                    <span className="text-gray-400">Unassigned</span>
                  ) : (
                    <>
                      <TranslatorWithContact
                        contacts={contacts}
                        translator={ass.translator1}
                      />
                      {", "}
                      <TranslatorWithContact
                        contacts={contacts}
                        translator={ass.translator2}
                      />
                    </>
                  )}
                </div>
                <div className="p-0.5  bg-black w-max break-before-avoid whitespace-nowrap text-black text-[9px] font-mono  rounded-lg bg-opacity-20 border ">
                  {ass.languagePair.toUpperCase().replace("-", "/") ||
                    "Unknown"}
                </div>
              </div>
            );
          })}

          {/* <div>Job: {event.job1 || "Unknown"}</div> */}
          {/* <p className="text-blue-500 group-hover:text-blue-700">
          <time dateTime="2022-01-12T06:00">
            {startTime.toLocaleString(DateTime.TIME_24_SIMPLE)}
          </time>
        </p> */}
        </div>
      </div>
    </>
  );
}
