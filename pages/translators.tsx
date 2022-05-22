import useSWR, { SWRResponse } from "swr";
import AllTranslatorsTable from "../components/AllTranslatorsTable";
import Nav from "../components/Nav";
import { Contacts, GDocData } from "../types";

export default function TranslatorsPage() {
  const data: SWRResponse<{ data: [][] }> = useSWR("/api/hello", async () =>
    fetch("/api/hello").then((res) => res.json())
  );

  const contacts: SWRResponse<{ data: [][] }> = useSWR(
    "/api/contacts",
    async () => fetch("/api/contacts").then((res) => res.json())
  );

  if (!data.data || !contacts.data) {
    return <div>Loading...</div>;
  }

  const gDoc = new GDocData(data.data.data);
  const allContacts = new Contacts(contacts.data.data);

  const allTranslators = gDoc.getAllTranslators();
  return (
    <div className="flex flex-col w-full h-screen">
      <Nav />
      <AllTranslatorsTable
        mutate={() => {
          data.mutate();
          contacts.mutate();
        }}
        allTranslators={allTranslators}
        allContacts={allContacts}
      />
    </div>
  );
}
