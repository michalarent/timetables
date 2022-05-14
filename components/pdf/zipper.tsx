import { pdf } from "@react-pdf/renderer";
import JSZip from "jszip";
import { Translator } from "../../types";
import TimeTablePDF from "../TimeTablePDF";

export default async function zipper(
  message: { translator: Translator; events: any[] }[]
) {
  const zip = new JSZip();
  var folder = zip.folder("timetables");
  const blobs = await Promise.all(
    message.map((c) => {
      return zip.file(
        c.translator.name + ".pdf",
        pdf(
          <TimeTablePDF translator={c.translator.name} events={c.events} />
        ).toBlob()
      );
    })
  );

  return blobs;
}
