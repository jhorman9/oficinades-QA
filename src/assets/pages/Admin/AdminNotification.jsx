import React, { useCallback, useEffect, useState } from 'react';
import useNotifications from '../../../hook/useNotifications';
import { format, isValid, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import ReactSelect from 'react-select';
import '../../styles/Admin/notification-admin.css';
import PdfIcon from '../../images/icons/icon-pdf.svg';
import imageIcon from '../../images/icons/icon-image.svg';
import SVGedit from '../../images/icons/SVGedit';
import closeSVG from '../../images/icons/icon _close circle.svg';
import SVGArrowRight from '../../images/icons/SVGArrowRight';
// import wordIcon from '../../images/icons/icon-word.svg';
// import txtIcon from '../../images/icons/icon-txt.svg';
// import videoIcon from '../../images/icons/icon-video.svg';
// import excelIcon from '../../images/icons/icon-excel.svg';
// import powerpointIcon from '../../images/icons/icon-powerpoint.svg';
// import rarIcon from '../../images/icons/icon-rar.svg';
// import zipIcon from '../../images/icons/icon-zip.svg';
import acercarseSVG from '../../images/icons/acercarse.svg';
import avionSVG from '../../images/icons/avion-de-papel.svg';
import editarSVG from '../../images/icons/editar.svg';
import papeleraSVG from '../../images/icons/papelera-xmark.svg';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import PaginateComponent from '../../components/PaginateComponent';
import GeneratorCSV from '../../components/GeneratorCSV';
import GeneratorExcel from '../../components/GeneratorExcel';


const AdminNotification = () => {

  const rol = useSelector(state => state.getRol);

  const {
    register: register,
    handleSubmit: handleSubmit,
    formState: { errors: errors },
  } = useForm();

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    control: control2,
    formState: { errors: errors2 },
    setValue: setValue2,
  } = useForm();

  const {
    CreateNotificationAdmin,
    GetNotificationAdmin,
    getNotificationAdmin, 
    DeleteNotificationAdmin, 
    notificationByIdAdmin, 
    GetCustomerForNotification, 
    GetNotificationByIdAdmin, 
    getNotificationByIdStateAdmin, 
    updateNotificationAdmin, 
    EnableNotificationAdmin, 
    isChanged, 
    getPagination
  } = useNotifications();

  const statusMap = {
    'Pending': 'Proceso', 
    'Revision': 'Pre-aprobado', 
    'Approval': 'Aprobado', 
    'Rejected': 'Denegado', 
    'Ediction': 'En edición'
  };

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [newId, setNewId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [invalidFiles, setInvalidFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const [invalidFiles2, setInvalidFiles2] = useState([]);
  const [arrayToDelete, setArrayToDelete] = useState([]);
  const [customersNotifications, setCustomersNotifications] = useState([]);
  const [isToAllBase, setIsToAllBase] = useState(false);
  const [isToAllBase2, setIsToAllBase2] = useState(false);
  const [emailSelected, setEmailSelected] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [itemPerPageState, setItemPerPageState] = useState(10);
  const [pageNumberState, setPageNumberState] = useState(0);
  const [typeFilterState, setTypeFilterState] = useState();
  const [errorFile, setErrorFile] = useState([]);
  const [errorFile2, setErrorFile2] = useState([]);
  const [searchState, setSearchState] = useState();
  const [isSort, setIsSort] = useState('desc');

  const handleClose = () => {
    setInvalidFiles2([]);
    setInvalidFiles([]);
    setShow(false);
    setErrorFile([]);
  };
  const handleShow = () => {
    setShow(true)
  };
  
  const handleClose2 = () => {
    setShow2(false)
    setInvalidFiles2([]);
    setArrayToDelete([]);
    setErrorFile2([]);
  };
  
  useEffect(() => {
    GetNotificationAdmin(pageNumberState, itemPerPageState, searchState, isSort);
  },[show, show2, isChanged, pageNumberState, itemPerPageState, searchState, isSort]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetCustomerForNotification(inputValue);
        setCustomersNotifications(result);
      } catch (error) {
      }
    };

    inputValue.length > 3 && fetchData();

  }, [inputValue]);
  
  const dataNew = customersNotifications?.map(item => item.email);

  const allowedExtensions = [
    '.pdf', '.jpg', '.jpeg', '.png' //, '.doc', '.docx', '.txt', '.mp4', '.avi', '.zip', '.rar', '.xls', '.ppt', '.pptx', '.xlsx'
  ];
  
  useEffect(() => {
    if(newId){
      GetNotificationByIdAdmin(newId);
    }
  },[newId, show2])

  useEffect(() => {
    if (getNotificationByIdStateAdmin) {
      setValue2('Subject', getNotificationByIdStateAdmin.subject || '');
      setValue2('ContentBody', getNotificationByIdStateAdmin.contentBody || '');
      setValue2('ToAllBase', getNotificationByIdStateAdmin.isGlobal || '');
      setValue2('NotificationId', (getNotificationByIdStateAdmin.notificationId || ''))
      setSelectedFiles2(getNotificationByIdStateAdmin.notificationDetails || '');
    }
    
  }, [getNotificationByIdStateAdmin, setValue2]);

  const deleteNotification = (id) => {
    DeleteNotificationAdmin(id);
  };
  
  const createNotification = async(data) => {

    if (emailSelected.length > 0 && !isToAllBase) {
      const toUsersArray = emailSelected.map((email) => email.value);
      data.ToUsers = toUsersArray;
    }
  
    if (selectedFiles.length > 0) {
      const documentsDatasArray = selectedFiles.map((file) => file);
      data.DocumentsDatas = documentsDatasArray;
    }

    await CreateNotificationAdmin(data);

  };

  const getFileExtension = (fileName) => {
    return '.' + fileName?.split('.').pop().toLowerCase();
  };
  
  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter(file => allowedExtensions.includes(getFileExtension(file.name.toLowerCase())));
    const invalidFiles = acceptedFiles.filter(file => !allowedExtensions.includes(getFileExtension(file.name.toLowerCase())));
    let invalidFilesError = [];

    validFiles.forEach(file => {
    //  const existingNotification = getNotificationAdmin.find(notification => {
    //    return notification.notificationDetails.some(detail => detail.fileName === file.name);
    //  });
  
    //  const fileExists = selectedFiles.some(existingFile => existingFile.name === file.name);
  
    //  if (existingNotification || fileExists) {
    //    Swal.fire({
    //      title: 'Archivo Existente',
    //      text: `Ya existe un archivo con el nombre ${file.name}. Por favor, cambie el nombre del archivo antes de agregarlo.`,
    //      icon: 'error',
    //     confirmButtonText: 'Aceptar'
    //    });
    //  } else {
      show == false || show2 == false && (setErrorFile(''));
      if((file.size / (1024 * 1024)).toFixed(2) < 2){
        setSelectedFiles((prevFiles) => [...prevFiles, file]);
      }else{
        invalidFilesError.push(file);
      }
    //  }
    });
    setErrorFile(invalidFilesError);
  
    setInvalidFiles((prevInvalidFiles) => [...prevInvalidFiles, ...invalidFiles]);
  }, [allowedExtensions, getFileExtension, getNotificationAdmin, selectedFiles, setSelectedFiles, setInvalidFiles, errorFile]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedExtensions.join(','),
  });
  
  const handleRemoveFile = (fileName) => {
    setSelectedFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
    setInvalidFiles((prevInvalidFiles) => prevInvalidFiles.filter(file => file.name !== fileName));
  };
  
  const handleRemoveFile2 = (fileCode) => {

    if (typeof fileCode === "number") {
      setArrayToDelete((prevInfo) => [...prevInfo, fileCode]);
    }

    setSelectedFiles2((prevFiles) => prevFiles.filter(file => file.fileId !== fileCode && file.uuidCode !== fileCode));
    setInvalidFiles2((prevInvalidFiles) => prevInvalidFiles.filter(file => file.fileId !== fileCode && file.uuidCode !== fileCode));
  };

  const images = {
    '.pdf': PdfIcon, '.jpg': imageIcon, '.jpeg': imageIcon, '.png': imageIcon //, '.doc': wordIcon, '.docx': wordIcon, '.txt': txtIcon, '.mp4': videoIcon, '.avi': videoIcon, '.zip': zipIcon, '.rar': rarIcon, '.xls': excelIcon, '.xlsx': excelIcon, '.ppt': powerpointIcon, '.pptx': powerpointIcon
  };


  const handleSelectChange = (selectedOptions) => {
    setEmailSelected(selectedOptions);
  };

  const handleShow2 = (id, range) => {
    setShow2(true);
    range == 'Global' ? setIsToAllBase2(true) : '';
    range == 'Individual' ? setIsToAllBase2(false) : '';
    setNewId(id)
  }

  const updateNotification = (data) => {
    selectedFiles2 ?
      data.DocumentsDatas = selectedFiles2.filter(document => !document.fileName)
      : [0];
    data.ToAllBase = isToAllBase2;
    data.uuidCode ?
      delete data.uuidCode 
      : '';
    data.notificationDetails ?
      delete data.notificationDetails 
      : '';
    arrayToDelete.length > 0 ?
      data.DocumentsDatasDelete = arrayToDelete 
      : data.DocumentsDatasDelete = [0];  
    updateNotificationAdmin(data, handleClose2);
  }

  const enableNotificationById = (notificationId) => {
    EnableNotificationAdmin(notificationId)
  };

  const handlePageChange = selectedPage => {
    setPageNumberState(selectedPage.selected);
  };

  const searchUsers = (data) => {
    if(data.searchOption?.length <= 0){
      return Swal.fire({
        icon: 'error',
        title: 'Selecciona una opción',
        text: 'Debes seleccionar una opción en el filtrado de busqueda',
        confirmButtonColor: 'var(--primary)',
      })
    }
    setSearchState(data);
    setPageNumberState(0);
    getPagination.currentPage = 0;
  };

  const sortHandler = () => {
    if(isSort == 'asc'){
      setIsSort('desc');
    }else{
      setIsSort('asc');
    }
  };

  const title = [
    "ID",
    "Título",
    "Fecha",
    "Alcance",
    "Estatus"
  ]
  
  const rowDetail = row => [
    row.notificationId,
    row.subject,
    format(parseISO(row.createAt), 'dd/MM/yyyy'),
    row.notificationType,
    statusMap[row.status],
  ]

  return (
    <>
    {
      rol == 'Admin' || rol == 'Super' ? (
        <>
        <section className='notificationAdmin'>
          <div className="notificationAdmin__content container">
            <h5 className="title__panel mb-3">NOTIFICACIONES ADMIN</h5>
            <div className="notificationAdmin__body">
              <div className='notificationAdmin__btn-top'>
                <h6 className='color-primary fw-bold'>Notificaciones</h6>
                <div className='notification__header__csv'>
                  <div className='btn-generators'>
                    <GeneratorCSV data={getNotificationAdmin} name={"Gestión de NIC"} title={title} rowDetail={rowDetail}/>
                    <GeneratorExcel data={getNotificationAdmin} name={"Gestión de NIC"} titles={title} rowDetail={rowDetail}/>
                  </div>
                  <button className="btn btn-primary" onClick={handleShow} >Crear notificaciones</button>
                </div>
              </div>
              <div className="personalized-header">
            <div className='d-flex gap-2 align-items-center'>
              <label htmlFor="">Mostrar</label>
              <select className='personalized-see' onChange={(e) => setItemPerPageState(e.target.value)} value={itemPerPageState}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
                <option value="500">500</option>
              </select>
              <label htmlFor="">Registro</label>
            </div>
            <form onSubmit={handleSubmit(searchUsers)}>
              <div className='personalized-table-search'>
                <div className='d-flex align-items-center'>
                  <select className='px-2' {...register('searchOption')} onChange={(e)=> setTypeFilterState(e.target.value)}>
                    <option value="0">Buscar por</option>
                    <option value="1">Globales</option>
                    <option value="2">Individuales</option>
                  </select>
                </div>
                {
                  typeFilterState == 2 && (
                    <div className='d-flex gap-2 align-items-center'>                
                      <input className='px-2' type={"text"} placeholder='Ingresar correo' {...register('searchValue')}/>
                    </div>
                  )
                }
                <div>
                  <button className="btn btn-primary">Buscar</button>
                </div>
              </div>
            </form>
          </div>
              {
                getNotificationAdmin?.length > 0 ? (
                  <>
              <div className='w-100 overflow-x-scroll'>
                  <table className='display responsive w-100 pt-3 personalized-table'>
                    <thead>
                      <tr className='table__notificationAdmin__header'>
                        <th className='sort__header' onClick={sortHandler}>
                          <div className='sort__personalized'>
                            <span>ID</span>
                            <div className='sort__personalized__container'>
                              <div className={`sort__item ${isSort == 'asc' ? 'opacity_sort' : ''}`}>▲</div>
                              <div className={`sort__item ${isSort == 'desc' ? 'opacity_sort' : ''}`}>▼</div>
                            </div>
                          </div>
                        </th>                         
                        <th>Título</th>
                        <th>Fecha</th>
                        <th>Alcance</th>
                        <th>Estatus</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        getNotificationAdmin?.map((notification, index) => (
                          <tr className={index % 2 === 0 ? 'odd' : 'even'} key={index}>
                            <td>{notification.notificationId}</td>
                            <td className='text'>{notification.subject}</td>
                            <td><span>{notification.createAt && isValid(parseISO(notification.createAt)) ? format(parseISO(notification.createAt), 'dd/MM/yyyy') : 'Invalid Date'}</span></td>
                            <td>{notification.notificationType}</td>
                            <td>{statusMap[notification.status]}</td>
                            <td>
                              <span className='d-flex gap-4'>
                                  {
                                  notification.status == 'Ediction' ?
                                  <span className='cursor-pointer' title='Habilitar' onClick={()=> enableNotificationById(notification.notificationId)}>
                                    <img src={avionSVG} alt="" />                                  
                                  </span>
                                    :
                                  null
                                  }
                                <span className='cursor-pointer' title='Editar' onClick={() => handleShow2(notification.notificationId, notification.notificationType)}>
                                  <img src={editarSVG} alt="" /> 
                                </span>
                                <img className='delete cursor-pointer' src={papeleraSVG} alt="Eliminar" title='Eliminar' onClick={() => deleteNotification(notification.notificationId)}/>
                                <Link title='Ver detalles' to={`${notification.notificationId}`}><img src={acercarseSVG} alt="" /></Link>
                              </span>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody> 
                  </table>
                </div>
                <div className='personalized-table-pagination'>
                  <PaginateComponent paginationData={getPagination} handlePageChange={handlePageChange} />
                </div>
                </>
                ) : (
                  <p>No tienes notificaciones creadas</p>
                )
              }
            </div>
          </div>
        </section>
        
        {show && 
        <Modal id='modal_create' className='modal__Add-ChooseNic modal__createNotification' show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Crear notificaciones</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit1(createNotification)}>
                <Modal.Body>
                        <div className="modal__inputs__group">
                            <div className="modal__inputs__group__input margin-button-14">
                                <label className='is-required'>Título</label>
                                <input {...register1('Subject', {required: 'Este campo no puede estar vacio'})} type="text" className="form-control m-0" placeholder="Escribe aquí" />
                                <small className='text-form' style={{color: 'red'}}>{errors1.Subject?.message}</small>
                            </div>
                        </div>

                        <div className="modal__inputs__group">
                            <div className="modal__inputs__group__input margin-button-14">
                                <label className='is-required'>Contenido</label>
                                <textarea {...register1('ContentBody', {required: 'Este campo no puede estar vacio'})} className="form-control m-0" placeholder="Escribe aquí" />
                                <small className='text-form' style={{color: 'red'}}>{errors1.ContentBody?.message}</small>
                            </div>
                            <div className="modal__inputs__group__input align-items-center flex-row gap-1 margin-bottom-14">
                              <input {...register1('ToAllBase', {
                                validate: ( value ) => {
                                  if(value == false && emailSelected.length == 0){
                                    return 'Debe seleccionar un usuario o marcar como global'
                                  }
                                }
                              })} type="checkbox" 
                              className='w-fit-content cursor-pointer m-0' 
                              style={{minHeight:'0'}} 
                              checked={isToAllBase} onChange={()=> isToAllBase ? setIsToAllBase(false) : setIsToAllBase(true)}
                                />
                              <label className='inline-block'>Para todos los usuarios</label>
                              <small className='text-form' style={{ color: 'red' }}>
                                {errors1.ToAllBase?.message}
                              </small>
                            </div>
                            {!isToAllBase && (
                              <>
                              <div className="modal__inputs__group__input">
                                <label>Elegir correos</label>
                                <ReactSelect
                                  options={dataNew?.map(value => ({ label: value, value: value }))}
                                  isMulti
                                  className="react-select-container mb-0"
                                  classNamePrefix="react-select"
                                  value={emailSelected}
                                  onChange={handleSelectChange}
                                  inputValue={inputValue}
                                  onInputChange={(newValue) => setInputValue(newValue)}
                                  filterOption={() => true}
                                />
                                <small className='mb-0'>Puedes buscar usuarios por <strong className='color-primary'>Nombre y Apellido, Correo o NIC.</strong></small>
                                <small className='text-form' style={{ color: 'red' }}>
                                  {errors1.reactSelect?.message}
                                </small>
                              </div>
                              </>
                            )}
                        </div>

                        <div className="modal__inputs__gruop__input">
                          <div>
                            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                              <input {...getInputProps()} />
                              <p>Arrastra y suelta algunos archivos aquí o haz clic para seleccionar archivos</p>
                            </div>
                            <small><strong className='color-primary'>IMPORTANTE: </strong>El peso máximo del archivo aceptado es 2MB.</small> <br />
                            {
                              errorFile?.map((file, index) => (
                                <>
                                <small key={index} style={{color: 'red'}}>El archivo que estás intentando adjuntar {file.name} supera los 2MB máximos permitidos, disminuye el peso del archivo e intenta de nuevo.</small> <br />
                                </>
                              ))
                            }
                            <ul className='p-0'>
                              {selectedFiles.map(file => (
                                <li key={file.name} className='align-items-center'>
                                  <img className='cursor-pointer icon__dropzone' src={images[getFileExtension(file.name)] || PdfIcon} alt={`Archivo ${file.name}`} title={`Archivo ${file.name}`} />
                                  <span className='text-truncate flex-1'>{file.name}</span>
                                  <button className='btn btn-danger' onClick={() => handleRemoveFile(file.name)}>Eliminar</button>
                                </li>
                              ))}
                            </ul>
                            <div>
                              {invalidFiles.map(file => (
                                <p key={file.name}>La extensión del archivo no es compatible: <span className='text-danger'>{getFileExtension(file.name)}</span></p>
                              ))}
                            </div>
                          </div>
                        </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='m-0' variant="primary" type='submit'>Crear notificación</Button>
                </Modal.Footer>
            </Form>
        </Modal>
        }
          
        {show2 && 
          <Modal id='modal_edit' className='modal__Add-ChooseNic modal__editNotification' show={show2} onHide={handleClose2}>
          <Modal.Header closeButton>
              <Modal.Title>Editar notificaciones</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit2(updateNotification)}>
              <Modal.Body>
                      <div className="modal__inputs__group">
                          <div className="modal__inputs__group__input margin-button-14">
                              <label className='is-required'>Título</label>
                              <Controller
                                name="Subject"
                                control={control2}
                                defaultValue=""
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="text"
                                    className="form-control m-0"
                                    placeholder="Escribe aquí"
                                  />
                                )}
                              />
                              <small className='text-form' style={{color: 'red'}}>{errors2.subject?.message}</small>
                          </div>
                      </div>
                      <div className="modal__inputs__group gap-0">
                          <div className="modal__inputs__group__input margin-button-14">
                              <label className='is-required'>Contenido</label>
                              <textarea {...register2('ContentBody')} 
                              type="text" 
                              className="form-control m-0" 
                              placeholder="Escribe aquí" />
                              <small className='text-form' style={{color: 'red'}}>{errors2.contentBody?.message}</small>
                          </div>
                          <div className="modal__inputs__group__input align-items-center flex-row gap-1 margin-bottom-14">
                          <Controller
                            name="ToAllBase"
                            control={control2}
                            render={({ field }) => (
                              <input
                                type="checkbox"
                                className='w-fit-content cursor-pointer m-0'
                                style={{ minHeight: '0' }}
                                checked={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.checked);
                                  setIsToAllBase2(e.target.checked);
                                }}                            
                              />
                            )}
                          />
                            <label className='inline-block'>Para todos los usuarios</label>
                            <small className='text-form' style={{ color: 'red' }}>
                              {errors2.isGlobal?.message}
                            </small>
                          </div>
                          {!isToAllBase2 && (
                            <div className="modal__inputs__group__input">
                              <label>Elegir correos</label>
                              <Controller
                                name="ToUsers"
                                control={control2}
                                defaultValue={Array.isArray(getNotificationByIdStateAdmin?.to) ? getNotificationByIdStateAdmin.to : []}
                                render={({ field }) => {
                                  const selectedOptions = (Array.isArray(field.value) ? field.value : [])
                                    .map((value) => ({ label: value, value: value }));

                                  useEffect(() => {
                                    const toValue = Array.isArray(getNotificationByIdStateAdmin?.to)
                                      ? getNotificationByIdStateAdmin.to
                                      : [];

                                    setValue2('ToUsers', toValue);
                                  }, [getNotificationByIdStateAdmin, setValue2]);

                                  return (
                                    <>
                                    <ReactSelect
                                      options={dataNew?.map((value) => ({ label: value, value: value }))}
                                      isMulti
                                      className="react-select-container mb-0"
                                      classNamePrefix="react-select"
                                      value={selectedOptions}
                                      onChange={(selectedOptions) => {
                                        const selectedValues = selectedOptions.map((option) => option.value);
                                        field.onChange(selectedValues);
                                        handleSelectChange(selectedOptions);
                                      }}
                                      inputValue={inputValue}
                                      onInputChange={(newValue) => setInputValue(newValue)}
                                      filterOption={() => true}
                                    />
                                    <small className='mb-0'>Puedes buscar usuarios por <strong className='color-primary'>Nombre y Apellido, Correo o NIC.</strong></small>
                                    </>
                                  );
                                }}
                              />
                              <small className='text-form' style={{ color: 'red' }}>
                                {errors2.to?.message}
                              </small>
                            </div>
                          )}
                      </div>
                      <Controller
                        name="notificationDetails"
                        control={control2}
                        defaultValue={[]}
                        render={({ field }) => {
                          let onDrop2 = useCallback((acceptedFiles) => {
                            const validFiles = acceptedFiles.filter(file => allowedExtensions.includes(getFileExtension(file.name.toLowerCase())));
                            const invalidFiles = acceptedFiles.filter(file => !allowedExtensions.includes(getFileExtension(file.name.toLowerCase())));
                            let invalidFilesError = [];
                          
                            validFiles.forEach(file => {
                            //  const existingNotification = getNotificationAdmin.find(notification => {
                            //    return notification.notificationDetails.some(detail => detail.fileName === file.fileName);
                            //  });
                          
                            //  const fileExists = selectedFiles2.some(existingFile => existingFile.fileName === file.fileName);
                          
                            //  if (existingNotification || fileExists) {
                            //    Swal.fire({
                            //      title: 'Archivo Existente',
                            //      text: `Ya existe un archivo con el nombre ${file.fileName || file.name}. Por favor, cambie el nombre del archivo antes de agregarlo.`,
                            //      icon: 'error',
                            //      confirmButtonText: 'Aceptar'
                            //    });
                                
                            file.uuidCode = uuidv4();
                            
                            if((file.size / (1024 * 1024)).toFixed(2) < 2){
                              setSelectedFiles2((prevFiles) => [...prevFiles, file]);
                              field.onChange([...field.value, file]);
                            }else{
                              invalidFilesError.push(file);
                            }
                            //  }
                            });

                            setErrorFile2(invalidFilesError);
  
                            setInvalidFiles2((prevInvalidFiles) => [...prevInvalidFiles, ...invalidFiles]);
                          }, [allowedExtensions, getFileExtension, getNotificationAdmin, selectedFiles2, setSelectedFiles2, field, setInvalidFiles2, errorFile2]);

                          const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onDrop2, accept: allowedExtensions.join(',') });

                          return (
                            <div className="modal__inputs__gruop__input">
                              <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                                <input {...getInputProps()} />
                                <p>Arrastra y suelta algunos archivos aquí o haz clic para seleccionar archivos</p>
                              </div>
                              <small><strong className='color-primary'>IMPORTANTE: </strong>El peso máximo del archivo aceptado es 2MB.</small><br />
                              {
                              errorFile2?.map((file, index) => (
                                <>
                                <small key={index} style={{color: 'red'}}>El archivo que estás intentando adjuntar {file.name} supera los 2MB máximos permitidos, disminuye el peso del archivo e intenta de nuevo.</small> <br />
                                </>
                              ))
                            }
                              <ul className='p-0'>
                                {selectedFiles2?.map(file => (
                                  <li key={uuidv4()} className='align-items-center'>
                                    <img className='cursor-pointer icon__dropzone' src={images[getFileExtension(file.name || file.fileName)]} alt={`Archivo ${file.fileName}`} title={`Archivo ${file.fileName}`} />
                                    <span className='text-truncate flex-1'>{file.fileName || file.name}</span>
                                    <button className='btn btn-danger' onClick={(e) => {
                                      e.preventDefault();
                                      handleRemoveFile2(Number(file.fileId) || file.uuidCode);
                                      }}>Eliminar</button>
                                  </li>
                                ))}
                              </ul>
                              <div>
                                {invalidFiles2.map(file => (
                                  <p key={file.name || file.fileName}>La extensión del archivo no es compatible: <span className='text-danger'>{getFileExtension(file.name)}</span></p>
                                ))}
                              </div>
                              <small className='text-form' style={{ color: 'red' }}>
                                {errors2.notificationDetails?.message}
                              </small>
                              <small className='text-form' style={{ color: 'red' }}>
                                {errorFile}
                              </small>
                            </div>
                          );
                        }}
                      />
              </Modal.Body>
              <Modal.Footer>
                  <Button className='m-0' type='submit' variant="primary">Editar notificación</Button>
              </Modal.Footer>
          </Form>
        </Modal>
        }
        </>
      ) : (
        null
      )
    }
    </>
  )
}

export default AdminNotification;