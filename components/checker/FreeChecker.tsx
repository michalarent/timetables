import { SearchIcon } from "@heroicons/react/solid";
import _, { isEqual } from "lodash";
import { DateTime } from "luxon";
import { useEffect, useState, useTransition } from "react";
import { Contact, Contacts, GDocData, Translator } from "../../types";
import Empty from "./Empty";
import FirstSearch from "./FirstSearch";
import RadioSelect from "./RadioSelect";
import ResultTable from "./ResultTable";
import SelectionBox from "./SelectionBox";

export const initialState: {
  startTime: DateTime;
  endTime: DateTime;
  day: {
    value: number;
    label: DateTime;
  };
  languages: string[];
  locations: string[];
  selectedTranslators: "ALL" | "ASSIGNED" | "UNASSIGNED";
} = {
  startTime: DateTime.fromObject({
    hour: 8,
    minute: 0,
    day: 26,
    month: 6,
    year: 2022,
  }),
  endTime: DateTime.fromObject({
    hour: 20,
    minute: 0,
    day: 26,
    month: 6,
    year: 2022,
  }),
  day: {
    label: DateTime.fromObject({
      day: 26,
      month: 6,
      year: 2022,
    }),
    value: 26,
  },
  languages: [],
  locations: [],
  selectedTranslators: "ALL",
};

type MatchedContact = {
  type: "matched";
  translator: Translator;
  contact: Contact;
};

type UnmatchedContact = {
  type: "unmatched";
  contact: Contact;
};
export type MatchedOrUnmatched = MatchedContact | UnmatchedContact;

export default function FreeChecker({
  contacts,
  data,
  isValidating,
  mutate,
}: {
  contacts: any[][];
  data: any[][];
  isValidating: boolean;
  mutate: () => void;
}) {
  const contactData = new Contacts(contacts);
  const gDoc = new GDocData(data);

  const [isPending, startTransition] = useTransition();

  const [globalFilter, setGlobalFilter] =
    useState<typeof initialState>(initialState);

  const [globalFilterSnapshot, setGlobalFilterSnapshot] =
    useState<typeof initialState>();

  const [languages, setLanguages] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [translators, setTranslators] = useState<MatchedOrUnmatched[]>([]);

  const handleFirstSearch = () => {
    if (!hasSearched) {
      setHasSearched(true);
      setGlobalFilterSnapshot(globalFilter);
    }
  };

  const getTranslators = () => {
    handleFirstSearch();
    let returnArray: MatchedOrUnmatched[] = [];
    let contacts: Contact[] = globalFilter.languages.length
      ? contactData.filterByLanguages(globalFilter.languages)
      : contactData.data;

    contacts = globalFilter.locations.length
      ? contactData.filterByLocations(globalFilter.locations)
      : contacts;

    const matched: MatchedOrUnmatched[] = contacts.map((contact) => {
      const match = gDoc.matchTranslatorWithContact(contact);
      if (!match) {
        return {
          type: "unmatched",
          contact,
        };
      } else {
        return {
          type: "matched",
          translator: match,
          contact,
        };
      }
    });

    if (globalFilter.selectedTranslators === "ALL") {
      const matches = matched.filter((contact) => {
        if (contact.type === "unmatched") return true;
        return gDoc.checkIfTranslatorIsFree(
          globalFilter.startTime,
          globalFilter.endTime,
          contact.translator
        );
      });
      setTranslators(matches);
      return;
    }
    if (globalFilter.selectedTranslators === "ASSIGNED") {
      const matches = matched.filter((contact) => {
        if (contact.type === "unmatched") return false;
        return gDoc.checkIfTranslatorIsFree(
          globalFilter.startTime,
          globalFilter.endTime,
          contact.translator
        );
      });
      setTranslators(matches);
      return;
    }

    if (globalFilter.selectedTranslators === "UNASSIGNED") {
      const matches = matched.filter((contact) => {
        if (contact.type === "unmatched") return true;
        return false;
      });
      setTranslators(matches);
    }
  };

  return (
    <div className="grid grid-cols-[minmax(400px,_1fr)_3fr] divide-x h-full w-full">
      <div className="flex flex-col p-4 h-full">
        {!_.isEqual(globalFilter, initialState) ? (
          <button
            onClick={() => {
              setGlobalFilter(initialState);
              setGlobalFilterSnapshot(initialState);
            }}
            type="button"
            className="inline-flex items-center px-6 py-3 border w-full justify-center border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Resetuj filtry
          </button>
        ) : (
          <button
            onClick={() => {
              setGlobalFilter(initialState);
            }}
            type="button"
            className="inline-flex pointer-events-none opacity-0 items-center px-6 py-3 border w-full justify-center border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Resetuj filtry
          </button>
        )}
        <div className="h-full overflow-auto relative">
          <div className="absolute justify-between flex flex-col top-0 min-h-full w-full overflow-auto">
            <SelectionBox
              gDoc={gDoc}
              contacts={contactData}
              globalFilter={globalFilter}
              setGlobalFilter={(globalFilter) => {
                setGlobalFilter(globalFilter);
              }}
            />
            <div className="flex h-full flex-col gap-2 w-full ">
              <RadioSelect
                filter={globalFilter.selectedTranslators}
                setFilter={(val) => {
                  setGlobalFilter((globalFilter) => ({
                    ...globalFilter,
                    selectedTranslators: val,
                  }));
                }}
              />
              <button
                onClick={() => {
                  startTransition(() => {
                    handleFirstSearch();
                    getTranslators();
                    setGlobalFilterSnapshot(globalFilter);
                  });
                }}
                type="button"
                className="inline-flex items-center px-6 py-3 border w-full justify-center border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <SearchIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                Szukaj
              </button>
              <small className="text-center w-full mt-1 text-gray-500">
                {!_.isEqual(globalFilter, globalFilterSnapshot) ? (
                  "Zmieniono filtry. Wcisnij guzik, aby zobaczyc zmiany."
                ) : (
                  <span className="text-transparent">Nic</span>
                )}
              </small>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full relative h-full overflow-x-hidden">
        {isPending && (
          <div className="absolute z-20 top-0 left-0 w-full h-full opacity-10 bg-gray-500" />
        )}
        <div className="h-full absolute w-full">
          <ResultTable filteredContacts={translators} />
          {translators.length === 0 && (
            <div className="h-80 w-full flex items-center justify-center">
              {!hasSearched ? (
                <FirstSearch onClick={getTranslators} />
              ) : (
                <Empty onClick={() => setGlobalFilter(initialState)} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
