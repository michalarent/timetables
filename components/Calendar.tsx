import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
  RefreshIcon,
} from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import CalendarTopbar from "./CalendarTopbar";
import CalendarSidebar from "./CalendarSidebar";
import CalendarEvent from "./CalendarEvent";
import { DateTime } from "luxon";
import { colors } from "../styles/colors";
import CalendarHeader from "./CalendarHeader";
import {
  findAllEvents,
  findAllEventsForTranslator,
  findAllTranslators,
} from "../utils/finders";
import { LANGUAGE_PAIRS } from "../constants/language-pairs";
import { GDocData, Translator } from "../types";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
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

export default function Calendar({
  data,
  mutate,
  isValidating,
}: {
  data: { data: [][] };
  mutate: () => void;
  isValidating: boolean;
}) {
  const container = useRef(null);
  const containerNav = useRef(null);
  const containerOffset = useRef(null);
  const [currentTranslator, setCurrentTranslator] = useState<Translator>();
  const [currentLanguagePair, setCurrentLanguagePair] = useState<string>("");

  const gDoc = new GDocData(data.data);

  const allTranslators = useMemo(() => {
    const translators = gDoc.getAllTranslators();
    return translators;
  }, []);

  const allEvents = useMemo(() => {
    const events = gDoc.data.map((row) => {
      return row.event;
    });
    return events;
  }, []);

  const events = useMemo(() => {
    if (currentTranslator) {
      return gDoc.getAllEventsForTranslator(currentTranslator);
    }
  }, [currentTranslator, currentLanguagePair, data]);

  return (
    <div className="flex h-screen flex-col">
      <CalendarHeader
        data={data}
        setLanguagePair={setCurrentLanguagePair}
        setTranslator={setCurrentTranslator}
        currentTranslator={currentTranslator}
        currentLanguagePair={currentLanguagePair}
        events={events}
        allTranslators={allTranslators}
      />
      <div
        ref={container}
        className="flex flex-auto flex-col overflow-auto bg-white"
      >
        <div
          style={{ width: "165%" }}
          className="flex max-w-full h-full flex-none flex-col sm:max-w-none md:max-w-full"
        >
          <CalendarTopbar />
          <div className="flex flex-auto h-full">
            <div className="sticky left-0 h-full  z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto h-full grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 h-full col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: "repeat(24, 1fr)" }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                <CalendarSidebar startHour={8} endHour={20} />
              </div>

              {/* Vertical lines */}
              <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
                <div className="col-start-1 row-span-full" />
                <div className="col-start-2 row-span-full" />
                <div className="col-start-3 row-span-full" />
                <div className="col-start-4 row-span-full" />
                <div className="col-start-5 row-span-full" />
                <div className="col-start-6 row-span-full" />
                <div className="col-start-7 row-span-full" />
                <div className="col-start-8 row-span-full w-8" />
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid sm:grid-cols-7 sm:pr-8"
                style={{
                  gridTemplateRows: "1.75rem repeat(24, minmax(0, 1fr)) auto",
                }}
              >
                {currentTranslator &&
                  events?.map((event, index) => (
                    <CalendarEvent
                      key={event.event.event}
                      startTime={event.event.start}
                      endTime={event.event.end}
                      name={event.event.event}
                      color={palette[index % palette.length]}
                      event={event}
                      currentTranslator={currentTranslator}
                    />
                  ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="flex py-0.5 items-center text-xs justify-end px-2 gap-2  text-right border-t border-gray-200 bg-gray-100">
        <div>
          Total found:{" "}
          <span className="text-indigo-600 font-medium">
            {" "}
            {allTranslators.length} translators
          </span>{" "}
          and{" "}
          <span className="text-indigo-600 font-medium">
            {allEvents.length} events
          </span>
        </div>
        <button
          type="button"
          onClick={() => mutate()}
          className="inline-flex gap-1 items-center px-3 py-1 min-w-[100px] justify-center border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isValidating ? (
            <div className="h-4 flex items-center">
              <RefreshIcon className="w-3 h-3 animate-spin" />
            </div>
          ) : (
            <>
              Reload <RefreshIcon className="w-3 h-3" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
