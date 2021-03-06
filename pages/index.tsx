import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";
import useSWR, { SWRResponse } from "swr";
import Nav from "../components/Nav";

export const getServerSideProps = withPageAuthRequired();

const Calendar = dynamic(() => import("../components/Calendar"), {
  ssr: false,
});

const Home = () => {
  const data: SWRResponse<{ data: [][] }> = useSWR("/api/hello", async () =>
    fetch("/api/hello").then((res) => res.json())
  );

  const contacts: SWRResponse<{ data: [][] }> = useSWR(
    "/api/contacts",
    async () => fetch("/api/contacts").then((res) => res.json())
  );

  return (
    <div className="flex flex-col w-full h-screen">
      <Nav />
      <ErrorBoundary fallback={<div>Error :D</div>}>
        {data.data && contacts.data ? (
          <Calendar
            data={data.data}
            contacts={contacts.data}
            isValidating={data.isValidating}
            mutate={data.mutate}
          />
        ) : (
          // <Test data={data.data} />
          <div>Loading...</div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default Home;
