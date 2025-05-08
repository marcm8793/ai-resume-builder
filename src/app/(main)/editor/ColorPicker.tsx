import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";
import { PaletteIcon } from "lucide-react";
import { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";

interface ColorPickerProps {
  color: Color | undefined;
  onChange: ColorChangeHandler;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const subscriptionLevel = useSubscriptionLevel();

  const premiumModal = usePremiumModal();

  const [showPopover, setShowPopover] = useState(false);

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Change resume color"
          onClick={() => {
            if (!canUseCustomizations(subscriptionLevel)) {
              premiumModal.setOpen(true);
              return;
            }
            setShowPopover(true);
          }}
        >
          <PaletteIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-none bg-transparent shadow-none"
        align="end"
      >
        <TwitterPicker
          color={color}
          onChange={onChange}
          triangle="top-right"
          colors={[
            // Reds & Pinks
            "#EB144C",
            "#F78DA7",
            // Oranges & Yellows
            "#FF6900",
            "#FCB900",
            "#FFED00",
            // Greens
            "#7BDCB5",
            "#417505",
            "#00D084",
            "#A4DD00",
            // Blues
            "#8ED1FC",
            "#0693E3",
            "#004DCF",
            "#0075A2",
            // Purples
            "#9900EF",
            "#653294",
            // Grays & Black
            "#ABB8C3",
            "#000000",
          ]}
        />
      </PopoverContent>
    </Popover>
  );
}
