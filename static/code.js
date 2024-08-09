var fornecedores = [];
var solicitantes = [];
var idFor = 0;

function esconderCamposPersonalizados() {
  cpBox = $("#camposPersonalizadosBox");
  cpBox.hide();
  cps = cpBox.children();
  cps.each((i, e) => $(e).hide());
}
function attAssunto(assunto) {
  $("#assunto").val("");
  var idEmail = $("#idEmCaixa").val();
  var opSol = $("#solOp").val();
  var texto = " [";
  if (opSol == "cliente") {
    texto += "id_ti: " + idEmail + "]";
  } else {
    texto += "id_ag: " + idEmail + "]";
  }
  $("#assunto").val(assunto + texto);
}

function montarTemplate(template1, template2) {
  var editor = $("#email").cleditor();
  ed = editor[0];
  ed.$area.val("");
  ed.updateFrame();
  var template = [];
  template.push(template1[0]);
  template.push(template1[1]);
  template2.forEach((linha) => {
    template.push(linha);
  });
  for (var i = 2; i < template1.length; i++) {
    template.push(template1[i]);
  }

  template.forEach((linha) => {
    var texto = ed.$area.val() + linha + "<br>";
    ed.$area.val(texto);

    ed.updateFrame();
  });
  mudarCor("valores", "#FFFFFF00");
}
function definirTipo() {
  var desEmail = $("#desOp").val();
  $("#destinatario").val(desEmail);
  $("#tipOp").html('<option value="0">Selecione uma opção</option>');
  var idDes = $("#desOp").val();

  if (idDes != 0) {
    idFor = $("#forOp").val();
    var forn = fornecedores.find((forn) => forn.id == idFor);
    var tipos = forn.tipos.sort((t1, t2) => { return t1.assunto.localeCompare(t2.assunto) });
    tipos.forEach((tipo) => {
      $("#tipOp").append(
        '<option value="' + tipo.id + '">' + tipo.assunto + "</option>"
      );
    });
    $("#tipBox").show();
  } else {
    esconderCamposPersonalizados();
    $("#tipBox").hide();
  }
}
function mudarCor(word, color) {
  var editor = $("#email").cleditor();
  ed = editor[0];
  var content = ed.$area.val(); // Obtém o conteúdo HTML atual do editor
  var newContent = content.replace(
    new RegExp(`\\b${word}\\b`, "gi"),
    `<span style="color:${color};">${word}</span>`
  );
  ed.$area.val(newContent); // Define o novo conteúdo na textarea
  ed.updateFrame(); // Atualiza o editor com o novo conteúdo
}

function sendEmail() {
  var assunto = $("#assunto").val();
  var editor = $("#email").cleditor();
  ed = editor[0];
  var email = ed.$area.val();
  var cc = $("#cc").val();
  var destinatario = $("#destinatario").val();
  console.log("ASSUNTO JS: ", assunto);
  fetch("/sendEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      data: {
        assunto: assunto,
        email: email,
        cc: cc,
        destinatario: destinatario,
      },
    }),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      if(data=='Email enviado'){
        swal({
          title: "Email enviado com sucesso!"
        });
       
      }
      
    })
    .catch((error) => console.error("Erro:", error));
}
function addTemplate(data) {
  var editor = $("#email").cleditor();
  ed = editor[0];
  var email = ed.$area.val();

  var idOp = $("#tipOp").val();
  idFor = $("#forOp").val();
  $("#email").empty();
  var forn = data.fornecedores.find((forn) => forn.id == idFor);
  var tipos = forn.tipos;
  var tipo = tipos.find((tip) => tip.id == idOp);
  var campos = tipo.campos;
  var camposConteudo = [];
  var template = ["<span style='color:black;'>"];
  var texto = "";
  campos.forEach((cam) => {
    var campo = data.campos.find((cp) => cp.id == cam);
    camposConteudo.push(campo);
  });
  camposConteudo.forEach((campo) => {
    if ($("#" + campo.idElemento).val() != "") {
      texto = "<b>" + campo.nome.toUpperCase() + ":</b> ";
      texto += $("#" + campo.idElemento).val();
      template.push(texto);
    }
  });
  template.push("</span><br>valores");
  template = template.join("<br>");

  email = email.toString();
  email = email.replace("valores", template);

  ed.$area.val(email);
  mudarCor("valores", "#FFFFFF00");
  ed.updateFrame();

  $("#camposPersonalizadosBox input").val("");
}
function attTemplate(data) {
  var idOp = $("#tipOp").val();
  idFor = $("#forOp").val();
  var fornecedores = data.fornecedores;
  
  var forn = fornecedores.find((forn) => forn.id == idFor);
  var tipos = forn.tipos;
  var tipo = tipos.find((tip) => tip.id == idOp);
  if (idOp != 0) {
    $("#cpTxt").show();
    $("#cpBtn").show();
    attAssunto(tipo.assunto);
    esconderCamposPersonalizados();
    $("#camposPersonalizadosBox").show();
    var campos = tipo.campos;
    var camposConteudo = [];
    campos.forEach((cam) => {
      var campo = data.campos.find((cp) => cp.id == cam);
      camposConteudo.push(campo);
      $("#" + campo.idElemento + "Box").show();
      $("#" + campo.idElemento).show();
    });
    
    template1 = fornecedores[0].tipos.find((tipo)=> tipo.id == 0)
    console.log(template1)
    montarTemplate(template1.template, tipo.template);
  } else {
    esconderCamposPersonalizados();
  }
}
function definirCamposPersonalizados(campos) {
  cpBox = $("#camposPersonalizadosBox");

  campos.forEach((cam) => {
    var conteudo = "<div class='nf' id='" + cam.idElemento + "Box'>";
    conteudo += "<label for=" + cam.idElemento + ">" + cam.nome + ": </label>";
    var texto =
      "<input placeholder='Digite aqui o " +
      cam.nome.toLowerCase() +
      "' name=" +
      cam.idElemento +
      " class='form-control' id=" +
      cam.idElemento +
      "></div>";
    conteudo += texto;

    cpBox.append(conteudo);
  });
  cpBox.append("</div>");
}
function attId(idEmail) {
  var tipAssunto = $("#solOp").val();

  if (tipAssunto == "cliente") {
    idEmail = " [id_ti: " + idEmail + "]";
  } else {
    idEmail = " [id_ag: " + idEmail + "]";
  }
  $("#assunto").append(idEmail);
}
$(document).ready(() => {
  $("#forBox").hide();

  $("#cpTxt").hide();
  $("#cpBtn").hide();
  $("#desBox").hide();
  $("#tipBox").hide();
  $("#idEmBox").hide();
  $("#email").cleditor();

  // Função para carregar o arquivo JSON
  $.getJSON(
    "https://raw.githubusercontent.com/maraeliza/EmailsTemplate/main/static/dados.json",
    (data) => {
      campos = data.campos;
      definirCamposPersonalizados(campos);
      esconderCamposPersonalizados();

      solicitantes = data.solicitantes;
      fornecedores = data.fornecedores;

      montarTemplate(fornecedores[0].tipos[0].template, []);

      solicitantes.forEach((sol) => {
        $("#solOp").append(
          '<option value="' + sol.email + '">' + sol.nome + "</option>"
        );
      });
      fornecedores.forEach((forn) => {
        $("#forOp").append(
          '<option value="' + forn.id + '">' + forn.nome + "</option>"
        );
      });
      $("#solOp").change(() => {
        var solEmail = $("#solOp").val();
        if (solEmail == "cliente") {
          $("#idEmCaixa").attr("placeholder", "Digite o id do ticket");
          $("#labelId").text("ID do ticket: ");
        } else {
          $("#idEmCaixa").attr("placeholder", "Digite o id do agenda");
          $("#labelId").text("ID da agenda: ");
        }
        if (solEmail != "cliente" && solEmail != "ej") {
          $("#cc").val(solEmail);
        } else {
          $("#cc").val("");
        }
        var idEmail = $("#idEmCaixa").val();
        if (idEmail != "") {
          $("#forBox").show();
          var assunto = $("#assunto").val();
          if (assunto.length > 2) {
            var idOp = $("#tipOp").val();
            idFor = $("#forOp").val();
            var forn = fornecedores.find((forn) => forn.id == idFor);
            var tipos = forn.tipos;
            var tipo = tipos.find((tip) => tip.id == idOp);
            if (idOp != 0) {
              attAssunto(tipo.assunto);
            }
          }
        }
        $("#idEmBox").show();
      });
      $("#idEmCaixa").change(() => {
        var idEmail = $("#idEmCaixa").val();
        if (idEmail != "") {
          $("#forBox").show();
          var assunto = $("#assunto").val();
          if (assunto.length > 2) {
            var idOp = $("#tipOp").val();
            idFor = $("#forOp").val();
            var forn = fornecedores.find((forn) => forn.id == idFor);
            var tipos = forn.tipos;
            var tipo = tipos.find((tip) => tip.id == idOp);
            if (idOp != 0) {
              attAssunto(tipo.assunto);
            }
          }
        } else {
          $("#forOp").val(0);

          $("#forBox").hide();
          $("#desBox").hide();
          $("#tipBox").hide();
          esconderCamposPersonalizados();
        }
      });
      $("#forOp").change(() => {
        $("#desOp").html('<option value="0">Selecione uma opção</option>');
        idFor = $("#forOp").val();
        if (idFor != 0) {
          var forn = fornecedores.find((forn) => forn.id == idFor);

          forn.emails.forEach((email) => {
            $("#desOp").append(
              '<option value="' +
              email.email +
              '">' +
              email.nome +
              " [" +
              email.tipo +
              "]" +
              "</option>"
            );
          });
          if (idFor == 1) {
            $("#desOp").val(forn.emails[0].email);
            definirTipo();
          }
          $("#desBox").show();
        } else {
          $("#tipBox").hide();
          $("#desBox").hide();
          esconderCamposPersonalizados();
        }
      });
      $("#desOp").change(() => {
        definirTipo();
      });
      $("#tipOp").change(() => {
        attTemplate(data);
      });

      $("#camposPersonalizadosBox").on("input", "input", () => {
        //attTemplate(data);
      });
      $("#cpBtn").click(() => {
        addTemplate(data);
      });
    }
  ).fail((jqXHR, textStatus, errorThrown) => {
    console.error("Error fetching JSON data:", textStatus, errorThrown);
  });
});
