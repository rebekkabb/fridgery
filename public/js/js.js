function checkBoxes(e) {
    var value = e.name;
    var checked = e.checked;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/lists/checkInfo", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        value: value,
        checked: checked
    }));

}