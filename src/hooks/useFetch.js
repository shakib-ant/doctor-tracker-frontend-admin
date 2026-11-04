"use client";

import { Env } from "@/utils/env";
import { useEffect, useState } from "react";

export function useFetch(url, options) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const fetchOptions = {
          method: options?.method || "GET",
          headers: options?.headers || {
            "Content-Type": "application/json",
          },
          ...(options?.body && { body: JSON.stringify(options.body) }),
        };

        const fullUrl = Env.backend_url + url;
        const response = await fetch(fullUrl, fetchOptions);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.log("err", err);
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, options]);

  return { data, error, isLoading };
}