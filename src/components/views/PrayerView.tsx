import { forwardRef } from "react";
import type { PrayerSection } from "../../types";
import { SectionHeader } from "../SectionHeader";

interface Props {
  section: PrayerSection;
}

export const PrayerView = forwardRef<HTMLHeadingElement, Props>(
  function PrayerView({ section }, ref) {
    return (
      <div>
        <SectionHeader
          ref={ref}
          ribbon={section.ribbon}
          note={section.note}
        />
        <p className="prayer">{section.text}</p>
        {section.coda && <div className="prayer-coda">{section.coda}</div>}
      </div>
    );
  },
);
