import _ from "lodash";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import useSWR, { SWRResponse } from "swr";
import OnOff from "../components/checker/OnOff";
import SimpleSwitch from "../components/checker/SimpleSwitch";
import Switcher from "../components/checker/Switcher";
import Nav from "../components/Nav";
import { GDocData } from "../types";

const tabs = [
  {
    name: "Eventy bez sali",
    current: true,
  },
  {
    name: "Eventy z jednym tłumaczem",
    current: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function FreeRoomsPage() {
  const [currentTab, setTab] = useState(tabs[0]);

  const [
    showEventsWithoutBothTranslators,
    setShowEventsWithoutBothTranslators,
  ] = useState(false);
  const data: SWRResponse<{ data: [][] }> = useSWR("/api/hello", async () =>
    fetch("/api/hello").then((res) => res.json())
  );

  if (data.data === undefined) {
    return <div>Loading...</div>;
  }

  const gDoc = new GDocData(data.data.data);
  const allLanguagePairs = gDoc.getaAllLanguagePairs(data.data?.data);

  return (
    <div>
      <Nav />
      <div className="p-4">
        <div className="mb-8">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Candidates
          </h3>
          <div className="mt-3 sm:mt-4">
            <div className="sm:hidden">
              <label htmlFor="current-tab" className="sr-only">
                Select a tab
              </label>
              <select
                id="current-tab"
                name="current-tab"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                defaultValue={tabs.find((tab) => tab.current)?.name}
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <a
                    key={tab.name}
                    onClick={() => setTab(tab)}
                    className={classNames(
                      _.isEqual(tab, currentTab)
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                      "whitespace-nowrap pb-4 cursor-pointer px-1 border-b-2 font-medium text-sm"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
        {currentTab.name === "Eventy bez sali" && (
          <ul className="divide-y">
            {gDoc.findAllEventsWithoutARoom().map((event, index) => (
              <li
                key={event.event.event + index}
                className="grid grid-cols-[300px_1fr] p-1 even:bg-gray-100"
              >
                <div>
                  {event.date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY, {
                    locale: "pl",
                  })}{" "}
                  {event.event.start.toLocaleString(DateTime.TIME_24_SIMPLE)}-
                  {event.event.end.toLocaleString(DateTime.TIME_24_SIMPLE)}
                </div>

                <div>{event.event.event}</div>
              </li>
            ))}
          </ul>
        )}
        {currentTab.name === "Eventy z jednym tłumaczem" && (
          <div>
            <div className="flex items-center gap-1 mb-4">
              <small>Wszystkie wydarzenia z przypisanymi tłumaczami:</small>

              <OnOff
                enabled={showEventsWithoutBothTranslators}
                onChange={setShowEventsWithoutBothTranslators}
              />
            </div>
            <ul className="divide-y">
              {gDoc
                .findAllTranslatorPairsWithoutTwoTranslators()
                .filter((pair) => {
                  if (!showEventsWithoutBothTranslators) {
                    const pairs = Object.keys(pair.assigned).filter((key) => {
                      if (
                        (pair.assigned[key].translator1.name !== "" &&
                          pair.assigned[key].translator2.name === "") ||
                        (pair.assigned[key].translator1.name === "" &&
                          pair.assigned[key].translator2.name !== "")
                      ) {
                        return true;
                      }
                      return false;
                    });
                    return pairs.length > 0;
                  } else {
                    return true;
                  }
                })
                .map((pair, index) => {
                  const pairCount = Object.keys(pair.assigned).filter(
                    (key) =>
                      pair.assigned[key].translator1.name === "" ||
                      pair.assigned[key].translator2.name === ""
                  ).length;

                  return (
                    <li
                      key={pair.event.event + index}
                      className="grid grid-cols-[300px_1fr_1fr] p-1 even:bg-gray-100"
                    >
                      <div>
                        {pair.date.toLocaleString(
                          DateTime.DATE_MED_WITH_WEEKDAY,
                          {
                            locale: "pl",
                          }
                        )}{" "}
                        {pair.event.start.toLocaleString(
                          DateTime.TIME_24_SIMPLE
                        )}
                        -
                        {pair.event.end.toLocaleString(DateTime.TIME_24_SIMPLE)}
                      </div>
                      <div>{pair.event.event}</div>
                      <div>
                        <div>
                          {showEventsWithoutBothTranslators && (
                            <>
                              {pairCount}/
                              {allLanguagePairs.filter((pair) => pair !== "")
                                .length - 1}{" "}
                            </>
                          )}
                        </div>
                        {Object.keys(pair.assigned).map((key) => {
                          if (
                            (pair.assigned[key].translator1.name !== "" &&
                              pair.assigned[key].translator2.name === "") ||
                            (pair.assigned[key].translator1.name === "" &&
                              pair.assigned[key].translator2.name !== "")
                          ) {
                            return (
                              <div>
                                {key.toUpperCase()}: Tylko{" "}
                                {pair.assigned[key].translator1.name === ""
                                  ? pair.assigned[key].translator2.name
                                  : pair.assigned[key].translator1.name}{" "}
                              </div>
                            );
                          } else if (showEventsWithoutBothTranslators) {
                            return (
                              <div>
                                {key.toUpperCase()}:{" "}
                                {pair.assigned[key].translator1.name === "" &&
                                pair.assigned[key].translator2.name === ""
                                  ? "Brak"
                                  : pair.assigned[key].translator1.name +
                                    ", " +
                                    pair.assigned[key].translator2.name}
                              </div>
                            );
                          }
                        })}
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
