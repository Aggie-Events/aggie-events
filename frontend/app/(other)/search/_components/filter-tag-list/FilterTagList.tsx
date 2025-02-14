import React from "react";
import FilterTagDisplay from "@/app/(other)/search/_components/filter-tag-list/FilterTagDisplay";

export default function FilterTagList({
  tags,
  onTagClose,
}: {
  tags: string[];
  onTagClose: (tag: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 m-2">
      {tags.length > 0 &&
        Array.from(tags).map((tag) => (
          <FilterTagDisplay
            text={tag}
            key={tag}
            onClose={() => {
              onTagClose(tag);
            }}
          ></FilterTagDisplay>
        ))}
    </div>
  );
}
