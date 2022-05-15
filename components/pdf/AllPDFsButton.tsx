import { Blob } from "buffer";
import saveAs from "file-saver";
import JSZip from "jszip";
import { useCallback, useEffect, useRef, useState } from "react";
import { GDocData, Translator } from "../../types";
import { findAllEventsForTranslator } from "../../utils/finders";

export default function AllPDFsButton({
  gDoc,
}: {
  gDoc: GDocData;
}): JSX.Element {
  const workerRef = useRef<Worker>();
  const [workerLoading, setWorkerLoading] = useState(false);
  const [workerProcessing, setWorkerProcessing] = useState(false);
  useEffect(() => {
    workerRef.current = new Worker(new URL("/worker.ts", import.meta.url));

    workerRef.current.onmessage = (evt) => {
      console.log(evt);
      setWorkerLoading(false);
      setWorkerProcessing(true);
      const blob = evt.data as Blob;
      saveAs(blob as any, "timetables.zip");
      setWorkerProcessing(false);
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

        gDoc.getAllTranslators().forEach((t) => {
          const events = gDoc.getAllEventsForTranslator(t);
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
      {workerLoading
        ? "Loading..."
        : workerProcessing
        ? "Processing..."
        : " Download all PDFs"}
    </button>
  );
}
