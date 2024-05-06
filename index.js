const express = require("express");
const app = express();
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require("passport");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const db = require("pro.db");
const CryptoJS = require("crypto-js");
const Users = require("./Users.json");
// npm i express express-session memorystore passport body-parser ejs cookie-parser
const cors = require("cors"); // Add this line to import the CORS middleware
app.use(cors())
/* ------------------------------------------ */
app.use(
  session({
    store: new MemoryStore({ checkPeriod: 8640000 }),
    secret:
      "#@%#&^$^$%%@%sadgsau9pd@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgrasd3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
/* ------------------------------------------ */
function generateSHA256Hash(string) {
  const hash = CryptoJS.SHA256(string).toString();
  return hash;
}

app.get("/", function (req, res) {
  
  res.render("index");
});

app.get("/dash:id", function (req, res) {
  let num = req.url.split("/dash")[1];
  if (!req.session.user) return res.redirect("/login");
  
  let data = db.fetch(`components${num}`);
  if (!data) data = null;
  let computers = db.fetch(`computers${num}`);
  if (!computers) computers = null;
  res.render("dash", {
    bodycom: data,
    computers: computers,
    user: req.session.user,
  });
});

app.get("/dash", function (req, res) {
    if (!req.session.user) return res.redirect("/login");
    return res.redirect("/dash1")
});

app.get("/api/data", function (req, res) {
  let num = req.headers.referer.split("dash")[1];
  
  let data = db.fetch(`components${num}`);
  res.json(data);
});

app.get("/login", function (req, res) {
  
  if (req.session.user) return res.redirect("/");
  res.render("login", {
    error: null,
  });
});

app.get("/labs", function (req, res) {
    
    if (!req.session.user) return res.redirect("/login");
    const labbs = db.fetch("labs")
    res.render("asdag", {
      user: req.session.user,
      labs: labbs
    });
  });

  
// app.get("/login", function (req, res) {
//     if (!req.session.user) {
//         let hash = generateSHA256Hash("ksmkYaSfsddsga7by" + req.sessionID);
//         res.cookie("2ntMalOmk?", hash, {
//             expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
//             httpOnly: true,
//         });
//         res.render("login", {
//             error: null,
//         });
//     } else {
//     return res.redirect("/");
//     }
// });

/* ---------------------------------------------- */

app.post("/login", function (req, res) {

  const { email, pass } = req.body;
  let user = Users.Accounts.find((acc) => acc.email == email);
  if (user) {
    if (user.pass !== pass) {
      
      return res.render("login", {
        error: "password wrong",
      });
    } else {
      req.session.user = user;
      res.redirect("/");
    }
  } else {

    return res.render("login", {
      error: "i can't find this email",
    });
  }
});
app.post("/api/data/editpc", function (req, res) {
  const index = req.body.index;
  const newName = req.body.newName;

  let computers = db.fetch(`computers${num}`);
  
  if (index >= 0 && index < computers.length) {
      computers[index].name = newName;
      db.set(`computers${num}`, computers);
      return res.json("OK");
  } else {
      return res.status(400).json({ error: "Invalid index provided" });
  }
});


app.post("/api/data/editlab", function (req, res) {
  const labIndex = req.body.index;
  const updatedLab = req.body.updatedLab;
  let labs = db.fetch("labs");
  
  if (labIndex >= 0 && labIndex < labs.length) {
    labs[labIndex] = updatedLab;
    db.set("labs", labs);
    return res.json("OK");
  } else {
    return res.status(400).json({ error: "Invalid index provided" });
  }
});

app.post("/api/data/deletelab", function (req, res) {
  const labIndex = req.body.index;
  let labs = db.fetch("labs");
  
  if (labIndex >= 0 && labIndex < labs.length) {
    labs.splice(labIndex, 1);
    db.set("labs", labs);
    return res.json("OK");
  } else {
    return res.status(400).json({ error: "Invalid index provided" });
  }
});
app.post("/api/data/add", function (req, res) {
    let num = req.headers.referer.split("dash")[1];
 
  let data = db.fetch(`components${num}`);
  let line = data[req.body.num];
  if (!line.comments) {
    line.comments = [];
  }
  line.comments.push(req.body.comment);
  db.set(`components${num}`, data);
  return res.json("OKKKKK");
});

app.post("/api/data/edit", function (req, res) {
    let num = req.headers.referer.split("dash")[1];
  
  let data = db.fetch(`components${num}`);
  let line = data[req.body.num];
  line.comments = [];
  line.comments.push(req.body.comments);
  db.set(`components${num}`, data);
  console.log(line);
  return res.json("OKKKKK");
});

app.post("/api/data/newone", function (req, res) {
    let num = req.headers.referer.split("dash")[1];
  
  db.push(`components${num}`, req.body.newcom);
  return res.json("OKKKKK");
});

app.post("/api/data/addpc", function (req, res) {
    let num = req.headers.referer.split("dash")[1];
  
    console.log(req.body.newpc)
  db.push(`computers${num}`, req.body.newpc);
  return res.json("OKKKKK");
});

app.post("/api/data/addlab", function (req, res) {
db.push(`labs`, {name: req.body.name, Desc: req.body.Desc, img: req.body.img.split("images/")[1] });
return res.json("OKKKKK");
});


app.post("/api/data/remove", function (req, res) {
    let num = req.headers.referer.split("dash")[1];
  
  let data = db.fetch(`components${num}`);
  const indexToRemove = req.body.num;
  if (indexToRemove >= 0 && indexToRemove < data.length) {
    data.splice(indexToRemove, 1);
    db.set(`components${num}`, data);
    return res.json("OKKKKK");
  } else {
    return res.status(400).json({ error: "Invalid index provided" });
  }
});

app.post("/api/data/delete", function (req, res) {
    let num = req.headers.referer.split("dash")[1];
 
  db.delete(`components${num}`);
  return res.status(200).send("Done");
});

app.post("/api/data/deletepc", function (req, res) {
    let num = req.headers.referer.split("dash")[1];

  db.delete(`computers${num}`);
  return res.status(200).send("Done");
});
app.get('/api/rdp_file', (req, res) => {

  const { ip, username } = req.query;

  if (!ip || !username) {
      return res.status(400).json({ message: 'IP and username are required' });
  }

  const rdpContent = `
      full address:s:${ip}:3389
      username:s:${username}
  `;

  res.set({
      'Content-Type': 'application/x-rdp',
      'Content-Disposition': 'attachment; filename=remote_connection.rdp'
  });

  res.status(200).send(rdpContent);
});

app.get("*", function (req, res, next) {
 
  res.status(404).send({ error: false, message: "404" });
});

app.listen(80, () => {
  console.log("Hello world");
});
