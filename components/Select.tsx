import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment } from "react";
import { Translator } from "../types";

export default function Select({
  label,
  options,
  onSelect,
  itemLabel,
}: {
  label: string;
  options: any[];
  onSelect: (value: any) => void;
  itemLabel: string | null;
}) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
            ${open ? "" : "text-opacity-90"}
            items-center border h-10 flex gap-1 w-full justify-between border-gray-300 bg-white px-3.5 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative`}
          >
            <span className="w-full text-center">{label}</span>
            <ChevronDownIcon
              className={`${open ? "" : "text-opacity-70"}
              ml-2 h-5 w-5 block right-2 transition duration-150 ease-in-out group-hover:text-opacity-80`}
              aria-hidden="true"
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute w-full  left-0 bg-white  z-10 mt-3  max-w-sm transform sm:px-0 lg:max-w-3xl">
              <div className="overflow-scroll w-full max-h-[300px] rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative">
                  {options.map((item: any) => (
                    <div
                      key={itemLabel ? item[itemLabel] : item}
                      className="py-2 px-10 hover:brightness-90 w-full flex justify-center bg-white cursor-pointer"
                      onClick={() => onSelect(item)}
                    >
                      <div className="text-sm  w-full flex items-center justify-center font-medium text-gray-900">
                        {itemLabel ? item[itemLabel] : item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
