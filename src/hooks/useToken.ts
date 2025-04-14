import { useEffect, useRef } from 'react';

export const useToken = (callback: (val: boolean) => void) => {
  const savedCallback = useRef(callback);

  const checkExpire = () => {
    let key = localStorage.getItem("key");
    console.log('useToken key : ', key);
    // key='';
    let result = false;

    (key === null || key === undefined) ? result = false : result = true
    // server check
    return result;
  }

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    return (checkExpire()) ? callback(true) : callback(false);
  }, []);
};