import TypeAhead from "./Components/TypeAhead";

export default function App() {
  const options = [
    { label: "Adam", value: "Adam" },
    { label: "Naeem", value: "Naeem" },
    { label: "Ren", value: "Ren" },
    { label: "Ryan", value: "Ryan" },
    { label: "Gaby", value: "Gaby" },
    { label: "MJ", value: "MJ" },
    { label: "Fernando", value: "Fernando" }
  ];
  const placeholder = "Search for a team member...";
  const label = "Team Member";

  return (
    <TypeAhead options={options} placeholder={placeholder} isSearchable={true} label={label}/>
  );
}
