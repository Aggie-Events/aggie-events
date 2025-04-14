import { useAuth } from "@/components/auth/AuthContext";
import { castFilterParam, SearchFilters, setFilterParam } from "@/config/query-types";
import { useRouter,useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
 
export function useFilterHook() {
    // Automatically syncs with the URL search params
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState<SearchFilters>(getFilters());

    function getFilters() {
        const params = new URLSearchParams(searchParams);
        let newFilters: SearchFilters = {};
        for (const [key, value] of params.entries()) {
            const castKey = key as keyof SearchFilters;
            const val = castFilterParam(key, value);
            setFilterParam(newFilters, castKey, val);
        }
        return newFilters;
    }

    useEffect(() => {
        setFilters(getFilters());
    }, [searchParams]);

    return { filters };
}