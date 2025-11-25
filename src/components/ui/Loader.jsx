import { LoaderFive } from "../../aceternity-ui/loader";

function Loader({ text }) {
  return <div className="flex justify-center items-center h-full w-full overflow-hidden backdrop-blur-2xl z-10 " >
    <LoaderFive text={text} />
  </div>
}

export default Loader;


