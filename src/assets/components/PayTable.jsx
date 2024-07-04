import React from 'react'

const PayTable = ({payment}) => {
  return (
    <tr>
        <td>{payment?.paymentDate}</td>
        <td>{payment?.processDate}</td>
        <td>{payment?.office}</td>
        <td>{payment?.paymentType}</td>
        <td>B./{payment?.paymentAmount}</td>
    </tr>
  )
}

export default PayTable