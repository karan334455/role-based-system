const hasPermission = (current, required) => {
    return (current & required) === required;
};

export default hasPermission;
