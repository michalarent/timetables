export default function CalendarSidebar({
  startHour,
  endHour,
}: {
  startHour: number;
  endHour: number;
}) {
  const length = endHour - startHour;
  return (
    <>
      {[...Array(length)].map((hour, index) => {
        return (
          <>
            <div>
              <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                {index + startHour}:00
              </div>
            </div>
            <div />
          </>
        );
      })}
    </>
  );
}
