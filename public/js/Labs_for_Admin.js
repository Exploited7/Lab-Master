let imgs = document.querySelectorAll(".img");
var src = null;
let modellab = document.getElementById("modellab");
let createlab = document.getElementById("createlab");
var links = ["../images/img1.jpeg", "../images/img2.jpeg", "../images/img3.jpeg", "../images/img4.jpeg"];
let contoflabat = document.getElementById("labat");
let close = document.getElementById("close");
let labname = document.getElementById("name");
let labinfo = document.getElementById("info");
imgs.forEach(function(img){
    img.onclick = function () {
        imgs.forEach(function (i) { 
            i.classList.remove("active");
        })
        img.classList.add("active"); 
        src = img.getAttribute("src")
    }
})


function addnewlab() {
    createlab.innerHTML="Create Lab"
    modellab.style.display = "block";
    createlab.onclick = function () {
        let ex = /\w{1,}/ig;
        let stat = ex.test(labname.value);
        let random = Math.floor(Math.random() * links.length);
        if (stat){
            labname.classList.remove("is-invalid");
            modellab.style.display = "none";
            let newlab = {
                name:labname.value,
                Desc:labinfo.value,
                img: src|| links[random],
            }
            fetch("http://45.8.22.230:80/api/data/addlab", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newlab),
              })
                .then((res) => res.json())
                // window.location.href = "/labs"
                .then((data) => {
                })
                .catch((error) => {
                  console.error("Error:", error);
                });   
            labname.value = ""; 
            labinfo.value = "";
            window.location.reload()
            imgs.forEach(function (img) {
                img.classList.remove("active");
            })
        } else {
            labname.classList.add("is-invalid");
        }
    }
        close.onclick = function () {
        modellab.style.display = "none";
        labname.value="";
        labinfo.value="";
        imgs.forEach(function(img){
            img.classList.remove("active");
    })
    }
} 

function editlab(index) {
    modellab.style.display="block";
    createlab.innerHTML="Edit Lab"
    let random = Math.floor(Math.random() * links.length);

    createlab.onclick=function() {
      let ex = /\w{1,}/ig;
      let stat = ex.test(labname.value);
      if(stat) {
        const updatedLab = {
          name: labname.value,
          Desc: labinfo.value||"No Desc",
          img:links[random]
        };
    
        fetch("/api/data/editlab", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ index, updatedLab }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data === "OK") {
              window.location.reload();
            } else {
              console.error("Error editing lab");
            }
          });
          modellab.style.display = "none";
          labname.value="";
          labinfo.value="";
          imgs.forEach(function (img) {
            img.classList.remove("active");
      })
      }

    }
        close.onclick = function () {
        modellab.style.display = "none";
        labname.value="";
        labinfo.value="";
        imgs.forEach(function (img) {
            img.classList.remove("active");
    })
    }
  }


let mssfordeletelab=document.getElementById("mssfordeletelab") ; 
let yes=document.getElementById("yes") ;
let no =document.getElementById("no") ; 
let closemssforadmin =document.getElementById("closemssforadmin") ;
function deletelab(index) {
    mssfordeletelab.classList.replace("d-none", "d-block");
    yes.onclick = function () {
        fetch("http://45.8.22.230:80/api/data/deletelab", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ index }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data === "OK") {
                    // Close the modal
                    mssfordeletelab.classList.replace("d-block", "d-none");
                    // Reload the page
                    window.location.reload();
                } else {
                    console.error("Error deleting lab");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    no.onclick = function () {
        mssfordeletelab.classList.replace("d-block", "d-none");
    };
    closemssforadmin.onclick = function () {
        mssfordeletelab.classList.replace("d-block", "d-none");
    };
}