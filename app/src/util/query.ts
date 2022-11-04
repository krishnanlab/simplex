import { useState, useEffect } from "react";

const cache = new Map();

type Key = string | Array<string>;

export const deleteCache = (key: Key) => cache.delete(key);

export const useQuery = <Data>(
  key: Key,
  func: () => Data,
  onLoading?: () => unknown,
  onSuccess?: () => unknown,
  onError?: () => unknown
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<Data | undefined>();

  useEffect(() => {
    if (!key) return;
    if (Array.isArray(key) && !key.every((value) => value)) return;

    let latest = true;

    (async () => {
      try {
        setLoading(true);
        setError(false);
        setSuccess(false);
        onLoading?.();

        const result = cache.get(key) || (await func());

        if (latest) {
          setData(result);
          cache.set(key, result);
          setLoading(false);
          setSuccess(true);
          onSuccess?.();
        } else {
          console.error("Stale query");
        }
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
        onError?.();
      }
    })();

    return () => {
      latest = false;
    };
  }, [key, func, onLoading, onSuccess, onError]);

  return { data, loading, success, error };
};
