export default function Test() {
  console.log("Test component rendered");

  const message = "Yay"

  return (
    <div>
      <h1>Welcome to the Weather Alert App!</h1>
      <p>{message}</p>
    </div>
  );
}