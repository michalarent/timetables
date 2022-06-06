import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import useSWR, { SWRResponse } from "swr";
import TimeTablePDF from "../components/TimeTablePDF";
import TimeTablePDFRoom from "../components/TimeTablePDFRoom";
import { Contacts, GDocData } from "../types";

export const getServerSideProps = withPageAuthRequired();

const Calendar = dynamic(() => import("../components/Calendar"), {
  ssr: false,
});

const Home = () => {
  const data: SWRResponse<{ data: [][] }> = useSWR("/api/hello", async () =>
    fetch("/api/hello").then((res) => res.json())
  );

  const contacts: SWRResponse<{ data: [][] }> = useSWR(
    `/api/contacts`,
    async () => fetch("/api/contacts").then((res) => res.json())
  );

  if (!data.data || !data.data.data || !contacts.data || !contacts.data.data) {
    return <div>Loading...</div>;
  }
  const gDoc = new GDocData(data.data.data);
  const allTranslators = gDoc.getAllTranslators();
  const gContacts = new Contacts(contacts.data.data);

  return (
    <ErrorBoundary fallback={<div>Error :D</div>}>
      {data.data ? (
        <TimeTablePDF
          translator="Janowska-Moniuszko Elzbieta"
          events={gDoc.getAllEventsForTranslator({
            name: "janowska-moniuszko elżbieta",
            language: [],
          })}
        />
      ) : (
        // <Test data={data.data} />
        <div>Loading...</div>
      )}
    </ErrorBoundary>
  );
};

export default Home;
