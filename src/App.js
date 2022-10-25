import TypeAhead from "./Components/TypeAhead";
import MyTypeAhead from './Components/MyTypeAhead/MyTypeAhead';
import { useForm } from 'react-hook-form'

export default function App() {
  const nameOptions = [
    { label: "Adam", value: "Adam" },
    { label: "Naeem", value: "Naeem" },
    { label: "Ren", value: "Ren" },
    { label: "Ryan", value: "Ryan" },
    { label: "Gaby", value: "Gaby" },
    { label: "MJ", value: "MJ" },
    { label: "Fernando", value: "Fernando" }
  ];

  const cityOptions = [
    { label: "New York", value: "New York" },
    { label: "Atlanta", value: "Atlanta" },
    { label: "Los Angeles", value: "Los Angeles" },
    { label: "Chicago", value: "Chicago" },
    { label: "Houston", value: "Houston" },
    { label: "Charlotte", value: "Charlotte" },
    { label: "Seattle", value: "Seattle" }
  ];

  const { register, getValues, watch, setValue } = useForm({defaultValues: { name: '', city: '' }});
  return (
    <form>
      {/* <TypeAhead register={register} watch={watch} setValue={setValue} fieldName={'name'} options={nameOptions} placeholder={"Search for a team member..."} isSearchable={true} label={"Team Member"}/> */}
      {/* <TypeAhead register={register} watch={watch} setValue={setValue} fieldName={'city'} options={cityOptions} placeholder={"Search for a city member..."} isSearchable={true} label={"City"}/> */}
      <button onClick={(e) => {
        e.preventDefault();
        console.log(getValues());
      }}>
        GET VALUES
      </button>
      <MyTypeAhead register={register} watch={watch} setValue={setValue} fieldName={'name'} options={nameOptions} placeholder={"Search for a team member..."} isSearchable={true} label={"Team Member"}/>
    </form>
  );
}
