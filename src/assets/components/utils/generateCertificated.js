const generateCertificated = (data) => {
    const fileTypes = {
      '.pdf': 'application/pdf',
      '.png': 'image/png',
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
        return new Blob([byteArray], { type: fileTypes[data.fileType] });

        };

    const blob = b64toBlob(data.data ? data.data : data.fileData);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = data.fileName;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
}

export default generateCertificated;