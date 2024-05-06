// let components = fetch("/api/data").then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     response.json();
//   })
//   .then(data => {
//     // console.log(data);
//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
// });

var btns = document.getElementsByClassName("btn-primary");
var bodycom = document.getElementById("bodycom");
var bodycomutes = document.getElementById("bodycomutes");
var alertt = document.getElementById("alert");
var writecomment = document.querySelector(".writecomment");
var input = document.getElementById("inputcomment");
var addc = document.querySelector(".addc");
var comment = document.getElementsByClassName("comment");
var close = document.getElementById("close");
var editation = document.getElementById("editation");
var addedit = document.getElementById("Edit");
var inputtype = document.getElementById("type");
var inputquant = document.getElementById("quantity");
var inputrun = document.getElementById("run");
var inputdamage = document.getElementById("damage");
var inputqcomments = document.getElementById("comments");
var closeEdatation = document.getElementById("closeedit");
var alertfortype = document.getElementById("alertfortype");
var alertforq = document.getElementById("alertforq");
var alertforsum = document.getElementById("alertforsum");
var contaddpc = document.getElementById("contaddpc");
var addpc = document.getElementById("addpc");
var inputnamepc = document.getElementById("namepc");
var inputpcstat = document.getElementById("stauteconntct");
var createpc = document.getElementById("createpc");
var alertforstatpc = document.getElementById("alertforstatpc");
var alertfornamepc = document.getElementById("alertfornamepc");
var closeaddpc = document.getElementById("closeaddpc");
var contofeditpc = document.getElementById("contofeditpc");
var nameofedit = document.getElementById("editnamepc");
var btnedirpc = document.getElementById("btneditpc");
var alertnameedit = document.getElementById("alertfornameedit");
var closeeditpc = document.getElementById("closeeditpc");
let mssforuser = document.getElementById("mssforuser");
let deleteallcomputers = document.getElementById("deleteallcomputers");
let btntodeletallcom = document.getElementById("deleteallcom");
let yes = document.getElementById("yes");
let no = document.getElementById("no");
let closemsscom = document.getElementById("closemsscom");


function showInputDialog() {
    // var ip = prompt('Enter the IP address:');
    var username = prompt('Enter the username:');
    if (!username) {
        alert('username is required');
        return;
    }
    fetch("http://45.8.22.230:80/api/rdp_file?ip=" + ip + "&username=" + username, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((res) => {
        if (res.ok) {
            return res.blob();
        }
        throw new Error('Network response was not ok.');
    })
    .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'remote_connection.rdp';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}


function add(index) {
  console.log(index);
  writecomment.style.display = "block";
  addc.onclick = function () {
    let reg = /\w{2,}/gi;
    let stat = reg.test(input.value);
    if (stat) {
      alertt.classList.add("d-none");
      writecomment.style.display = "none";
      console.log(input.value);
      const postData = { comment: input.value, num: index };
      fetch("http://45.8.22.230:80/api/data/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((res) => res.json())
        .then((data) => {
          
          input.value = "";
          location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      alertt.classList.remove("d-none");
    }
  };
}

close.addEventListener("click", function () {
  writecomment.style.display = "none";
  alertt.classList.add("d-none");
  input.value = "";
});

function lol() {
  howwritecomment.classList.replace("d-none", "d-block");
}

var howwritecomment = document.getElementById("howwritecomment");
async function edit(index) {
  const response = await fetch("/api/data");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const components = await response.json();

  howwritecomment.classList.replace("d-block", "d-none");
  addedit.innerHTML = "Edit";
  editation.classList.replace("d-none", "d-block");
  inputtype.value = components[index].type;
  inputquant.value = components[index].Quantity;
  inputrun.value = components[index].running;
  inputdamage.value = components[index].Damage;
  inputqcomments.value =
    components[index].comments.join(" , ") || "No Comments";
  addedit.onclick = function () {
    let regnumber = /\d{1,}/gi;
    let regtype = /\w{2,}/gi;
    let typestat = regtype.test(inputtype.value);
    let qstaut = regnumber.test(inputquant.value);
    let sum = +inputrun.value + +inputdamage.value === +inputquant.value;
    if (
      typestat &&
      qstaut &&
      (sum === true || (inputrun.value === "" && inputdamage.value === ""))
    ) {
      components[index].type = inputtype.value;
      components[index].Quantity = inputquant.value;
      components[index].running = inputrun.value || "Unknown";
      components[index].Damage = inputdamage.value || "Unknown";
      components[index].comments =
        inputqcomments.value == "" ? [] : inputqcomments.value.split(",");
      const postData = {
        num: index,
        type: inputtype.value,
        Quantity: inputquant.value,
        running: inputrun.value || "Unknown",
        Damage: inputdamage.value || "Unknown",
        comments:
          inputqcomments.value == "" ? [] : inputqcomments.value.split(","),
      };
      fetch("http://45.8.22.230:80/api/data/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((res) => res.json())
        .then((data) => {
          
          input.value = "";
          location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      editation.classList.replace("d-block", "d-none");
      alertforq.classList.replace("d-block", "d-none");
      alertforsum.classList.replace("d-block", "d-none");
      alertfortype.classList.replace("d-block", "d-none");
      
      howwritecomment.classList.replace("d-block", "d-none");
    } else {
      if (typestat == false) {
        alertfortype.classList.replace("d-none", "d-block");
        alertforq.classList.replace("d-block", "d-none");
        alertforsum.classList.replace("d-block", "d-none");
      } else if (qstaut === false) {
        alertfortype.classList.replace("d-block", "d-none");
        alertforq.classList.replace("d-none", "d-block");
        alertforsum.classList.replace("d-block", "d-none");
      } else if (sum === false) {
        alertfortype.classList.replace("d-block", "d-none");
        alertforq.classList.replace("d-block", "d-none");
        alertforsum.classList.replace("d-none", "d-block");
      }
    }
  };
}
closeEdatation.addEventListener("click", function () {
  editation.classList.replace("d-block", "d-none");
  editation.classList.replace("d-block", "d-none");
  alertforq.classList.replace("d-block", "d-none");
  alertforsum.classList.replace("d-block", "d-none");
  alertfortype.classList.replace("d-block", "d-none");
  howwritecomment.classList.replace("d-block", "d-none");
});

var addcom = document.getElementById("addcom");
addcom.onclick = function () {
  addedit.innerHTML = "Add";
  howwritecomment.classList.replace("d-block", "d-none");
  inputtype.value = "";
  inputquant.value = "";
  inputrun.value = "";
  inputdamage.value = "";
  inputqcomments.value = "";
  editation.classList.replace("d-none", "d-block");
  addedit.onclick = function () {
    let regnumber = /\d{1,}/gi;
    let regtype = /\w{2,}/gi;
    let typestat = regtype.test(inputtype.value);
    let qstaut = regnumber.test(inputquant.value);
    let sum = +inputrun.value + +inputdamage.value === +inputquant.value;
    if (
      typestat &&
      qstaut &&
      (sum === true || (inputrun.value === "" && inputdamage.value === ""))
    ) {
      let newcom = {
        type: inputtype.value,
        Quantity: inputquant.value,
        running: inputrun.value || "Unknown",
        Damage: inputdamage.value || "Unknown",
        comments:
          inputqcomments.value == "" ? [] : inputqcomments.value.split(","), //` <li> ${inputqcomments.value || "No Comments"}</li> `
      };
      const postData = { newcom };
      fetch("http://45.8.22.230:80/api/data/newone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((res) => res.json())
        .then((data) => {
          location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      editation.classList.replace("d-block", "d-none");
      alertforq.classList.replace("d-block", "d-none");
      alertforsum.classList.replace("d-block", "d-none");
      alertfortype.classList.replace("d-block", "d-none");
    } else {
      if (typestat === false) {
        alertfortype.classList.replace("d-none", "d-block");
        alertforq.classList.replace("d-block", "d-none");
        alertforsum.classList.replace("d-block", "d-none");
      } else if (qstaut === false) {
        alertfortype.classList.replace("d-block", "d-none");
        alertforq.classList.replace("d-none", "d-block");
        alertforsum.classList.replace("d-block", "d-none");
      } else if (sum === false) {
        alertfortype.classList.replace("d-block", "d-none");
        alertforq.classList.replace("d-block", "d-none");
        alertforsum.classList.replace("d-none", "d-block");
      }
    }
  };
};

function removecom(index) {
  const postData = { num: index };
  fetch("http://45.8.22.230:80/api/data/remove", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((res) => res.json())
    .then((data) => {
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

var ippcadd = document.getElementById("ippcadd");
var alertforipadd = document.getElementById("alertforipadd");
addpc.onclick = function () {
  contaddpc.classList.replace("d-none", "d-block");
  createpc.onclick = function () {
    let regtype = /\w{2,}/gi;
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    let statip = ipRegex.test(ippcadd.value);
    let stautofname = regtype.test(inputnamepc.value);
    if (stautofname == true && statip == true) {
      contaddpc.classList.replace("d-block", "d-none");
      let newpc = {
        name: inputnamepc.value,
        staute: "?",
        IPAddress: ippcadd.value,
      };
      const postData = { newpc };
      fetch("http://45.8.22.230:80/api/data/addpc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((res) => res.json())
        .then((data) => {
          location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });      
      inputnamepc.value = "";
      inputpcstat.value = "";
      alertfornamepc.classList.replace("d-block", "d-none");
    } else {
      if (stautofname == false) {
        alertfornamepc.classList.replace("d-none", "d-block");
        alertforipadd.classList.replace("d-block", "d-none");
      } else {
        alertfornamepc.classList.replace("d-block", "d-none");
        alertforipadd.classList.replace("d-none", "d-block");
      }
    }
  };
};

closeaddpc.onclick = function () {
  contaddpc.classList.replace("d-block", "d-none");
  alertfornamepc.classList.replace("d-block", "d-none");
  alertforipadd.classList.replace("d-block", "d-none");
  inputnamepc.value = "";
  ippcadd.value = "";
};

var ippcedit = document.getElementById("ippcedit");
var alertforipedit = document.getElementById("alertforipedit");
function editpc(index) {
  contofeditpc.classList.replace("d-none", "d-block");
  nameofedit.value = computers[index].name;
  ippcedit.value = computers[index].IPAddress;
  btnedirpc.onclick = function () {
    let regname = /\w{2,}/gi;
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    let statip = ipRegex.test(ippcedit.value);
    let statname = regname.test(nameofedit.value);
    if (statname === true && statip == true) {
      computers[index].name = nameofedit.value;
      computers[index].IPAddress = ippcedit.value;
      
      nameofedit.value = "";
      contofeditpc.classList.replace("d-block", "d-none");
      alertnameedit.classList.replace("d-block", "d-none");
      alertforipedit.classList.replace("d-block", "d-none");
    } else {
      if (statname == false) {
        alertnameedit.classList.replace("d-none", "d-block");
        alertforipedit.classList.replace("d-block", "d-none");
      } else {
        alertforipedit.classList.replace("d-none", "d-block");
        alertnameedit.classList.replace("d-block", "d-none");
      }
    }
  };
}
closeeditpc.onclick = function () {
  contofeditpc.classList.replace("d-block", "d-none");
  alertnameedit.classList.replace("d-block", "d-none");
  alertforipedit.classList.replace("d-block", "d-none");
};

// Add an event listener to the Remove button
function deletee(index) {
  // Send a POST request to your backend endpoint to remove the PC
  fetch('/api/data/deletepc', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          // 'Referer': window.location.href
      },
      body: JSON.stringify({
          index: index
      })
  })
  .then(response => {
      if (response.ok) {
          // If the request was successful, reload the page to reflect the changes
          window.location.reload();
      } else {
          // Handle error response
          console.error('Error:', response.statusText);
      }
  })
  .catch(error => {
      // Handle network errors
      console.error('Error:', error);
  });
}


btntodeletallcom.addEventListener("click", function () {
  mssforuser.classList.remove("d-none");
  yes.onclick = function () {
    fetch("http://45.8.22.230:80/api/data/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    location.reload();
    mssforuser.classList.add("d-none");
  };
  no.onclick = function () {
    mssforuser.classList.add("d-none");
  };
  closemsscom.onclick = function () {
    mssforuser.classList.add("d-none");
  };
});

deleteallcomputers.addEventListener("click", function () {
  mssforuser.classList.remove("d-none");
  yes.onclick = function () {
    fetch("http://45.8.22.230:80/api/data/deletepc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });    
      location.reload();
    mssforuser.classList.add("d-none");
  };
  no.onclick = function () {
    mssforuser.classList.add("d-none");
  };
  closemsscom.onclick = function () {
    mssforuser.classList.add("d-none");
  };
});

function isValidIP(ip) {
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}
