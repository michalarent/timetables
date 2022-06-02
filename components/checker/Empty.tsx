import { PlusIcon, XIcon } from "@heroicons/react/solid";

export default function Empty({ onClick }: { onClick: () => void }) {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-medium text-gray-900">Brak wyników</h3>
      <p className="mt-1 text-sm text-gray-500">
        Nie znaleziono żadnych wyników spełniających podane kryteria.
      </p>
      <div className="mt-6"></div>
    </div>
  );
}
