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
      <Tippy
        trigger="click"
        delay={[0, 0]}
        duration={[0, 0]}
        hideOnClick
        inertia
        animation="scale"
        content={
          <Transition
            as={"div"}
            show
            appear
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <div className="p-2 rounded-lg text-sm bg-gray-200 text-black">
              <div>Room: {event.room}</div>
              <div className="font-medium">{name}</div>
              <div className="text-xs">Starts At:</div>
              <div className="text-xs">
                {startTime.toLocaleString(DateTime.TIME_24_SIMPLE)}
              </div>
              <div className="text-xs">Ends At:</div>
              <div className="text-xs">
                {endTime.toLocaleString(DateTime.TIME_24_SIMPLE)}
              </div>
              <div>{event.translator1.name}</div>
              <div>{event.translator2.name}</div>

              {/* <p>
                  {event.pair
                    .filter((pair: string) => pair !== null)
                    .map((p: Translator) => capitalizeName(p.name))
                    .join(", ")}
                </p> */}
            </div>
          </Transition>
        }
      >
        <div
          className={`relative p-0 m-0 flex col-span-1 col-start-${
            DAYS_DIFF + 1
          }  `}
          style={{ gridRow: `${HOURS_DIFF + 2} / span ${DURATION}` }}
        >
          <a
            href="#"
            style={{ background: color }}
            className="px-1 group absolute inset-1 shadow flex flex-col overflow-y-auto justify-start text-xs leading-1  "
          >
            {assigned.map((ass) => {
              console.log(ass.translator1);
              return (
                <div
                  key={ass.job1 + ass.translator1.name}
                  className="  flex pb-1 border-b justify-between items-center"
                >
                  <div>
                    {ass.translator1.name === "" &&
                    ass.translator2.name === "" ? (
                      <span className="text-gray-400">Unassigned</span>
                    ) : (
                      <>
                        <TranslatorWithContact
                          contacts={contacts}
                          translator={ass.translator1}
                        />
                        + {ass.translator2.name}
                      </>
                    )}{" "}
                  </div>
                  <div className="p-0.5 bg-black font-mono w-max text-black rounded-lg bg-opacity-20 border ">
                    {ass.languagePair || "Unknown"}
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
          </a>
        </div>
      </Tippy>
    </>
  );
}
