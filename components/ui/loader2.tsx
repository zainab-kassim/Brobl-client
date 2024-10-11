import { Loader2,CircleDashed} from "lucide-react"



export default function ProfileLoader() {
  return (
    <div className="flex justify-evenly items-center h-1/2 xl:ml-60 lg:ml-56 md:ml-48 ml-32"> {/* Centering the loader */}
    <div className="loader text-xl text-zinc-500 font-medium flex items-center justify-center ">
      <Loader2 className="h-7 w-7 animate-spin" />
    </div>
  </div>
  )
}
