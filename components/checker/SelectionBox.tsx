import { Switch } from "@headlessui/react";
import _ from "lodash";
import { DateTime } from "luxon";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
  useState,
} from "react";
import { TIMETABLE } from "../../constants/time";
import contacts from "../../pages/api/contacts";
import { Contacts, GDocData, GDocDataRow } from "../../types";
import AllTranslatorsTable from "../AllTranslatorsTable";
import Select from "../Select";
import DatePicker from "./DatePicker";
import { initialState } from "./FreeChecker";
import RadioSelect from "./RadioSelect";
import SimpleSwitch from "./SimpleSwitch";
import Switcher from "./Switcher";

export default function SelectionBox({
  gDoc,
  contacts,
  globalFilter,
  setGlobalFilter,
}: {
  gDoc: GDocData;
  contacts: Contacts;
  globalFilter: typeof initialState;
  setGlobalFilter: Dispatch<SetStateAction<typeof initialState>>;
}) {
  useEffect(() => {
    if (globalFilter.startTime.day !== globalFilter.day.value) {
      setGlobalFilter((globalFilter) => ({
        ...globalFilter,
        startTime: globalFilter.startTime.set({ day: globalFilter.day.value }),
      }));
    }
    if (globalFilter.endTime.day !== globalFilter.day.value) {
      setGlobalFilter((globalFilter) => ({
        ...globalFilter,
        endTime: globalFilter.endTime.set({ day: globalFilter.day.value }),
      }));
    }
  }, [globalFilter.day]);

  const days = TIMETABLE();

  const [allDay, setAllDay] = useState(false);

  useEffect(() => {
    if (globalFilter.startTime.hour === 8 && globalFilter.endTime.hour === 20) {
      setAllDay(true);
    } else {
      setAllDay(false);
    }
  }, [globalFilter.startTime, globalFilter.endTime]);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2 mt-8 mb-8">
      <div className="w-full">
        <small className="text-gray-400">Dzień</small>

        <Select
          label={globalFilter.day.label.toLocaleString(
            DateTime.DATE_MED_WITH_WEEKDAY,
            {
              locale: "pl",
            }
          )}
          options={_.uniq(days.map((day) => day.day)).map((day) => {
            const dt = DateTime.fromObject({ day, month: 6, year: 2022 });
            return {
              value: dt,
              formatted: dt.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY, {
                locale: "pl",
              }),
            };
          })}
          onSelect={(option) =>
            setGlobalFilter((globalFilter) => ({
              ...globalFilter,
              day: {
                label: option.value,
                value: option.value.day,
              },
            }))
          }
          itemLabel={"formatted"}
        />
      </div>
      <div className={`flex items-center gap-2 w-full  `}>
        <div className="w-full">
          <small className="text-gray-400">Od</small>

          <DatePicker
            smallerThan={globalFilter.endTime}
            day={globalFilter.day.value}
            time={globalFilter.startTime}
            setTime={(time) =>
              setGlobalFilter((globalFilter) => ({
                ...globalFilter,
                startTime: time,
              }))
            }
          />
        </div>
        <div className="w-full">
          <small className="text-gray-400">Do</small>

          <DatePicker
            greaterThan={globalFilter.startTime}
            day={globalFilter.day.value}
            time={globalFilter.endTime}
            setTime={(time) =>
              setGlobalFilter((globalFilter) => ({
                ...globalFilter,
                endTime: time,
              }))
            }
          />
        </div>
        <div className="w-max">
          <small className="text-gray-400 w-max flex">Caly dzien?</small>
          <div className={`h-10 flex items-center justify-center`}>
            <div className="mt-2">
              <SimpleSwitch
                enabled={allDay}
                onChange={(val) => {
                  setGlobalFilter((globalFilter) => ({
                    ...globalFilter,
                    startTime: globalFilter.startTime.set({
                      hour: 8,
                      minute: 0,
                      day: globalFilter.day.value,
                    }),
                    endTime: globalFilter.endTime.set({
                      hour: 20,
                      minute: 0,
                      day: globalFilter.day.value,
                    }),
                  }));
                  setAllDay(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mb-2">
        <small className="text-gray-400">Języki</small>

        <Select
          label={"Języki"}
          onSelect={(option: string) => {
            setGlobalFilter((globalFilter) => ({
              ...globalFilter,
              languages: [...globalFilter.languages, option],
            }));
          }}
          itemLabel={null}
          options={contacts.allUniqueLanguages || []}
        />
        <div className="mt-2 gap-1 flex flex-wrap">
          {globalFilter.languages.map((l: string) => (
            <span
              key={l}
              className="inline-flex items-center py-0.5 pl-2 pr-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
            >
              {l.toUpperCase()}
              <button
                onClick={() => {
                  setGlobalFilter((globalFilter) => ({
                    ...globalFilter,
                    languages: globalFilter.languages.filter(
                      (lang) => lang !== l
                    ),
                  }));
                }}
                type="button"
                className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
              >
                <span className="sr-only">Remove small option</span>
                <svg
                  className="h-2 w-2"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 8 8"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    d="M1 1l6 6m0-6L1 7"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>
      <div className="w-full mb-2">
        <small className="text-gray-400">Języki</small>

        <Select
          label={"Języki"}
          onSelect={(option: string) => {
            setGlobalFilter((globalFilter) => ({
              ...globalFilter,
              locations: [...globalFilter.locations, option],
            }));
          }}
          itemLabel={null}
          options={contacts.allUniqueLocations || []}
        />
        <div className="mt-2 gap-1 flex flex-wrap">
          {globalFilter.locations.map((l: string) => (
            <span
              key={l}
              className="inline-flex items-center py-0.5 pl-2 pr-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
            >
              {l.toUpperCase()}
              <button
                onClick={() => {
                  setGlobalFilter((globalFilter) => ({
                    ...globalFilter,
                    locations: globalFilter.locations.filter(
                      (lang) => lang !== l
                    ),
                  }));
                }}
                type="button"
                className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
              >
                <span className="sr-only">Remove small option</span>
                <svg
                  className="h-2 w-2"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 8 8"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    d="M1 1l6 6m0-6L1 7"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* <div className="border-t w-full">
        <fieldset className="space-y-5">
          <legend className="sr-only">Notifications</legend>
          <Switcher
            title={"Obecni na miejscu"}
            description={"Tłumacze dostępni na miejscu podczas wydarzenia"}
          />
          <Switcher
            title={"Z możliwością dojazdu"}
            description={"Tłumacze z możliwością dojazdu do miejsca wydarzenia"}
          />
          <Switcher
            title={"Zdalni"}
            description={"Tłumacze dostępni tylko w formie zdalnej."}
          />
        </fieldset>
      </div> */}
    </div>
  );
}
const notificationMethods = [
  { id: "email", title: "Email" },
  { id: "sms", title: "Phone (SMS)" },
  { id: "push", title: "Push notification" },
];
