export function IslamicPattern() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-[0.03] pointer-events-none">
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          backgroundSize: "100px 100px",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L100 50L50 100L0 50Z' fill='none' stroke='currentColor' stroke-width='1'/%3E%3Cpath d='M25 25L75 75M75 25L25 75' stroke='currentColor' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='currentColor' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
        className="text-foreground"
      />
    </div>
  );
}
