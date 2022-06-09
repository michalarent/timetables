import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RefreshIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Contacts, GDocData, Translator } from "../types";
import Copy from "./Copy";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

export default function AllTranslatorsTable({
  allTranslators,
  allContacts,
  gDocData,
  mutate,
  isValidating,
}: {
  allTranslators: Translator[];
  allContacts: Contacts;
  gDocData: GDocData;
  mutate: () => void;
  isValidating: boolean;
}) {
  const [sort, setSort] = useState<string>("name-desc");
  const translatorsWithContacts = useMemo(() => {
    return allTranslators
      .map((t) => {
        const contact = allContacts.findByName(t.name);
        return {
          ...t,
          contact: {
            ...contact,
            email: contact?.email?.toLowerCase(),
          },
        };
      })
      .filter((t) => t.contact?.email);
  }, [allTranslators, allContacts]);

  const translatorsWithoutContacts = useMemo(() => {
    return allTranslators
      .filter((t) => !allContacts.findByName(t.name))
      .map((t) => ({
        ...t,
        contact: undefined,
      }));
  }, [allTranslators, allContacts]);

  const sortedTranslators = useMemo(() => {
    const sorted = () => {
      switch (sort) {
        case "name-desc":
          return translatorsWithContacts.sort((a, b) => {
            if (!b.contact || !a.contact) {
              return 0;
            }
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
        case "name-asc":
          return translatorsWithContacts.sort((a, b) => {
            if (!b.contact || !a.contact) {
              return 0;
            }
            if (a.name < b.name) {
              return 1;
            }
            if (a.name > b.name) {
              return -1;
            }
            return 0;
          });

        case "email-desc":
          return translatorsWithContacts.sort((a, b) => {
            if (!b.contact || !a.contact) {
              return 0;
            }

            if (!a.contact?.email || !b.contact?.email) {
              return 0;
            }
            if (a.contact?.email < b.contact?.email) {
              return -1;
            }
            if (a.contact?.email > b.contact?.email) {
              return 1;
            }
            return 0;
          });
        case "email-asc":
          return translatorsWithContacts.sort((a, b) => {
            if (!b.contact || !a.contact) {
              return 0;
            }
            if (!a.contact.email || !b.contact.email) {
              return 0;
            }
            if (a.contact.email < b.contact.email) {
              return 1;
            }
            if (a.contact.email > b.contact.email) {
              return -1;
            }
            return 0;
          });
      }
    };
    return sorted();
  }, [sort, translatorsWithContacts]);

  return (
    <div className="px-4 py-4  sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Wszyscy tłumacze
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista wszystkich tłumaczy znalezionych w zakładce Główne, tam gdzie
            znaleziono, z kontaktami z zakładki Kontakty.
            <br />
            Tu działają bardzo proste algorytmy dopasowywania tekstu, czyli
            porównuję to co znalazłem w zakładce Główne, z kontaktami z zakładki
            Kontakty. Jeśli ktoryś tlumacz ma inaczej zapisane imie/nazwisko w
            zakladce kontakty to wtedy nie dopasuje i trzeba zmienić dane w
            spreadsheecie
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={mutate}
            className="inline-flex gap-2 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-40"
          >
            {isValidating ? (
              <>
                Odświezam <RefreshIcon className="w-3 h-3 animate-spin" />
              </>
            ) : (
              <>
                Odswiez <RefreshIcon className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>
      {translatorsWithoutContacts.length > 0 && (
        <>
          <div className="sm:flex-auto mt-8">
            <h1 className="text-xl font-semibold text-gray-900">
              Niedopasowane kontakty
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Lista tłumaczy z zakładki Główne, które nie dopasowały się do
              kontaktów z zakładki Kontakty.
            </p>
          </div>
          <div className="mt-8">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          <a className="group inline-flex">Name</a>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          <a className="group inline-flex">Email</a>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {translatorsWithoutContacts
                        ?.filter((p) => p.name !== "")
                        .map((person) => {
                          const contact = allContacts.findByName(person.name);
                          const events =
                            gDocData.getAllEventsForTranslator(person);
                          return (
                            <tr
                              key={person.name}
                              className={contact ? "" : "bg-red-100"}
                            >
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {person.name}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {contact ? (
                                  <div className="inline-flex items-center gap-2">
                                    {contact.email}{" "}
                                    <Copy text={contact.email} />
                                  </div>
                                ) : (
                                  "nie znaleziono"
                                )}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                                {contact ? (
                                  <div className="inline-flex items-center gap-2">
                                    {contact.phone}{" "}
                                    <Copy text={contact.phone} />
                                  </div>
                                ) : (
                                  "nie znaleziono"
                                )}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {contact?.languagePairs.map((str, index) => {
                                  return (
                                    <span key={str + index}>
                                      {str}{" "}
                                      {index !==
                                        contact.languagePairs.length - 1 &&
                                        ", "}
                                    </span>
                                  );
                                }) || "Nie znaleziono"}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 justify-end flex gap-2">
                                <div className="flex items-center gap-2">
                                  <div>Attends {events.length} events </div>
                                  <Link href={`/?t=${person.name}`} passHref>
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
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      <a className="group inline-flex">
                        Name
                        {sort === "name-desc" || sort === "name-asc" ? (
                          <span
                            onClick={() => {
                              if (sort === "name-desc") {
                                setSort("name-asc");
                              } else {
                                setSort("name-desc");
                              }
                            }}
                            className="ml-2 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300"
                          >
                            {sort === "name-asc" && (
                              <ChevronDownIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                            {sort === "name-desc" && (
                              <ChevronUpIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        ) : (
                          <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                            <ChevronDownIcon
                              onClick={() => setSort("email-desc")}
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <a className="group inline-flex">
                        Email
                        {sort === "email-desc" || sort === "email-asc" ? (
                          <span
                            onClick={() => {
                              if (sort === "email-desc") {
                                setSort("email-asc");
                              } else {
                                setSort("email-desc");
                              }
                            }}
                            className="ml-2 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300"
                          >
                            {sort === "email-asc" && (
                              <ChevronDownIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                            {sort === "email-desc" && (
                              <ChevronUpIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        ) : (
                          <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                            <ChevronDownIcon
                              onClick={() => setSort("email-desc")}
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedTranslators
                    ?.filter((p) => p.name !== "")
                    .map((person) => {
                      const contact = allContacts.findByName(person.name);
                      const events = gDocData.getAllEventsForTranslator(person);
                      return (
                        <tr
                          key={person.name}
                          className={contact ? "" : "bg-red-100"}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {person.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {contact ? (
                              <div className="inline-flex items-center gap-2">
                                {contact.email} <Copy text={contact.email} />
                              </div>
                            ) : (
                              "nie znaleziono"
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                            {contact ? (
                              <div className="inline-flex items-center gap-2">
                                {contact.phone} <Copy text={contact.phone} />
                              </div>
                            ) : (
                              "nie znaleziono"
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {contact?.languagePairs.map((str, index) => {
                              return (
                                <span key={str + index}>
                                  {str}{" "}
                                  {index !== contact.languagePairs.length - 1 &&
                                    ", "}
                                </span>
                              );
                            }) || "Nie znaleziono"}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 justify-end flex gap-2">
                            <div className="flex items-center gap-2">
                              <div>Attends {events.length} events </div>
                              <Link href={`/?t=${person.name}`} passHref>
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
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
