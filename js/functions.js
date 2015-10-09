

$(function() {
	$(".deco").hide();
	// AUTOCOMPLETE
	$( document ).on( "pageinit", "#choice", function() {
			$( "#autocomplete" ).on( "filterablebeforefilter", function ( e, data ) {
				var $ul = $( this ),
				$input = $( data.input ),
				value = $input.val(),
				html = "";
				$ul.html( "" );
				if ( value && value.length > 0 ) {
					$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
					$ul.listview("refresh");
					$.ajax({
						type: 'POST',
						url: "./php/search.php",
						dataType: "json",
						crossDomain: true,
						async: 'true',
						data: {
							q: $input.val(), }
					})
					.then( function (response) {
						$.each( response, function ( i, val ) {
							html += '<li><a href="#list" class="test" title="'+ val.libelleVil +'">' + val.libelleVil + ' ('+val.codePosVil+') </a></li>';
					
						});

						$ul.html( html );
						$ul.listview( "refresh" );
						$ul.trigger( "updatelayout");
						
						$('.test').click(function(event){
							event.preventDefault();
							var nomVille = $(this).attr("title");
							ville(nomVille);
						});
					});
				}
			});
		});

});

	$(document).on('pageinit','#splash',function(){ 
    setTimeout(function(){
        $.mobile.changePage("#stars", "fade");
    }, 2000);
});

	//CONNECT
	function connec(login){
		sessionStorage.setItem("login",login);
		$('.deco').show();
		$('.co').hide();
	}


	//ETOILES
	var NbEtoile;
	function etoile(etoile) {
		NbEtoile = etoile;
		document.location.href="#choice";
	}

	//VILLE
	function ville(NomVil) {

		var NomVil = NomVil;

			$.ajax({
				type: "POST",
				url: "./php/traitement.php",
				data: {etoile : NbEtoile, nom : NomVil},
				success: function(json){
					document.getElementById("list-recherche").innerHTML = "";
					
					$.each(json, function (key, data) {
	
							var parentlist = document.getElementById("list-recherche");
							var li = document.createElement("li");
							li.className = "ui-li-has-thumb";

							var a = document.createElement("a");
							a.setAttribute("data-id", data.idRes);
							a.className = "link-fiche";

							var img = document.createElement("img");
							img.setAttribute("src", "./images/thumbnail/"+data.photoRes);

							var h2 = document.createElement("h2");
							var titre = document.createTextNode(data.nomRes);
							h2.appendChild(titre);

							var p1 = document.createElement("p");
							p1.className = "etoiles e"+data.etoileRes;

							a.appendChild(img);
							a.appendChild(h2);
							a.appendChild(p1);

							li.appendChild(a);

							parentlist.appendChild(li);
							$('#list-recherche').listview().listview('refresh');

							document.location.href="#list";
							
						
							$('.link-fiche').click(function(event){
								event.preventDefault();
								var id = $(this).attr("data-id");
								fiche(id);
								avis(id);
								avis2(id);
								type(id);
								$("#donnerAvis").click(function(){
									donnerAvis(id);
								});
							});
					})
				},
				failure: function() {
					document.getElementById("list-recherche").innerHTML= "Erreur !";
				}
			});
			
	}

	// FICHE RESTAURANT
	function fiche(id){
		$.mobile.loading('show');
		$.ajax({
			url : "./php/restaurant.php",
			type : "POST",
			data : {id : id},
			success : function(res){
				var data = res[0];
				$('.tel_resto').attr("href", "tel:0" + data.numRes);
				$('.img_resto').attr("src", "./images/"+data.photoRes);
				$('.mini_img_resto').attr("src", "./images/thumbnail/"+data.photoRes);
				$('.title_resto').html(data.nomRes);
				$('.chef_resto').html(data.chefRes);
				$('.prix_resto').html(data.tarifRes + " €");
				$('.specialite').html("Spécialité : "+ data.speRes);
				$('.description').html(data.descripRes);
				$('.tel_resto').html("0"+data.numRes);
				$('.email_resto').html(data.emailRes);
				$('.site_resto').html(data.siteRes);
				$('.adresse').html(data.adresse1Res+" "+data.codePosVil+" "+data.libelleVil);
				if(data.etoileRes != 3)
					$('#etoiles').addClass("e" + data.etoileRes);
				$("#content_map").html("");
				map(data.latRes, data.lonRes);
			}
		})
		document.location.href="#page";
	}

	//MAP
	function map(lattitude, longitude){
		
		$(document).on("pageshow", "#contact", function(){
			
			var mapOptions = {
				center: { lat: lattitude, lng: longitude},
				zoom: 10,
			};
			var marker = new google.maps.Marker({
				position: { lat: lattitude, lng: longitude},
				map: map,
			});
			var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			marker.setMap(map);
		});
		
		$(document).on("pageshow", "#super_map", function(){
			
			var directionsDisplay;
			var directionsService = new google.maps.DirectionsService();
			var map;
			
			  if(navigator.geolocation) {
				directionsDisplay = new google.maps.DirectionsRenderer();
				navigator.geolocation.getCurrentPosition(function(position) {
					var mapOptions = {
						center: { lat: position.coords.latitude, lng: position.coords.longitude },
						zoom: 10
					};
					var marker = new google.maps.Marker({
						position: { lat: position.coords.latitude, lng: position.coords.longitude },
						map: map,
						});			
					marker.setMap(map);
					
			var map = new google.maps.Map(document.getElementById("content_map"), mapOptions);
			marker.setMap(map);
			
			directionsDisplay.setMap(map);

			var start = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
			var end = new google.maps.LatLng(lattitude, longitude);
			var request = {
			      origin:start,
			      destination:end,
			      travelMode: google.maps.TravelMode.DRIVING
			  };
			  directionsService.route(request, function(response, status) {
			    if (status == google.maps.DirectionsStatus.OK) { directionsDisplay.setDirections(response); }
			  });
			});
			}
		});
	}
	
	function map_iti() {
		document.location.href="#super_map";
	}

var Modelavis = $('.barre').clone();

	// FICHE RESTAURANT (AVIS)
	function avis(id){
		$.mobile.loading('show');
		$.ajax({
			url : "./php/avis.php",
			type : "POST",
			data : {id : id},
			success : function (av){
				for(var i in av) {
					var nouveauAvis = $('.barre').clone();
	                nouveauAvis.find('.identite_client').text(av[i].loginCli);
	                nouveauAvis.find('.date_avis').text(av[i].dateAv);
	                nouveauAvis.find('.note_table').attr("src", "images/note_avis"+av[i].noteTable+".png");
	                nouveauAvis.find('.note_cadre').attr("src", "images/note_avis"+av[i].noteCadre+".png");
	                nouveauAvis.find('.note_service').attr("src", "images/note_avis"+av[i].noteService+".png");
	                nouveauAvis.find('.note_qualprix').attr("src", "images/note_avis"+av[i].noteRapQual+".png");
					nouveauAvis.find('.comment_client').text(av[i].comAv);
	                $(nouveauAvis).appendTo('.papa_avis');
		        }
		        $('.barre').first().remove();
		    }
		})
	}
	
	// FICHE RESTAURANT (AVIS 2 MOYENNE NOMBRE)
	function avis2(id){
		$.mobile.loading('show');
		$.ajax({
			url : "./php/moyenne.php",
			type : "POST",
			data : {id : id},
			success : function(av){
				$.each(av, function (key, data) {
			 		$('.moyenne').html(Math.round(data.moyenne));
			 		$('.total').html(data.total);
				})
			}
		})
	}
	
	// FICHE RESTAURANT (TYPE)
	function type(id){
		$.mobile.loading('show');
		$.ajax({
			url : "./php/type.php",
			type : "POST",
			data : {id : id},
			success : function(ty){
				$.each(ty, function (key, data) {
					$('.cuisine_resto').html(data.libelleTy);
				}
			)}
		})
	}

	//LIST RESTO
	function list(restos) {
		var nom = restos.getElementsByTagName("nom");
		alert(nom.firstChild.data);
	}

	//CONNEXION
	function connexion(logi, password){
		var login = logi;
		var mdp = password;
		$.ajax({
			type: "POST",
			url: "./php/connexion.php",
			data: {log : login, pass : mdp},
			success: function(connec1){
				var data = connec1[0];
				if(data.nb == 0){
					$('#erreur').removeClass("erreur");
					$('#erreur').addClass("erreur2");
				}
				else{
					connec(login);
					document.location.href="#stars";
				}
			},
			failure: function() {
				document.getElementById("list-recherche").innerHTML= "Erreur !";
			}
		});
	}
	
	//DECONNEXION
	function deconnexion(){
		sessionStorage.removeItem("login");
		$('.deco').hide();
		$('.co').show();
	}
	
	//DONNER AVIS
	function donnerAvis(idRes){
		var id = idRes;
		if(sessionStorage.getItem("login") == null){
			document.location.href="#connection";
		}
		else{
			document.location.href="#addAvis";
			document.getElementById("commenter").onclick = function() { ajoutAvis(id);	}
		}
	}
	
	//AJOUT AVIS
	function ajoutAvis(idRes){
		var id = idRes;
		$('#form1').on('submit', function(e) {
        e.preventDefault();
        var noteT = $('#noteT').val();
        var noteS = $('#noteS').val();
        var noteC = $('#noteC').val();
        var noteQ = $('#noteQ').val();
        var comm = $('#comm').val();
        var log = sessionStorage.getItem("login");
        

        if(noteT == '') noteT =0;
        if(noteS == '') noteS =0;
        if(noteC == '') noteC =0;
        if(noteQ == '') noteQ =0;

         $.ajax({
            url: $(this).attr('action'),
            type: $(this).attr('method'),
            data: {
            	noteT : noteT,
            	noteS : noteS,
            	noteC : noteC,
            	noteQ : noteQ,
            	comm : comm,
            	id : id,
            	log : log
            },
            success: function() {
              	document.location.href="#page";
                }
            });
 
    });
	}
	
	function compte(){
		$('#form2').on('submit', function(e) {
			e.preventDefault();
			var newlogin = $('#nlogin').val();
			var newmail = $('#nemail').val();
			var newmdp = $('#nmdp').val();
			
			$.ajax({
				url: $(this).attr('action'),
            	type: $(this).attr('method'),
            	data: {
            		newlogin : newlogin,
            		newmail : newmail,
            		newmdp : newmdp,
            	},
            	success: function(connec2) {
              		var data = connec2[0];
					if(data.nb == 1){
						$('#erreur1').removeClass("erreur3");
						$('#erreur1').addClass("erreur4");
					}
					else{
						connec(newlogin);
						document.location.href="#stars";
					}
            	},
            	failure: function() {
					document.getElementById("list-recherche").innerHTML= "Erreur !";
				}
			});
			
		});
	}
		
	
	//INIT
	function init() {
		if(sessionStorage.getItem("login") != null){
			var login = sessionStorage.getItem("login");
			connec(login);
		}
		var listetoile = document.querySelectorAll(".etoile");
		for(var i = 0 ; i < listetoile.length ; i++) {
			listetoile[i].onclick = function() { etoile(this.id) };
		}
		document.querySelector(".connection").onclick = function(){ 
			connexion($("#login").val(), $("#mdp").val());
		};
		for (var i in document.getElementsByClassName('deconnection')){
  			document.getElementsByClassName('deconnection')[i].onclick = function(){ 
  				deconnexion();
  			};
		}
		document.getElementById("itineraire").onclick = function() { map_iti();	}
		document.getElementById("mini_itineraire").onclick = function() { map_iti(); }
		document.getElementById("newCompte").onclick = function(){ compte(); }
	}

	window.onload = function () {
		init();	
	}

