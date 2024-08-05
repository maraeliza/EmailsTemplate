const firebaseConfig = {
    apiKey: "AIzaSyBG_LpCezsWhmYPWJyU3x_O4w2TAQoKkSE",
    authDomain: "mybase-fbee6.firebaseapp.com",
    databaseURL: "https://mybase-fbee6-default-rtdb.firebaseio.com",
    projectId: "mybase-fbee6",
    storageBucket: "mybase-fbee6.appspot.com",
    messagingSenderId: "369510224474",
    appId: "1:369510224474:web:f5d006683253ab4b257e63"
  };

firebase.initializeApp(firebaseConfig);
var db = firebase.database()
function login() {

    var email = document.getElementById("email").value;
    var password = document.getElementById("senha").value;
    
    db.ref("/users/").on("value", (data)=>{
        var dados = data.val();
        console.log(dados)
        for(var i in dados){
            console.log(dados[i])
            if(dados[i].email == email && dados[i].senha == password){
                window.location = "email.html"
            }else{
                swal({
                    title:"Email ou senha incorretos"
                })
                document.getElementById("email").value = '';
                document.getElementById("senha").value = '';
            }
        }
        
    
    })



}