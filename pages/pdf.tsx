import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import useSWR, { SWRResponse } from "swr";
import TimeTablePDF from "../components/TimeTablePDF";
import { GDocData } from "../types";

export const getServerSideProps = withPageAuthRequired();

const Calendar = dynamic(() => import("../components/Calendar"), {
  ssr: false,
});

const Home = () => {
  const data: SWRResponse<{ data: [][] }> = useSWR("/api/hello", async () =>
    fetch("/api/hello").then((res) => res.json())
  );

  if (!data.data || !data.data.data) {
    return <div>Loading...</div>;
  }
  const gDoc = new GDocData(data.data.data);
  const allTranslators = gDoc.getAllTranslators();

  return (
    <ErrorBoundary fallback={<div>Error :D</div>}>
      {data.data ? (
        <TimeTablePDF
          translator={allTranslators[1].name}
          events={gDoc.getAllEventsForTranslator(allTranslators[1])}
        />
      ) : (
        // <Test data={data.data} />
        <div>Loading...</div>
      )}
    </ErrorBoundary>
  );
};

export default Home;
