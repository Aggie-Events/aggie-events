import React, { useState } from "react";
import CollapsableConfig from "@/app/search/_components/_filter-list/CollapsableConfig";
import FilterInput from "@/app/search/_components/_filter-list/FilterInput";

export type FilterListOutput = {
  name?: string;
  tag?: string;
};

export default function FilterList({
  onSubmit,
}: {
  onSubmit: (filters: FilterListOutput) => void;
}) {
  const [filters, setFilters] = useState<FilterListOutput>({
    name: "",
    tag: "",
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(filters);
      }}
    >
      <CollapsableConfig title="Name">
        <FilterInput
          onChange={(e: HTMLInputElement) => {
            setFilters({ ...filters, name: e.value });
          }}
          value={filters.name}
        />
      </CollapsableConfig>
      <CollapsableConfig title="Tag">
        <FilterInput
          onChange={(e: HTMLInputElement) => {
            setFilters({ ...filters, tag: e.value });
          }}
          value={filters.tag}
        />
      </CollapsableConfig>
      <button
        className="bg-maroon text-white w-full py-2 my-4 rounded-lg font-semibold hover:shadow-md"
        type={"submit"}
      >
        Submit
      </button>
    </form>
  );
}
