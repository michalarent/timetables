export default function CalendarTopbar() {
  return (
    <div
      //   ref={containerNav}
      className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
    >
      <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
        <button type="button" className="flex flex-col items-center pt-2 pb-3">
          M{" "}
          <span className="mt-1 flex h-5 w-5 items-center justify-center font-semibold text-gray-900">
            26
          </span>
        </button>
        <button type="button" className="flex flex-col items-center pt-2 pb-3">
          T{" "}
          <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
            27
          </span>
        </button>
        <button type="button" className="flex flex-col items-center pt-2 pb-3">
          W{" "}
          <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
            27
          </span>
        </button>
        <button type="button" className="flex flex-col items-center pt-2 pb-3">
          T{" "}
          <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
            28
          </span>
        </button>
        <button type="button" className="flex flex-col items-center pt-2 pb-3">
          F{" "}
          <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
            29
          </span>
        </button>
        <button type="button" className="flex flex-col items-center pt-2 pb-3">
          S{" "}
          <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
            30
          </span>
        </button>
        <button type="button" className="flex flex-col items-center pt-2 pb-3">
          S{" "}
          <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
            31
          </span>
        </button>
      </div>

      <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
        <div className="col-end-1 w-14" />
        <div className="flex items-center justify-center py-3">
          <span>
            Sun{" "}
            <span className="items-center justify-center font-semibold text-gray-900">
              26
            </span>
          </span>
        </div>
        <div className="flex items-center justify-center py-3">
          <span>
            Mon{" "}
            <span className="items-center justify-center font-semibold text-gray-900">
              27
            </span>
          </span>
        </div>
        <div className="flex items-center justify-center py-3">
          <span className="flex items-baseline">
            Tue{" "}
            <span className="ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
              28
            </span>
          </span>
        </div>
        <div className="flex items-center justify-center py-3">
          <span>
            Wed{" "}
            <span className="items-center justify-center font-semibold text-gray-900">
              29
            </span>
          </span>
        </div>
        <div className="flex items-center justify-center py-3">
          <span>
            Thu{" "}
            <span className="items-center justify-center font-semibold text-gray-900">
              30
            </span>
          </span>
        </div>
        <div className="flex items-center justify-center py-3">
          <span>
            Fri{" "}
            <span className="items-center justify-center font-semibold text-gray-900">
              31
            </span>
          </span>
        </div>
        <div className="flex items-center justify-center py-3">
          <span>
            Sat{" "}
            <span className="items-center justify-center font-semibold text-gray-900">
              1
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
