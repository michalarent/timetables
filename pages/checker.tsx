import useSWR, { SWRResponse } from "swr";
import AllTranslatorsTable from "../components/AllTranslatorsTable";
import DatePicker from "../components/checker/DatePicker";
import FreeChecker from "../components/checker/FreeChecker";
import SelectionBox from "../components/checker/SelectionBox";
import Nav from "../components/Nav";

export default function Checker() {
  const data: SWRResponse<{ data: [][] }> = useSWR("/api/hello", async () =>
    fetch("/api/hello").then((res) => res.json())
  );
  const contacts: SWRResponse<{ data: [][] }> = useSWR(
    "/api/contacts",
    async () => fetch("/api/contacts").then((res) => res.json())
  );

  return (
    <div className="flex flex-col overflow-hidden w-full h-screen">
      <Nav />
      {data.data && contacts.data ? (
        <FreeChecker
          data={data.data.data}
          contacts={contacts.data.data}
          isValidating={data.isValidating || contacts.isValidating}
          mutate={() => {
            data.mutate();
            contacts.mutate();
          }}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
