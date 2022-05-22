import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ErrorBoundary } from "react-error-boundary";
import useSWR, { SWRResponse } from "swr";
import Calendar from "../components/Calendar";
import CalendarRooms from "../components/CalendarRooms";
import Nav from "../components/Nav";

export const getServerSideProps = withPageAuthRequired();
export default function Rooms() {
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
          <CalendarRooms
            contacts={contacts.data}
            data={data.data}
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
}
