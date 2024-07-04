import React from 'react'

const SVGBill = ({ Wid, Hei, Fill, Stroke }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={Wid || "24"} height={Hei || "24"} viewBox="0 0 24 24" fill={Fill || "none"}><path d="M3.66992 2.5V14.47C3.66992 15.45 4.12992 16.38 4.91992 16.97L10.1299 20.87C11.2399 21.7 12.7699 21.7 13.8799 20.87L19.0899 16.97C19.8799 16.38 20.3399 15.45 20.3399 14.47V2.5H3.66992Z" stroke="" strokeWidth="1.5" strokeMiterlimit="10"/><path d="M2 2.5H22" stroke="" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/><path d="M8 8H16" stroke="" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 13H16" stroke="" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/></svg>                            
    )
}

export default SVGBill;