import { Loader2,CircleDashed} from "lucide-react"



export default function Loader() {
  return (
    <div className="flex justify-evenly mt-60 ">
      <div className="loader text-xl text-zinc-500 font-medium ">
        <Loader2 className="h-7 inline-block w-7 animate-spin" />
      </div>
    </div>
  )
}
