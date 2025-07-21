import { UsersIcon } from "../../icons/UsersIcon";
import { PaperIcon } from "../../icons/PaperIcon";

export default function FetchedDetails({ data }) {
  return (
    <div className="flex items-center gap-2 font-light">
      <div
        title="popularity"
        className="flex justify-center items-center gap-0.5 border border-white/10 rounded-sm px-1 backdrop-blur-lg"
      >
        <UsersIcon size={14} className={"-translate-y-[5%]"} />
        <h3 className="text-[0.7rem]">{data.scrapedDetails.popularity}</h3>
      </div>
      <div
        title="mass"
        className="flex justify-center items-center gap-0.5 border border-white/10 rounded-sm px-1 backdrop-blur-lg"
      >
        <PaperIcon size={12} className={"-translate-y-[5%]"} />
        <h3 className="text-[0.7rem]">
          {parseInt(
            data.scrapedDetails.massText.replaceAll("\u00A0", " ").split(" ")[0]
          )}
          <span className="text-[0.5rem] ml-0.5 opacity-80">
            {
              data.scrapedDetails.massText
                .replaceAll("\u00A0", " ")
                .replaceAll("i", "")
                .split(" ")[1]
            }
          </span>
        </h3>
      </div>
    </div>
  );
}
