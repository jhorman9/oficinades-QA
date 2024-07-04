const abreviattedName = (name) => {

    if(name) {
        const nameSplitted = name.split(' ');
        const nameAbreviatted = nameSplitted[0][0];
        const cocatName = nameAbreviatted;
        localStorage.setItem('abreviation', cocatName);
      }
};

export default abreviattedName;