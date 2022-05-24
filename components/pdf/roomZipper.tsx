import { pdf, renderToStream } from "@react-pdf/renderer";
import JSZip from "jszip";
import { Contact, Contacts, RoomMappedEvent, Translator } from "../../types";
import TimeTablePDF from "../TimeTablePDF";
import { saveAs } from "file-saver";
import _ from "lodash";
import TimeTablePDFRoom from "../TimeTablePDFRoom";

function base64convert(files: any) {
  console.clear();
  const reader = new FileReader();
  reader.onload = (e: any) => {
    console.log(e.target.result);
  };
  reader.readAsDataURL(files[0]);
}

export default async function roomZipper(
  message: {
    events: RoomMappedEvent[];
    room: string;
    contacts: Contact[];
  }[]
) {
  const zip = new JSZip();
  var folder = zip.folder("timetables");

  const blobs = await Promise.all(
    message.slice(0, 2).map(async (c) => {
      try {
        const name = c.room;

        const filename = name
          .split(" ")
          .map((n) => _.capitalize(n))
          .join("");

        const _file = await pdf(
          <TimeTablePDFRoom
            room={c.room}
            contacts={c.contacts}
            events={c.events}
          />
        ).toBlob();

        const blob = _file;

        const f = folder?.file(`Room_${filename}_timetable.pdf`, blob);
        return f;
      } catch (e) {
        console.log(e);
      }
    })
  );

  let z;
  try {
    z = await zip.generateAsync({ type: "blob" });
  } catch (e) {
    console.log(e);
  }

  console.log(z);
  return z;
}
