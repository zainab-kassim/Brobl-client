import { Loader2} from "lucide-react"



export default function ButtonLoader() {
  return (
    <>
      <div className=" text-lg text-white font-medium ">
        <Loader2 className="h-4 inline-block w-4 animate-spin" />
      </div>
    </>
  )
}
