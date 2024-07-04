const deleteCredentials = () => {
    localStorage.clear();
    window.location.href = '/';
}

export default deleteCredentials;