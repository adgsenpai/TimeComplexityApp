//# ************************************************************************
//# Ashlin Darius Govindasamy - ADGSTUDIOS 2022
//# All rights reserved.
//# timecomplexityapp.js - Last modified: 2022/01/07    21:08
//# ************************************************************************
var output = "";

function getResponse() {
    var code = document.getElementById('codeArea').value + '\n"""\nThe time complexity of this function is';
    var payload = { "code": code };
    document.getElementById('progress').style.visibility = 'visible'
    document.getElementById('answer').style.visibility = 'hidden'
    fetch("https://adgstudios.co.za/api/v1/timecomplexity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        .then((res) => res.json())
        .then((data) => {
            document.getElementById('progress').style.visibility = 'hidden';
            document.getElementById('answer').style.visibility = 'visible';
            output = JSON.stringify(data);
            document.getElementById('answer').innerHTML = 'Time Complexity is : ' + JSON.parse(output)['result:'];
            console.log(data);
        })
        .catch((err) => console.log(err));
}