import React, { useEffect, useRef, useState } from 'react'
import '../styles/BillToCustomer.css'
import { useReactToPrint } from 'react-to-print';
import usePayment from '../../hook/usePayment';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BarComponent from '../components/BarComponent';

const BillToCustomer = () => {
    const componentRef = useRef();
    const location = useLocation();
    const { GetInvoice, getInvoice } = usePayment();
    const queryParams = new URLSearchParams(location.search);
    const nic = queryParams.get('nic');
    const [stateForApi, setStateForApi] = useState(false);
    const navigate = useNavigate();
    
    const monthTranslate = {
        ene: 'enero',
        Ene: 'enero',
        feb: 'febrero',
        Feb: 'febrero',
        mar: 'marzo',
        Mar: 'marzo',
        abr: 'abril',
        Abr: 'abril',
        may: 'mayo',
        May: 'mayo',
        jun: 'junio',
        Jun: 'junio',
        jul: 'julio',
        Jul: 'julio',
        ago: 'agosto',
        Ago: 'agosto',
        sep: 'septiembre',
        Sep: 'septiembre',
        oct: 'octubre',
        Oct: 'octubre',
        nov: 'noviembre',
        Nov: 'noviembre',
        dic: 'diciembre',
        Dic: 'diciembre',
      };
          
    const converterDate = (date) => {
        const dateSplitted = date.split('-');
        const translatedMonth = monthTranslate[dateSplitted[1]];
        return `${dateSplitted[0]} de ${translatedMonth} del ${dateSplitted[2]}`;
      };

      const converterDate2 = (date) => {
        const dateSplitted = date.split(' ');
        const translatedMonth = monthTranslate[dateSplitted[0]];
        return `${translatedMonth} ${dateSplitted[1]}`;
      };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Factura',
        pageStyle: `
        @page {
            size: A4;
            margin-top: 15mm;
            margin-left: 20mm;
            margin-right: 20mm;
        }
        `,
    });
    
    useEffect(() => {
        GetInvoice(nic, setStateForApi, navigate);
    },[nic, stateForApi]);

    useEffect(() => {
        if(nic && stateForApi){
            setTimeout(() => {
                handlePrint();
            },1000)
        }
    },[nic, stateForApi]);
      
  return (
    <>
    <section>
        {
            stateForApi === false ? (                
                null
            ):(
                <>
        <button className='button-print' onClick={handlePrint}>Imprimir factura aquí</button>
        <div ref={componentRef}>
            <div id="container">
            <div id="factura">
                <div id="celeste" className="outline">
                <div className="hilera">
                    <div id="header">
                    <div className="logo">
                    <img src="data:image/png;base64,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" style={{ width: '48px', float: 'left', marginTop: '4px', marginRight: '4px' }} />
                    </div>
                    <div className="header-content" style={{lineHeight: '13px'}}>
                        <h2>INSTITUTO DE ACUEDUCTOS Y ALCANTARILLADOS NACIONALES</h2>
                        <div style={{fontSize: '13px'}}>FACTURA POR SERVICIOS DE ACUEDUCTO Y ALCANTARILLADO</div>
                        <div style={{height: '5px'}} />
                        <div className="apartado" style={{fontSize: '8px', fontStyle: 'italic'}}>Apartado Postal 0816-01535</div>
                        <table className="table-invoice-data" width="100%" cellPadding={0} cellSpacing={0} border={0} style={{fontWeight: 'bold'}}>
                        <tbody>
                            <tr>
                            <td className="outline">
                                <p>No. DE CLIENTE: {getInvoice?.nicCode}</p>
                            </td>
                            <td className="outline">
                                <p>No. DE FACTURA: {getInvoice?.numerFactura}</p>
                            </td>
                            <td className="outline font-uppercase">
                                <p>MES: {converterDate2(getInvoice?.mesCorriente)}</p>
                            </td>
                            <td className="outline">
                                <p>RUTA: {getInvoice?.ruta}</p>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                <div className="hilera datos-cliente outline">
                    <table width="100%" border={0} cellSpacing={0} cellPadding={0} style={{fontWeight: 'bold'}}>
                    <tbody>
                        <tr>
                        <td>Sr(a):</td>
                        <td>{getInvoice?.nombre}</td>
                        </tr>
                        <tr>
                        <td>Dir:</td>
                        <td>{getInvoice?.direccion}</td>
                        </tr>
                        <tr>
                        <td>Ref:</td>
                        <td>{getInvoice?.referencia}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div className="hilera flex column-gap-5px">
                    <div className="outline flex-equals">
                    <p className="box-first-title"> </p>
                    <table width="100%" border={0} cellSpacing={0} cellPadding={0}>
                        <tbody>
                        <tr>
                            <td>Barrio:</td>
                            <td align="right">{getInvoice?.barrio}</td>
                        </tr>
                        <tr>
                            <td>Corregimiento:</td>
                            <td align="right">{getInvoice?.corregimiento}</td>
                        </tr>
                        <tr>
                            <td>Distrito:</td>
                            <td align="right">{getInvoice?.distrito}</td>
                        </tr>
                        <tr>
                            <td>Provincia:</td>
                            <td align="right">{getInvoice?.provincia}</td>
                        </tr>
                        <tr>
                            <td>Finca:</td>
                            <td align="right">{getInvoice?.finca}</td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className="outline flex-equals">
                    <p className="box-first-title"><strong>Período Facturado</strong></p>
                    <table width="100%" border={0} cellSpacing={0} cellPadding={0}>
                        <tbody>
                        <tr>
                            <td>Desde: {getInvoice?.fechaLecturaAnterior}</td>
                            <td align="right">Hasta: {getInvoice?.fechaLecturaActual}</td>
                        </tr>
                        <tr>
                            <td>Fecha de Emisión</td>
                            <td align="right">{getInvoice?.fechaEmision}</td>
                        </tr>
                        <tr>
                            <td>Fecha de Vencimiento</td>
                            <td align="right">{getInvoice?.fechaVecimiento}</td>
                        </tr>
                        <tr>
                            <td>Total de Unidades</td>
                            <td align="right">{getInvoice?.unidades}</td>
                        </tr>
                        <tr>
                            <td>Tarifa</td>
                            <td align="right">{getInvoice?.tarifa}</td>
                        </tr>
                        <tr>
                            <td>Act. Económica</td>
                            <td align="right">{getInvoice?.actividad}</td>
                        </tr>
                        <tr>
                            <td>Facturación</td>
                            <td align="right">{getInvoice?.claveFactura}</td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className="outline flex-equals w-100">
                    <p className="box-first-title"> </p>
                    <table width="100%" border={0} cellSpacing={0} cellPadding={0}>
                        <tbody>
                        <tr>
                            <td>No. Medidor</td>
                            <td />
                            <td className='text-end'>{getInvoice?.medidor}</td>
                        </tr>
                        <tr>
                            <td>Lectura Actual</td>
                            <td>{getInvoice?.fechaLecturaActual}</td>
                            <td style={{textAlign: 'right'}}>{getInvoice?.lecturaActual}</td>
                        </tr>
                        <tr>
                            <td>Lectura Anterior</td>
                            <td>{getInvoice?.fechaLecturaAnterior}</td>
                            <td style={{textAlign: 'right'}}>{getInvoice?.lecturaAnterior}</td>
                        </tr>
                        <tr>
                            <td>Consumo Total</td>
                            <td></td>
                            <td style={{textAlign: 'right'}}>{getInvoice?.consumoTotal}</td>
                        </tr>
                        <tr>
                            <td>Días de Consumo</td>
                            <td />
                            <td style={{textAlign: 'right'}}>{getInvoice?.diasConsumo}</td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                <div className="hilera flex column-gap-5px">
                    <div className="outline flex-equals flex flex-column flex-justify-between">
                    <table width="100%" border={0} cellSpacing={0} cellPadding={0}>
                        <tbody>
                        <tr>
                            <td className="font-uppercase"><strong>Conceptos Facturados</strong></td>
                            <td align="right"><strong>Importe en B/.</strong></td>
                        </tr>
                        {
                            getInvoice.idaanCargos?.map((cargos) => (
                                <tr key={cargos.concepto}>
                                    <td>{cargos.concepto}</td>
                                    <td align="right">{cargos.importe}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                    <table width="100%" border={0} cellSpacing={0} cellPadding={0}>
                        <tbody>
                        <tr>
                            <td><strong>TOTAL FACTURACIÓN IDAAN B/.</strong></td>
                            <td align="right"><strong>{getInvoice?.deudaIdaan}</strong></td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className=" flex-equals position-relative">
                    <div className="flex-center d-block">
                        <div className='position-absolute text-float'>
                            <p className='text-center'>GRAFICO DE CONSUMO</p>
                        </div>
                        <BarComponent ejex={getInvoice?.graficoIdaan?.ejex} ejey={getInvoice?.graficoIdaan?.ejey} />
                    </div>
                    <table width="100%" cellSpacing={0} cellPadding={0} style={{fontSize: '14px'}}>
                        <tbody>
                        <tr>
                            <td className="outline" colSpan={5} align="center"><strong>DATOS DE LA DEUDA IDAAN</strong></td>
                        </tr>
                        <tr>
                            <td width="20%" align="center" className="outline"><strong>Mes Corriente</strong></td>
                            <td width="20%" align="center" className="outline"><strong>30 Días</strong></td>
                            <td width="20%" align="center" className="outline"><strong>60 Días</strong></td>
                            <td width="20%" align="center" className="outline"><strong>90 Días</strong></td>
                            <td width="20%" align="center" className="outline"><strong>120 días o más</strong></td>
                        </tr>
                        <tr>
                            <td align="center" className="outline">{getInvoice?.cantidadMesCorriente}</td>
                            <td align="center" className="outline">{getInvoice?.cantidadDias30}</td>
                            <td align="center" className="outline">{getInvoice?.cantidadDias60}</td>
                            <td align="center" className="outline">{getInvoice?.cantidadDias90}</td>
                            <td align="center" className="outline">{getInvoice?.cantidadDias120}</td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                <div className="hilera">
                    <div className="outline factura-indent" style={{fontSize: '10px', textTransform: 'UpperCase'}}>
                    SU ÚLTIMO PAGO FUE EL {getInvoice?.fechaUltimoPago} POR LA SUMA DE B/.{getInvoice?.montoUltimoPago}
                    </div>
                    <div className="outline factura-indent" style={{fontWeight: 'bold'}}>
                    <p>{getInvoice?.idaanMensajeGeneral}</p>
                    </div>
                </div>
                <div className="line-separator-container">
                    <div className="line-separator" />
                </div>
                <div className="hilera" style={{marginTop: '10px', marginBottom: '5px', paddingBottom: '0px', fontSize: '10px'}}>
                    No. de Cliente: {getInvoice?.nicCode} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    No. de Factura: {getInvoice?.numerFactura} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Sr(a): {getInvoice?.nombre} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div className="hilera flex" style={{marginTop: '0px', paddingTop: '0px'}}>
                    <div className="outline flex-equals">
                    <table cellPadding={0} width="100%">
                        <tbody>
                        <tr>
                            <td style={{fontSize: '14px'}}><strong>SALDO A PAGAR IDAAN B/.</strong></td>
                            <td align="right" style={{fontSize: '14px'}}><strong> {getInvoice?.deudaIdaan} </strong></td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className="flex-equals" style={{fontSize: '11px', textAlign: 'right', color: 'darkblue', fontWeight: 600}}>PARA USO
                    DE LA OFICINA DE COBROS</div>
                </div>
                <div className="hilera flex">
                    <div className="flex-equals">
                        {
                            getInvoice.codigoBarraIdaan && (
                                <img className="codigo-de-barras" src={`data:image/png;base64,${getInvoice.codigoBarraIdaan}`} />
                            )
                        }
                    </div>
                    <div className="flex-equals">
                    <p style={{color: '#e48527', textAlign: 'right', fontSize: '11px', fontWeight: 600, lineHeight: '1.3', textTransform: 'UpperCase'}}>
                        {/* LA FECHA DE CORTE DE SU CUENTA ES {getInvoice?.fechaCorte}<br /> */}
                        PAGAR ANTES DEL {getInvoice.fechaVecimiento && converterDate(getInvoice?.fechaVecimiento)}<br />
                     </p>
                    </div>
                </div>
                </div>
                {/* CIERRA ID CELESTE*/}
                {/* EMPIEZA EL ID DE ASEO */}
                <div className="line-separator-container">
                <div className="line-separator" />
                </div>
                <div id="aseo" className="orangeoutline">
                <div className="flex column-gap-5px align-items-end" style={{marginBottom: '3px'}}>
                    <div style={{width: '4.65cm'}}>
                    <div className="orangeoutline" style={{marginBottom: '3px'}}><strong>No. DE CLIENTE:</strong> {getInvoice?.nicCode}</div>
                    <div className="orangeoutline"><strong>MES:</strong> {getInvoice?.fechaEmisionAseo}</div>
                    </div>
                    <div style={{flex: 1}}>
                    <div><p style={{fontSize: '13px', textAlign: 'center', margin: 0}}><strong>EMPRESA DE ASEO - FACTURA POR SERVICIOS DE ASEO</strong></p>
                    </div>
                    <div className="orangeoutline">
                        Sr(a): {getInvoice?.nombre}
                        <br />
                        Direccíon: {getInvoice?.direccion}
                    </div>
                    </div>
                </div>
                <div className="flex column-gap-10px">
                    <div className="flex-equals flex flex-column flex-justify-between orangeoutline">
                    <table width="100%" border="0px" cellSpacing={0} cellPadding={0}>
                        <tbody>
                        <tr>
                            <td><strong>FACTURACIÓN TERCEROS</strong></td>
                            <td align="right" style={{fontSize: '10px'}}><strong>Importe en B/.</strong></td>
                        </tr>
                        {
                            getInvoice.aseoCargos?.map((cargos) => (
                                <tr key={cargos.concepto}>
                                    <td>{cargos.concepto}</td>
                                    <td align="right">{cargos.importe}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                    <table width="100%" border="0px" cellSpacing={0} cellPadding={0}>
                        <tbody>
                        <tr>
                            <td><strong>TOTAL FACTURACIÓN TERCEROS</strong></td>
                            <td align="right"><strong>{getInvoice?.deudaTotalAseo}</strong></td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className="flex-equals">
                    <table className="deuda-aseo-table bold" width="100%" border={0} cellSpacing={0} cellPadding={0}>
                        <tbody><tr>
                            <td className="thead" colSpan={5} align="center">DATOS DE LA DEUDA ASEO</td>
                        </tr>
                        <tr>
                            <td align="center">Mes Corriente</td>
                            <td align="center">30 Días</td>
                            <td align="center">60 Días</td>
                            <td align="center">90 Días</td>
                            <td align="center">120 Días o Más</td>
                        </tr>
                        <tr>
                            <td align="center">{getInvoice?.mesCorrienteAseo}</td>
                            <td align="center">{getInvoice?.dias30Aseo}</td>
                            <td align="center">{getInvoice?.dias60Aseo}</td>
                            <td align="center">{getInvoice?.dias90Aseo}</td>
                            <td align="center">{getInvoice?.dias120Aseo}</td>
                        </tr>
                        </tbody></table>
                    <p style={{margin: '5px 0 0 0', textAlign: 'center', fontSize: '11px'}}>
                        <small>CUALQUIER ACLARACIÓN, ACUDA A LA OFICINA DE ASEO CORRESPONDIENTE</small>
                    </p>
                    </div>
                </div>
                <div className="line-separator-container">
                    <div className="line-separator" />
                </div>
                <div className="hilera" style={{margin: '15px 0 0 0', paddingBottom: '0px', fontSize: '18px'}}>
                    <table className="table-over-aseo" border={0} cellSpacing={0} cellPadding={0}>
                    <tbody>
                        <tr>
                        <td>Fecha de Emisión: </td>
                        <td>{getInvoice?.fechaEmision}</td>
                        </tr>
                        <tr>
                        <td>Fecha de Vencimiento: </td>
                        <td>{getInvoice?.fechaVecimiento}</td>
                        </tr>
                        <tr>
                        <td>No. De Cliente: {getInvoice?.nCliente} </td>
                        <td>Sr(a): {getInvoice?.nombre}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div className="hilera flex" style={{margin: '10px 0 5px 0', paddingTop: '0px'}}>
                    <div className="orangeoutline flex-equals">
                    <table cellPadding={0} width="100%">
                        <tbody>
                        <tr>
                            <td style={{fontSize: '14px'}}><strong>SALDO A PAGAR ASEO B/.</strong></td>
                            <td align="right" style={{fontSize: '14px'}}><strong> {getInvoice?.deudaTotalAseo} </strong></td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className="flex-equals" style={{fontSize: '11px', textAlign: 'right', color: 'darkblue', fontWeight: 600}}>PARA USO
                    DE LA OFICINA DE COBROS</div>
                </div>
                <div className="hilera">
                    <div>
                    {/* CODIGO DE BARRA AGUA */}
                    {
                        getInvoice.codigoBarraAseo && (
                            <img className="codigo-de-barras" src={`data:image/png;base64,${getInvoice.codigoBarraAseo}`} />
                        )
                    }
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </>
            )
        }
    </section>
    </>
  )
}

export default BillToCustomer;