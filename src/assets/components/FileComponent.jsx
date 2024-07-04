import excelIcon from '../images/icons/icon-excel.svg';
import imageIcon from '../images/icons/icon-image.svg';
import PdfIcon from '../images/icons/icon-pdf.svg';
import powerpointIcon from '../images/icons/icon-powerpoint.svg';
import rarIcon from '../images/icons/icon-rar.svg';
import txtIcon from '../images/icons/icon-txt.svg';
import videoIcon from '../images/icons/icon-video.svg';
import wordIcon from '../images/icons/icon-word.svg';
import zipIcon from '../images/icons/icon-zip.svg';

const FileComponent = ({ fileDetails, index }) => {
  
    const { fileName, fileType, filePath, fileData } = fileDetails;

    const handleClick = () => {
      
      const fileTypes = {
        '.pdf': 'application/pdf',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.txt': 'text/plain',
        '.mp4': 'video/mp4',
        '.avi': 'video/x-msvideo',
        '.zip': 'application/zip',
        '.rar': 'application/x-rar-compressed',
        '.xls': 'application/vnd.ms-excel',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      };

      const b64toBlob = (b64Data) => {
        const byteCharacters = atob(b64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: fileTypes[fileType] });

      };

      const blob = b64toBlob(fileData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
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
  
    const cleanedFileType = fileType.startsWith('.') ? fileType : `.${fileType}`;
    const imageSrc = images[cleanedFileType] || PdfIcon;
  
    return (
        <img className='cursor-pointer' src={imageSrc} alt={`Archivo ${fileName}`} title={`Archivo ${fileName}`} onClick={handleClick}/>
    );
  };

  export default FileComponent;