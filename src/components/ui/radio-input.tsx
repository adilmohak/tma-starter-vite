import { useTelegram } from "@/hooks/use-telegram";
import { cn } from "@/lib/utils";

interface RadioInputProps {
  checked: boolean;
  onChange: React.Dispatch<any>;
  id: string;
  name: string | React.ReactElement;
  icon?: React.ReactElement;
  className?: string;
  hideRadio?: boolean;
  additionalContent?: React.ReactElement;
}

const RadioInput = ({
  checked,
  onChange,
  name,
  icon,
  id,
  className,
  hideRadio,
  additionalContent,
}: RadioInputProps) => {
  const telegram = useTelegram();
  const vibrateOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    telegram?.HapticFeedback.impactOccurred("medium");
  };

  return (
    <label
      className={cn(
        `relative font-semibold text-sm flex items-center text-left gap-4 cursor-pointer p-2 rounded-xl ${
          checked ? "text-accent bg-button-opacity" : "bg-muted"
        } mb-3`,
        className
      )}
      role="button"
      onClick={(e: any) => vibrateOnClick(e)}
    >
      <input
        type="radio"
        name={id}
        id={id}
        className={`${
          hideRadio ? "hidden" : "block"
        } peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-opacity-25 checked:border-opacity-100 checked:border-accent transition-all`}
        checked={checked}
        onChange={onChange}
      />
      <span
        className={`absolute left-2 ${
          hideRadio ? "hidden" : "inline-block"
        } h-5 w-5 rounded-full border peer-checked:border-accent border-opacity-10 peer-checked:bg-transparent peer-checked:before:content-[''] peer-checked:before:absolute peer-checked:before:top-1/2 peer-checked:before:left-1/2 peer-checked:before:h-3.5 peer-checked:before:w-3.5 peer-checked:before:rounded-full peer-checked:before:bg-accent peer-checked:before:transform peer-checked:before:-translate-x-1/2 peer-checked:before:-translate-y-1/2 transition-all`}
      ></span>
      {icon ? (
        <div className="inline-flex items-center gap-1">
          {icon && (
            <span className="w-[24px] h-[24px] rounded-full">{icon}</span>
          )}
          {name}
        </div>
      ) : (
        name
      )}
      {additionalContent}
    </label>
  );
};

export default RadioInput;
