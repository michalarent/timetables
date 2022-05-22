import { Transition } from "@headlessui/react";
import {
  CalendarIcon,
  ClipboardCopyIcon,
  DuplicateIcon,
  MailIcon,
  PhoneIcon,
} from "@heroicons/react/solid";
import Tippy from "@tippyjs/react/headless";
import { useMemo } from "react";
import { Contacts, Translator } from "../types";
import useClipboard from "react-use-clipboard";
import Copy from "./Copy";
import Link from "next/link";

export default function TranslatorWithContact({
  translator,
  contacts,
}: {
  translator: Translator;
  contacts: Contacts;
}) {
  const contactData = useMemo(() => {
    const contact = contacts.findByName(translator.name);
    return contact;
  }, [translator, contacts]);

  return (
    <Tippy
      interactive
      delay={[0, 0]}
      duration={[0, 0]}
      inertia
      popperOptions={{
        placement: "bottom",
        strategy: "fixed",
      }}
      render={(attrs) => (
        <div
          className="p-2 cursor-default shadow-lg rounded-lg text-sm bg-gray-200 text-black"
          {...attrs}
        >
          <b>{translator.name}</b>
          <div className="flex items-center gap-1 ">
            <MailIcon className="w-3 h-3" />{" "}
            {contactData?.email || "Nie znaleziono"}{" "}
            {contactData && <Copy text={contactData.email} />}
          </div>
          <div className="flex items-center gap-1 ">
            <PhoneIcon className="w-3 h-3" />{" "}
            {contactData?.phone || "Nie znaleziono"}{" "}
            {contactData && <Copy text={contactData.phone} />}
          </div>
          <div className="border-t border-gray-300 mt-2 w-full">
            {contactData?.languagePairs.map((pair, index) => (
              <span key={pair + index}>
                {pair}
                {index !== contactData.languagePairs.length - 1 && ", "}
              </span>
            ))}
          </div>
          <Link href={`/?t=${translator.name}`} passHref>
            <a target="_blank" rel="noreferrer">
              <button
                type="button"
                className="inline-flex w-full mt-3 gap-1 items-center px-3 py-1 min-w-[100px] justify-center border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Show Timetable <CalendarIcon className="w-4 h-4" />
              </button>
            </a>
          </Link>
        </div>
      )}
    >
      <span>{translator.name}</span>
    </Tippy>
  );
}
