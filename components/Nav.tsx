/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Nav() {
  const router = useRouter();
  const navigation = [
    {
      name: "Individual Timetables",
      href: "/",
      current: router.pathname === "/",
    },
    { name: "Rooms", href: "/rooms", current: router.pathname === "/rooms" },
    {
      name: "All Translators",
      href: "/translators",
      current: router.pathname === "/translators",
    },
    {
      name: "Wolni",
      href: "/checker",
      current: router.pathname === "/checker",
    },
  ];
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <div className="h-atuo">
        <Disclosure as="nav" className="bg-white border-b border-gray-200">
          {({ open }) => (
            <>
              <div className=" mx-auto px-0">
                <div className="flex justify-between h-8">
                  <div className="flex">
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          passHref
                          aria-current={item.current ? "page" : undefined}
                        >
                          <a
                            className={classNames(
                              item.current
                                ? "border-indigo-500 text-gray-900"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                              "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            )}
                          >
                            {item.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
