import { Menu, Transition } from "@headlessui/react";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import { pdf, PDFDownloadLink, renderToFile } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import _ from "lodash";
import { Fragment } from "react";
import { LANGUAGE_PAIRS } from "../constants/language-pairs";
import { GDocData, MappedEvent, Translator } from "../types";
import {
  Event,
  findAllEventsForTranslator,
  findTranslatorsForLanguagePair,
} from "../utils/finders";
import { capitalizeName } from "../utils/strings";
import Autocomplete from "./Autocomplete";
import AllPDFsButton from "./pdf/AllPDFsButton";
import Select from "./Select";
import TimeTablePDF from "./TimeTablePDF";

export default function CalendarHeader({
  currentTranslator,
  currentLanguagePair,
  setTranslator,
  setLanguagePair,
  data,
  events,
  allTranslators,
  gDoc,
  clearCalendarEvents,
}: {
  currentTranslator: Translator | undefined;
  currentLanguagePair: string;
  setTranslator: (translator: Translator) => void;
  setLanguagePair: (langPair: string) => void;
  data: any;
  events: MappedEvent[] | undefined;
  allTranslators: Translator[];
  clearCalendarEvents: () => void;
  gDoc: GDocData;
}) {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <header className="relative z-40 flex flex-none items-center justify-between border-b border-gray-200 py-2 px-6">
      <h1 className="text-lg font-semibold text-gray-900">
        <time dateTime="2022-01">
          {currentTranslator != null &&
            capitalizeName(currentTranslator.name) +
              " " +
              currentTranslator.language.map((l) => l).join(", ")}
        </time>
      </h1>
      <div className="flex items-center">
        <div className="hidden md:ml-4 md:flex gap-4 md:items-center">
          <Autocomplete
            currentTranslator={currentTranslator}
            people={allTranslators}
            setCurrentTranslator={(t: any) => {
              clearCalendarEvents();
              setTranslator(t);
            }}
          />
          <Select
            label={
              currentLanguagePair === "" ? "Language Pair" : currentLanguagePair
            }
            itemLabel={null}
            onSelect={setLanguagePair}
            options={LANGUAGE_PAIRS}
          />
          <Select
            itemLabel={"name"}
            label={!currentTranslator ? "Translator" : currentTranslator?.name}
            onSelect={(t) => {
              clearCalendarEvents();
              setTranslator(t);
            }}
            options={findTranslatorsForLanguagePair(currentLanguagePair, data)}
          />
          <AllPDFsButton gDoc={gDoc} />
          {currentTranslator && (
            <PDFDownloadLink
              document={
                <TimeTablePDF
                  translator={currentTranslator?.name}
                  events={events}
                />
              }
              fileName={
                currentTranslator.name
                  .split(" ")
                  .map((n) => _.capitalize(n))
                  .join("") + ".pdf"
              }
            >
              {({ blob, url, loading, error }) => (
                <button
                  type="button"
                  className="ml-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {currentTranslator?.name === "" && "PDF UNavailable"}
                  {loading && !error && "Loading PDF..."}
                  {currentTranslator?.name !== "" &&
                    error &&
                    "Error loading PDF..."}
                  {!loading && !error && "Download PDF"}
                </button>
              )}
            </PDFDownloadLink>
          )}
        </div>
        <Menu as="div" className="relative ml-6 md:hidden">
          <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Create event
                    </a>
                  )}
                </Menu.Item>
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Go to today
                    </a>
                  )}
                </Menu.Item>
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Day view
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Week view
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Month view
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Year view
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}
