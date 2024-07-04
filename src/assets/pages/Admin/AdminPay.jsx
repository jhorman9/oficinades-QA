import React from 'react';
import usePayment from '../../../hook/usePayment';
import { useForm } from 'react-hook-form';
import GeneratorCSV from '../../components/GeneratorCSV';
import GeneratorExcel from '../../components/GeneratorExcel';

const AdminPay = () => {
  const { getPaymentByNic, paymentByNic } = usePayment();
  const { control, setValue, register, handleSubmit, reset, formState: {errors} } = useForm();

  const submit = (data) => {
    getPaymentByNic(data.searchNic);
  };

  const title = [
    "ID",
    "Fecha del pago",
    "Fecha aplicación",
    "Agencia de pago",
    "Tipo de pago",
    "Correlación de pago",
    "Monto",
  ]
  
  const rowDetail = row => [
    row.nicCode,
    row.paymentDate,
    row.processDate,
    row.office,
    row.paymentType,
    row.paymentCorrelation,
    `B./${row.paymentAmount}`
  ]

  return (
    <section className="pay__history__panel container">
      <h5 className='pay__history__panel__title mb-3'>PAGOS</h5>
      <div className="table__bill">
        <div className='table__bill__header pays flex-column  d-flex flex-lg-row flex-md-row justify-content-lg-between justify-content-md-between align-items-md-center align-items-lg-center align-items-start'>
          <h6 className='color-primary fw-bold mb-2'>Historial de pago</h6>
          <div className='d-flex gap-2'>
            {
              paymentByNic.length > 0 && (
                <div className='btn-generators'>
                <GeneratorCSV data={paymentByNic} name={"Pagos"} title={title} rowDetail={rowDetail}/>
                <GeneratorExcel data={paymentByNic} name={"Pagos"} titles={title} rowDetail={rowDetail}/>
              </div>
              )
            }
          </div>
        </div>
        <div className='table__bill__header pays d-flex justify-content-end mb-3'>
          <form onSubmit={handleSubmit(submit)} className='d-flex gap-2 align-items-lg-center align-items-md-center align-items-start flex-lg-row flex-md-row flex-column gap-md-2 gap-0'>
            <input {...register('searchNic')} className='input-pay-admin' type="text" id='search-pay' placeholder='Número de NIC'/>
            <button type='submit' className='btn btn-primary'>Buscar</button>
          </form>
        </div>
        {
          paymentByNic?.length > 0 ? (
            <div className='w-100 overflow-x-scroll'>
              <table className='display responsive w-100 personalized-responsive personalized-table'>
                <thead>
                  <tr className='table__bill__header'>
                    <th>NIC</th>
                    <th>Fecha del pago</th>
                    <th>Fecha aplicación</th>
                    <th>Agencia de pago</th>
                    <th>Tipo de pago</th>
                    <th>Correlación de pago</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentByNic?.map((payment, index) => (
                    <tr className={index % 2 === 0 ? 'odd' : 'even'} key={index}>
                      <td className='cursor-pointer item1'>{payment.nicCode}</td>
                      <td className='cursor-pointer item1'>{payment.paymentDate}</td>
                      <td>{payment.processDate}</td>
                      <td>{payment.office}</td>
                      <td>{payment.paymentType}</td>
                      <td>{payment.paymentCorrelation}</td>
                      <td>B./{payment.paymentAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-center mt-2'>No tiene ningún pago</p>
          )
        }
      </div>
    </section>
  );
};

export default AdminPay;
