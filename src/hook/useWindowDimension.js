import { useEffect, useState } from "react";

function useWindowDimensions() {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
  
    useEffect(() => {
      const resizeListener = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      };
  
      window.addEventListener("resize", resizeListener);
  
      return () => {
        window.removeEventListener("resize", resizeListener);
      };
    }, []);
  
    return {
      width,
      height,
    };
  }

  export default useWindowDimensions;
