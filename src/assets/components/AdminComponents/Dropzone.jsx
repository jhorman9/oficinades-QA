import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import PdfIcon from '../../images/icons/icon-pdf.svg';
import imageIcon from '../../images/icons/icon-image.svg';
import wordIcon from '../../images/icons/icon-word.svg';
import txtIcon from '../../images/icons/icon-txt.svg';
import videoIcon from '../../images/icons/icon-video.svg';
import excelIcon from '../../images/icons/icon-excel.svg';
import powerpointIcon from '../../images/icons/icon-powerpoint.svg';
import rarIcon from '../../images/icons/icon-rar.svg';
import zipIcon from '../../images/icons/icon-zip.svg';

const Dropzone = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [invalidFiles, setInvalidFiles] = useState([]);

  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.txt', '.mp4', '.avi', '.zip', '.rar', '.xls', '.ppt', '.pptx'];

  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter(file => allowedExtensions.includes(file.name.toLowerCase().slice(-4)));
    const invalidFiles = acceptedFiles.filter(file => !allowedExtensions.includes(file.name.toLowerCase().slice(-4)));

    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
    setInvalidFiles((prevInvalidFiles) => [...prevInvalidFiles, ...invalidFiles]);
  }, []);

  const handleRemoveFile = (fileName) => {
    setSelectedFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
    setInvalidFiles((prevInvalidFiles) => prevInvalidFiles.filter(file => file.name !== fileName));
  };

  const images = {
    '.pdf': PdfIcon,
    '.jpg': imageIcon,
    '.jpeg': imageIcon,
    '.png': imageIcon,
    '.doc': wordIcon,
    '.docx': wordIcon,
    '.txt': txtIcon,
    '.mp4': videoIcon,
    '.avi': videoIcon,
    '.zip': zipIcon,
    '.rar': rarIcon,
    '.xls': excelIcon,
    '.ppt': powerpointIcon,
    '.pptx': powerpointIcon
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: allowedExtensions.join(',') });

  return (
    <div>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <p>Arrastra y suelta algunos archivos aquí o haz clic para seleccionar archivos</p>
      </div>
      <ul className='p-0'>
        {selectedFiles.map(file => (
          <li key={file.name} className='align-items-center'>
            <img className='cursor-pointer icon__dropzone' src={images[file.name.toLowerCase().slice(-4)] || PdfIcon} alt={`Archivo ${file.name}`} title={`Archivo ${file.name}`} />
            <span className='text-truncate flex-1'>{file.name}</span>
            <button className='btn btn-danger' onClick={() => handleRemoveFile(file.name)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <div>
        {invalidFiles.map(file => (
          <p key={file.name}>La extensión del archivo no es compatible: <span className='text-danger'>{file.name.toLowerCase().slice(-4)}</span></p>
        ))}
      </div>
    </div>
  );
};

export default Dropzone;
