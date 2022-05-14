import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";
import useSWR, { SWRResponse } from "swr";

export const getServerSideProps = withPageAuthRequired();

const Calendar = dynamic(() => import("../components/Calendar"), {
  ssr: false,
});

const Home = () => {
  const data: SWRResponse<{ data: [][] }> = useSWR("/api/hello", async () =>
    fetch("/api/hello").then((res) => res.json())
  );

  return (
    <ErrorBoundary fallback={<div>Error :D</div>}>
      {data.data ? (
        <Calendar
          data={data.data}
          isValidating={data.isValidating}
          mutate={data.mutate}
        />
      ) : (
        // <Test data={data.data} />
        <div>Loading...</div>
      )}
    </ErrorBoundary>
  );
};

export default Home;
