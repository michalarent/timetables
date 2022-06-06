import { useState } from "react";
import { Switch } from "@headlessui/react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";

export default function OnOff({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className={`${enabled ? "bg-indigo-900" : "bg-indigo-700"}
          relative inline-flex h-[18px] w-[34px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${enabled ? "translate-x-4" : "translate-x-0"}
            pointer-events-none items-center justify-center inline-flex h-[14px] w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      >
        {enabled ? <CheckIcon className="w-3" /> : <XIcon className="w-3" />}
      </span>
    </Switch>
  );
}
