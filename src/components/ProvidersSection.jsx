import {
  AppleTvIcon,
  DisneyIcon,
  HboIcon,
  HuluIcon,
  NetflixIcon,
  ParamountIcon,
  PrimeIcon,
} from "../icons/streaming";

const iconMap = {
  Netflix: <NetflixIcon size={"100%"} className={"invert"} />,
  "Disney Plus": <DisneyIcon size={"100%"} className={"invert scale-[107%]"} />,
  Max: <HboIcon size={"100%"} className={"invert scale-[115%]"} />,
  "HBO Max": <HboIcon size={"100%"} className={"invert scale-[115%]"} />,
  Hulu: <HuluIcon size={"100%"} className={"invert scale-[90%]"} />,
  "Paramount Plus": (
    <div className="bg-white w-[80%] h-[80%] rounded-xs">
      <ParamountIcon size={"100%"} className={"invert"} />
    </div>
  ),
  "Amazon Prime Video": (
    <PrimeIcon size={"100%"} className={"invert scale-[105%]"} />
  ),
  "Apple TV Plus": <AppleTvIcon size={"100%"} className={"invert"} />,
};

export default function ProvidersSection({ data, className }) {
  if (!data || data.length === 0) {
    return null;
  }

  const uniqueIcons = new Map();

  data.forEach((provider) => {
    const providerName = provider.provider_name;

    const iconKey = Object.keys(iconMap).find((key) =>
      providerName.includes(key)
    );

    if (iconKey && !uniqueIcons.has(iconKey)) {
      uniqueIcons.set(
        iconKey,
        <div
          key={iconKey}
          className="w-8 h-8 icon-shadow flex justify-center items-center"
          title={iconKey}
        >
          {iconMap[iconKey]}
        </div>
      );
    }
  });

  return (
    <div className={`flex items-start gap-1.5 ${className}`}>
      {Array.from(uniqueIcons.values())}
    </div>
  );
}
