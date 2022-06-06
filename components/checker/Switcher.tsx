/* This example requires Tailwind CSS v2.0+ */
import { Dispatch, SetStateAction, useState } from "react";
import { Switch } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Switcher({
  title,
  description,
  onChange,
  checked,
}: {
  title: string;
  description?: string;
  onChange: Dispatch<SetStateAction<boolean>>;
  checked: boolean;
}) {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex-grow flex flex-col">
        <Switch.Label
          as="span"
          className="text-sm font-medium text-gray-900"
          passive
        >
          {title}
        </Switch.Label>
        <Switch.Description as="span" className="text-sm text-gray-500">
          {description}
        </Switch.Description>
      </span>
      <Switch
        checked={checked}
        onChange={onChange}
        className={classNames(
          checked ? "bg-indigo-600" : "bg-gray-200",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            checked ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
