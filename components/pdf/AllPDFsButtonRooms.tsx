import { Blob } from "buffer";
import saveAs from "file-saver";
import JSZip from "jszip";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Contact,
  Contacts,
  GDocData,
  MappedRoomEvent,
  RoomMappedEvent,
  Translator,
} from "../../types";
import { findAllEventsForTranslator } from "../../utils/finders";

export default function AllPDFsButtonRooms({
  gDoc,
  contacts,
  events,
  currentRoom,
}: {
  gDoc: GDocData;
  events: RoomMappedEvent[] | undefined;
  contacts: Contacts;
  currentRoom: string;
}): JSX.Element {
  const workerRef = useRef<Worker>();
  const [workerLoading, setWorkerLoading] = useState(false);
  const [workerProcessing, setWorkerProcessing] = useState(false);
  useEffect(() => {
    workerRef.current = new Worker(new URL("/workerRoom.ts", import.meta.url));

    workerRef.current.onmessage = (evt) => {
      console.log(evt);
      setWorkerLoading(false);
      setWorkerProcessing(true);
      const blob = evt.data as Blob;
      saveAs(blob as any, "rooms-timetables.zip");
      setWorkerProcessing(false);
    };
    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, [workerRef]);

  const handleWork = useCallback(
    (
      message: {
        events: RoomMappedEvent[];
        room: string;
        contacts: Contact[];
      }[]
    ) => {
      if (workerRef.current) {
        console.log(message);
        workerRef.current.postMessage(JSON.stringify(message));
      }
    },
    []
  );

  return (
    <button
      type="button"
      onClick={() => {
        const all: {
          events: RoomMappedEvent[];
          room: string;
          contacts: Contact[];
        }[] = [];

        gDoc.getAllRooms().forEach((t) => {
          const events = gDoc.getAllEventsForRoom(t);
          if (events) {
            all.push({
              events,
              room: t,
              contacts: contacts.data,
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
