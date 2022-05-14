import saveAs from "file-saver";
import JSZip from "jszip";
import { useCallback, useEffect, useRef, useState } from "react";
import { Translator } from "../../types";
import { findAllEventsForTranslator } from "../../utils/finders";

export default function AllPDFsButton({
  allTranslators,
  data,
}: {
  allTranslators: Translator[];
  data: any;
}): JSX.Element {
  const workerRef = useRef<Worker>();
  const [workerLoading, setWorkerLoading] = useState(false);
  useEffect(() => {
    workerRef.current = new Worker(new URL("/worker.ts", import.meta.url));

    workerRef.current.onmessage = (evt) => {
      console.log(evt.data);
      const zip = new JSZip();
      zip.file("timetables.zip", evt.data);
      zip
        .generateAsync({ type: "blob" })
        .then((content) => {
          saveAs(content, "timetables.zip");
        })
        .then(() => {
          setWorkerLoading(false);
        });
    };
    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, [workerRef]);

  const handleWork = useCallback(
    (message: { translator: Translator; events: any[] }[]) => {
      if (workerRef.current)
        workerRef.current.postMessage(JSON.stringify(message));
    },
    []
  );

  return (
    <button
      type="button"
      onClick={() => {
        const all: { translator: Translator; events: any[] }[] = [];

        allTranslators.forEach((t) => {
          const events = findAllEventsForTranslator(t, data);
          if (events) {
            all.push({
              translator: t,
              events,
            });
          }
        });
        setWorkerLoading(true);
        handleWork(all);
      }}
      className="ml-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {workerLoading ? "Loading..." : " Download all PDFs"}
    </button>
  );
}
