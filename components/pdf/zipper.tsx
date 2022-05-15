import { pdf } from "@react-pdf/renderer";
import JSZip from "jszip";
import { Translator } from "../../types";
import TimeTablePDF from "../TimeTablePDF";
import { saveAs } from "file-saver";

export default async function zipper(
  message: { translator: Translator; events: any[] }[]
) {
  const zip = new JSZip();
  var folder = zip.folder("timetables");
  const blobs = await Promise.all(
    message
      .filter((t) => t.translator.name !== "")

      .map((c) => {
        const name = c.translator.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return folder?.file(
          `${c.translator.name}.pdf`,
          pdf(<TimeTablePDF translator={name} events={c.events} />).toBlob()
        );
      })
  );
  console.log(blobs);
  let z;
  try {
    z = await zip.generateAsync({ type: "blob" });
  } catch (e) {
    console.log(e);
  }

  console.log(z);
  return z;
}
