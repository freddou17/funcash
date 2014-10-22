/**
 * 
 */
function initStorage(){
	var listeParticipants = localStorage.getItem("listeParticipants");
	listeParticipants = { "participants" : [
				{"pseudo": "fred", "total": 20, "impaye": 0},
				{"pseudo": "fred2", "total": 20, "impaye": 1},
				{"pseudo": "vince", "total": 20,"impaye": 4},
				{"pseudo": "anis", "total": 20, "impaye": 5}
			]
	};
	var listeSanctions = localStorage.getItem("listeSanctions");
	listeSanctions = { "sanctions" : [
				{"libelle": "retard", "valeur": 1},
				{"libelle": "oubli", "valeur": 2},
				{"libelle": "ca loupee", "valeur": 3}
			]
	};
	localStorage.setItem("listeParticipants", JSON.stringify(listeParticipants));
	localStorage.setItem("listeSanctions", JSON.stringify(listeSanctions));
}

function creerDetailsEtParticipants(){
	$.ajax({
    	type: "GET",
	    url: "storage.xml",
	    dataType: "xml",
	    success: initFunCash
	});
}

function initFunCash(xml){
	creerTplParticipant(xml);
	creerTplSanctions(xml);
}

/**
 * methode callback pour la mise en page de la liste des participants
 * 
 * @param xml le fichier xml de départ
 */
function creerTplParticipant(xml){
	var tplParticipant = $(xml).find("templateAfficherParticipant").text();
	var listeParticipants = jQuery.parseJSON(localStorage.getItem("listeParticipants"));
	$("#ulParticipants").html("");
	var totalComplete = 0;
	var ssTotEncaisse = 0;
	var ssTotImpaye = 0;
	$.each(listeParticipants.participants,function(key, val){
		 var pseudo = $(this)[0].pseudo.toUpperCase();
		 var valTotale = $(this)[0].total;
	     var valImpaye = $(this)[0].impaye;
	     var idPart = pseudo;
	     strDom = replaceTemplateParticipant(idPart, pseudo, valTotale, valImpaye, tplParticipant);
	     $("#ulParticipants").append(strDom);
	     ssTotEncaisse += valTotale;
	     ssTotImpaye += valImpaye;
	});
	$("#ulParticipants").listview().listview("refresh");
	$("#totalComplete").html(parseInt(ssTotEncaisse) + parseInt(ssTotImpaye));
	$("#ssTotalEncaisse").html(ssTotEncaisse);
	$("#ssTotalimpaye").html(ssTotImpaye);
}


/**
 * methode callback pour la mise en page de la liste des participants
 * 
 * @param xml le fichier xml de départ
 */
function creerTplSanctions(xml){
	var tplSanction = $(xml).find("templateAfficherLigneSanction").text();
	var sanctionsTpl = "";
	var listeSanctions = JSON.parse(localStorage.getItem("listeSanctions"));
	$.each(listeSanctions.sanctions, function(key, val){
		var libSanction = $(this)[0].libelle;
		var valSanction = $(this)[0].valeur;
		sanctionsTpl += replaceTemplateSanction(libSanction, valSanction, tplSanction);
	});
	$("#zoneSanctions").html("");
	$("#zoneSanctions").append(sanctionsTpl);
}

/**
 * Remplacement des valeurs dans le template
 * 
 * @param nom
 * @param valeur
 * @param sanctionsTpl
 * @param tpl
 * @returns {String}
 */
function replaceTemplateParticipant(id, nom, valeur, valImpayee, tpl){
	var tplMaj = "";
	tplMaj = tpl.replace(/!nom!/g, nom);
	tplMaj = tplMaj.replace(/!valeur!/g, valeur);
	tplMaj = tplMaj.replace(/!impaye!/g, valImpayee);
	return tplMaj;
}

/**
 * Creer une ligne d'ajout de sanction
 * 
 * @param libelle
 * @param valeurSanction
 * @param tpl
 * @returns {String}
 */
function replaceTemplateSanction(libelle, valeurSanction, tpl){
	var tplMaj = "";
	tplMaj = tpl.replace(/!valeurSanction!/g, valeurSanction);
	tplMaj = tplMaj.replace("!titreSanction!", libelle + ": " + valeurSanction);
	tplMaj = tplMaj.replace("!idPart!/g",0 );
	return tplMaj;
}

/**
 * @param idParticipant
 * @param val
 */
function ajouterSanction(valParam){
	calculerSommeParticipant(valParam, true);
}

/**
 * @param idParticipant
 * @param valParam
 * @param moreOrLess
 */
function calculerSommeParticipant(valParam, isAdd){
	var idParticipant = $("#partSelected").val();
	var listeParticipants = jQuery.parseJSON(localStorage.getItem("listeParticipants"));
	$.each(listeParticipants.participants,function(key, val){
		 var pseudo = $(this)[0].pseudo;
		 if(pseudo.toUpperCase() == idParticipant){
			 var newTot = parseInt($(this)[0].impaye); 
			 var newVal = !isAdd ? -(parseInt(valParam)) : parseInt(valParam);
			 $(this)[0].impaye = newTot + newVal;
			 $("#impaye").text(newTot + newVal);
			 
		 }
	});
	localStorage.setItem("listeParticipants", JSON.stringify(listeParticipants));
}

/**
 * @param idParticipant
 * @param val
 */
function retirerSanction(idParticipant,valParam){
	calculerSommeParticipant(idParticipant,valParam, false);
}



function getParticipants(idParticpant){
	
}

function insertParticipant(cle, pseudo, total){
	var participant = {
			pseudoPart: pseudo,
			totalPart: total
	};
	localStorage.setItem(cle, JSON.stringify(participant));
	
}


function goToDetaislPart(nom, tot, impaye){
	$("#titlePart").text("Les comptes de " + nom);
	$("#partSelected").val(nom);
	$("#impaye").text(impaye);
	$("#tot").text(tot);
	$.mobile.changePage("#detailsParticipant");
}

function encaisserParticipant(){
	var listeParticipants = jQuery.parseJSON(localStorage.getItem("listeParticipants"));
	$.each(listeParticipants.participants,function(key, val){
		 var pseudo = $(this)[0].pseudo;
		 if($("#partSelected").val() == pseudo.toUpperCase()){
			 var impaye = parseInt($(this)[0].impaye); 
			 var totalOld = parseInt($(this)[0].total);
			 $(this)[0].total = totalOld + impaye;
			 $("#tot").text($(this)[0].total);
			 $(this)[0].impaye = 0;
			 $("#impaye").text(0);
		 }
	});
	localStorage.setItem("listeParticipants", JSON.stringify(listeParticipants));
}

/**
 * 
 * 
 */
function showForm(idForm){
	if(idForm == "formS"){
		var listeSanctions = JSON.parse(localStorage.getItem("listeSanctions"));
		listeSanctions.sanctions.push({"libelle": $("#libSanc").val(), "valeur": $("#valSanc").val()})
		localStorage.setItem("listeSanctions", JSON.stringify(listeSanctions));
	}else if(idForm == "formP"){
		var listeParticipants = JSON.parse(localStorage.getItem("listeParticipants"));
		listeParticipants.participants.push({"pseudo": $("#part").val(), "total": 0, "impaye": 0})
		localStorage.setItem("listeParticipants", JSON.stringify(listeParticipants));
	}
	$("#"+idForm).show();
}
/**
 * 
 * 
 */
function addNelleSanction(idForm){
	if(idForm == "formS"){
		var listeSanctions = JSON.parse(localStorage.getItem("listeSanctions"));
		listeSanctions.sanctions.push({"libelle": $("#libSanc").val(), "valeur": $("#valSanc").val()})
		localStorage.setItem("listeSanctions", JSON.stringify(listeSanctions));
	}else if(idForm == "formP"){
		var listeParticipants = JSON.parse(localStorage.getItem("listeParticipants"));
		listeParticipants.participants.push({"pseudo": $("#part").val(), "total": 0, "impaye": 0})
		localStorage.setItem("listeParticipants", JSON.stringify(listeParticipants));
	}
	$("#popupMenu").popup("close");
	creerDetailsEtParticipants();
}


