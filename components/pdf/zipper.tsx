import { pdf } from "@react-pdf/renderer";
import JSZip from "jszip";
import _ from "lodash";
import { Translator } from "../../types";
import { capitalizeName, deepMatch } from "../../utils/strings";
import TimeTablePDF from "../TimeTablePDF";

export default async function zipper(
  message: { translator: Translator; events: any[] }[]
) {
  const zip = new JSZip();
  var folder = zip.folder("timetables");
  const blobs = await Promise.all(
    message
      .filter((t) => t.translator.name !== "")

      .map((c) => {
        let name = capitalizeName(c.translator.name);

        const filename = name
          .split(" ")
          .map((n) =>
            _.capitalize(n)
              .split("-")
              .map((n) => _.capitalize(n))
              .join("-")
          )
          .join("");
        return folder?.file(
          `${filename}_timetable.pdf`,
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
