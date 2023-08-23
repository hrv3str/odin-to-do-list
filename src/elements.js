const element = (() => {
    //generates project label
    const projectLabel = (object) => { // Takes project object as argument
        const name = object.name; //Collects project data
        const source = object.techName
        cutName = () => { //Generates name for HTML
            let cutUp = '';
            if (name.length > 10) {
            cutUp = name.slice(0, 10);
            cutUp += '...';
            return cutUp;
          } else {
            return name;
          }
        }

        const labelBody = document.createElement('div'); //Creates label body
        labelBody.classList.add('project-label');

        //Generates content according to gathered info
        const labelBodyContent = `
            <button class="control title"
                title="View project"
                data-source="${source}"
                data-role="label">
                ${cutName()}
            </button>

            <button class="control edit"
                title="Edit project"
                data-source="${source}"
                data-role="edit">
            </button>

            <button class="control delete"
                title="Delete project"
                data-source="${source}"
                data-role="delete"></button>
        `;

        labelBody.innerHTML = labelBodyContent;

        return labelBody //Returns label
    }

    return {
        projectLabel
    }
    
})();

export default element