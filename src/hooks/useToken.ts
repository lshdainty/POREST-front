import { useEffect, useRef } from 'react';

export const useToken = (callback: (val: boolean) => void) => {
  const savedCallback = useRef(callback);
  
  console.log("hello useToken??");

  const checkExpire = () => {
    // server check
    return true;
    // return false;
  }

  useEffect(() => {
    console.log("hello useToken11111111");
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    console.log("hello useToken222222222222222");
    return (checkExpire()) ? callback(true) : callback(false);
  }, []);
};