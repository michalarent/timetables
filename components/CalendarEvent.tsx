import { Transition } from "@headlessui/react";
import Tippy from "@tippyjs/react";
import { DateTime } from "luxon";
import { Fragment } from "react";
import { GLOBAL_START } from "../constants/time";
import { GDocDataRow, MappedEvent, Translator } from "../types";
import { capitalizeName, deepMatch } from "../utils/strings";

export default function CalendarEvent({
  startTime,
  endTime,
  name,
  color,
  event,
  currentTranslator,
}: {
  startTime: DateTime;
  endTime: DateTime;
  name: string;
  color: string;
  event: MappedEvent;
  currentTranslator: Translator;
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
      <Transition
        as={Fragment}
        show
        appear
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
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
                <div className="font-medium">{name}</div>
                <div className="text-xs">Starts At:</div>
                <div className="text-xs">
                  {startTime.toLocaleString(DateTime.TIME_24_SIMPLE)}
                </div>
                <div className="text-xs">Ends At:</div>
                <div className="text-xs">
                  {endTime.toLocaleString(DateTime.TIME_24_SIMPLE)}
                </div>
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
            className={`relative p-0 m-0 flex col-span-1 sm:col-start-${
              DAYS_DIFF + 1
            } sm:col-end-${DAYS_DIFF + 2} `}
            style={{ gridRow: `${HOURS_DIFF + 2} / span ${DURATION}` }}
          >
            <a
              href="#"
              style={{ background: color }}
              className="px-1 group absolute inset-1 shadow flex flex-col overflow-y-auto justify-start text-xs leading-1  "
            >
              <div className="  flex pb-1 border-b justify-between items-center">
                <div>Room: {event.room || "Unknown"}</div>
                <div className="p-0.5 bg-black text-black rounded-lg bg-opacity-20 border ">
                  {event.languagePair || "Unknown"}
                </div>
              </div>
              <div>
                with{" "}
                {deepMatch(event.translator1.name, currentTranslator.name)
                  ? event.translator2.name
                  : event.translator1.name}
              </div>
              <div className="order-1 font-semibold text-black">{name}</div>
              {/* <div>Job: {event.job1 || "Unknown"}</div> */}
              {/* <p className="text-blue-500 group-hover:text-blue-700">
          <time dateTime="2022-01-12T06:00">
            {startTime.toLocaleString(DateTime.TIME_24_SIMPLE)}
          </time>
        </p> */}
            </a>
          </div>
        </Tippy>
      </Transition>
    </>
  );
}
