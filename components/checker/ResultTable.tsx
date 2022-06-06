import {
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
} from "@heroicons/react/solid";
import _ from "lodash";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Contact, Contacts, GDocData, Translator } from "../../types";
import Copy from "../Copy";
import { MatchedOrUnmatched } from "./FreeChecker";

export default function ResultTable({
  filteredContacts,
}: {
  filteredContacts: MatchedOrUnmatched[];
}) {
  const [sort, setSort] = useState<string>("name-desc");

  return (
    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className=" inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden  shadow ring-1 ring-black ring-opacity-5 ">
          <table className=" min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50 ">
              <tr className="">
                <th
                  scope="col"
                  className="sticky top-0 z-10 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  <a className="group inline-flex">Name</a>
                </th>
                <th
                  scope="col"
                  className="px-3 sticky top-0 z-10 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  <a className="group inline-flex">Email</a>
                </th>
                <th
                  scope="col"
                  className="px-3 sticky top-0 z-10 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Phone
                    <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                      <ChevronDownIcon
                        className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </th>

                <th
                  scope="col"
                  className="px-3 sticky top-0 z-10 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Location
                    <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                      <ChevronDownIcon
                        className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </th>
                <th
                  scope="col"
                  className="px-3 sticky top-0 z-10 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Role
                    <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                      <ChevronDownIcon
                        className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10 py-3.5 pl-3 pr-4 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredContacts
                .filter(
                  (p) =>
                    p != null && p.contact.fullName != "undefined undefined"
                )
                .map((person, index) => {
                  return (
                    <tr
                      key={
                        person.contact.email
                          ? person.contact.email + "_" + index
                          : index
                      }
                    >
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6">
                        {person.contact.fullName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs  text-gray-500">
                        <div className="inline-flex items-center gap-2">
                          {person.contact.email}{" "}
                          <Copy text={person.contact.email} />
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-500 ">
                        <div className="inline-flex items-center gap-2">
                          {_.isEmpty(person.contact.phone) ? (
                            "-"
                          ) : (
                            <>
                              {person.contact.phone}{" "}
                              <Copy text={person.contact.phone} />
                            </>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-500">
                        <div className="inline-flex items-center gap-2">
                          {person.contact.location}{" "}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-500">
                        {person.contact.languagePairs.map((str, index) => {
                          return (
                            <span key={str + index}>
                              {str}{" "}
                              {index !==
                                person.contact.languagePairs.length - 1 && ", "}
                            </span>
                          );
                        }) || "Nie znaleziono"}
                      </td>

                      <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 justify-end flex gap-2">
                        {person.type === "matched" ? (
                          <Link href={`/?t=${person.translator.name}`} passHref>
                            <a target="_blank" rel="noreferrer">
                              <button
                                type="button"
                                className="inline-flex gap-1 items-center px-3 py-1 min-w-[100px] justify-center border border-transparent text-xs font-medium rounded-full shadow-sm text-indigo-600 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Show Timetable{" "}
                                <CalendarIcon className="w-4 h-4" />
                              </button>
                            </a>
                          </Link>
                        ) : (
                          <div>Wolny/a, 0 eventow</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
