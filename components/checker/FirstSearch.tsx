import { PlusIcon, SearchIcon, XIcon } from "@heroicons/react/solid";

export default function FirstSearch({ onClick }: { onClick: () => void }) {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-medium text-gray-900">Uzyj filtrow </h3>
      <p className="mt-1 text-sm text-gray-500">
        Uzyj filtrow z lewej strony aby znaleźć kontakty.
      </p>
      <div className="mt-6">
        <button
          onClick={onClick}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <SearchIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Szukaj
        </button>
      </div>
    </div>
  );
}
