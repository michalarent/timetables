import { Menu, Transition } from "@headlessui/react";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import { PDFDownloadLink } from "@react-pdf/renderer";
import _ from "lodash";
import { Fragment } from "react";
import { Contacts, GDocData, MappedEvent, RoomMappedEvent } from "../types";
import AutocompleteRoom from "./AutocompleteRoom";
import AllPDFsButton from "./pdf/AllPDFsButton";
import AllPDFsButtonRooms from "./pdf/AllPDFsButtonRooms";
import Select from "./Select";
import TimeTablePDF from "./TimeTablePDF";
import TimeTablePDFRoom from "./TimeTablePDFRoom";

export default function CalendarHeaderRooms({
  currentRoom,
  setCurrentRoom,
  data,
  events,
  allRooms,
  gDoc,
  clearCalendarEvents,
  contacts,
}: {
  currentRoom: string;
  setCurrentRoom: (str: string) => void;
  data: any;
  events: RoomMappedEvent[] | undefined;
  allRooms: string[];
  clearCalendarEvents: () => void;
  gDoc: GDocData;
  contacts: Contacts;
}) {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <header className="relative z-40 flex flex-none items-center justify-between border-b border-gray-200 py-2 px-6">
      <h1 className="text-lg font-semibold text-gray-900">
        <time dateTime="2022-01">{currentRoom != null && currentRoom}</time>
      </h1>
      <div className="flex items-center">
        <div className="hidden md:ml-4 md:flex gap-4 md:items-center">
          <AutocompleteRoom
            currentRoom={currentRoom}
            allRooms={allRooms}
            setCurrentRoom={(t: string) => {
              setCurrentRoom(t);
              clearCalendarEvents();
            }}
          />

          <Select
            itemLabel={null}
            label={!currentRoom ? "Select Room" : currentRoom}
            onSelect={setCurrentRoom}
            options={allRooms}
          />
          <AllPDFsButtonRooms
            gDoc={gDoc}
            contacts={contacts}
            currentRoom={currentRoom}
            events={events}
          />
          {currentRoom && (
            <PDFDownloadLink
              document={
                <TimeTablePDFRoom
                  room={currentRoom}
                  contacts={contacts.data}
                  events={events}
                />
              }
              fileName={
                "Room_" +
                currentRoom
                  .split(" ")
                  .map((n) => _.capitalize(n))
                  .join("") +
                ".pdf"
              }
            >
              {({ blob, url, loading, error }) => (
                <button
                  type="button"
                  className="ml-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {currentRoom === "" && "PDF UNavailable"}
                  {loading && !error && "Loading PDF..."}
                  {currentRoom !== "" && error && "Error loading PDF..."}
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
