
function writedFontSize(){
	var fontSizes = "";
	for(var i=16; i < 37; i++){
		fontSizes += "<option>"+i+"</option>";
	}
	
	$('#text_font_size').append(fontSizes);
}

function writeFontFamily(){
	var families = ['Arial','Impact', 'Calibri', 'Comic Sans'];
	var fontFamilies = "";
	for(var i=0; i < families.length; i++){
		fontFamilies += "<option>"+families[i]+"</option>";
	}
	$('#text_font_family').append(fontFamilies);
}



$(document).ready(function(){
	
	writedFontSize();
	writeFontFamily();

	var id_slider = '#fb_slider_';
	var SELECTED_CLASSNAME = 'selected';
	var width = 600;
    var height = 500;
	var activ = null;
	var activ_layer_index = 0;
	var activ_text = null;

	var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });
	var layers = new Array();
	var fb_images = new Array();
	
	function addImage(layer, image){
		var i_height = 137;
		var i_width = 150;
		var darthVaderImg = new Konva.Image({
			width: i_width,
			height: i_height,
			stroke: 'red',
			strokeWidth: 5,
			strokeEnabled: false
		});
		

		var darthVaderGroup = new Konva.Group({
			x: 380,
			y: 200,
			draggable: true,
			offset: {
            	x: i_width/2,
            	y: i_height/2
        	},
        	/*clip: {
            	x : 380,
            	y : 100,
            	width : 200,
            	height : 300
       		}*/
		});
		layer.add(darthVaderGroup);
		darthVaderGroup.add(darthVaderImg);
		addAnchor(darthVaderGroup, i_width/2, -20, 'top');
		addAnchor(darthVaderGroup, 0, 0, 'topLeft');
		addAnchor(darthVaderGroup, i_width, 0, 'topRight');
		addAnchor(darthVaderGroup, i_width, i_height+1, 'bottomRight');
		addAnchor(darthVaderGroup, 0, i_height+1, 'bottomLeft');
		
		var imageObj1 = new Image();
		
	  darthVaderGroup.on('mouseover', function() {
			activ = this;
      });

      darthVaderGroup.on('mouseout', function() {
			activ = null;
      });
	  
	  
		imageObj1.onload = function() {
			darthVaderImg.image(imageObj1);
			layer.draw();
		};
		imageObj1.src = image;
	}


	function addText(layer, text){

		var fontSize = $('#text_font_size').val();
		var fontFamily = $('#text_font_family').val();

		var textpath = new Konva.Text({
		  x: 340,
		  y: 120,
		  fill: $('#text').css('color'),
		  fontSize: fontSize,
		  fontFamily: fontFamily,
		  text: text,
		  draggable: true
		});


		textpath.offsetX(textpath.textWidth/2);
		textpath.offsetY(textpath.textHeight/2);
		textpath.on('mouseover', function(e) {
			activ = this;
	    });

	    textpath.on('mouseout', function(e) {
			activ = null;
	    });
		
		activ_text = textpath;

		layer.add(textpath);
		layer.draw();
	}


	$('#text_font_size').change(function(){
		if(activ_text){
			activ_text.setFontSize($('#text_font_size').val());
			layers[activ_layer_index].draw()
		}
	});

	$('#text_font_family').change(function(){
		if(activ_text){
			activ_text.setFontFamily($('#text_font_family').val());
			layers[activ_layer_index].draw()
		}
	});


	$('#text').change(function(){
		if(activ_text){
			activ_text.setText($('#text').val());
			activ_text.offsetX(activ_text.textWidth/2);
			activ_text.offsetY(activ_text.textHeight/2);
			layers[activ_layer_index].draw()
		}
	});


	$('#text_rotate').change(function(){
		if(activ_text){
			activ_text.rotate($('#text_rotate').val());
			layers[activ_layer_index].draw()
		}
	});

	function switchLayer(index){
		activ_layer_index = index;
		for(var i = 0; i < layers.length; i++){
			if(i != activ_layer_index){
				layers[i].moveToBottom();
				$(id_slider+i).removeClass(SELECTED_CLASSNAME);
			}
		}
		layers[activ_layer_index].moveToTop();
		layers[activ_layer_index].batchDraw();
		$(id_slider+index).addClass(SELECTED_CLASSNAME);
	}
	

	layers.push(new Konva.Layer());	
	layers.push(new Konva.Layer());	
	
	//layers.push(new Konva.Layer());
	


	var clear_layer = new Konva.Layer();	
	var background = new Konva.Rect({
                x: 0,
                y: 0,
                width: width,
                height: height,
                fill: 'white'
            });
	clear_layer.add(background);
	stage.add(clear_layer);
	

	var rectX=305, rectY = 100, rectW = 150, rectH = 280;
	var rectTop = new Konva.Rect({
                  x: rectX,
                  y: rectY,
                  width: rectW,
                  height: rectH,
                  stroke: 'black',
                  strokeWidth: 2
                });


	var rectBack = new Konva.Rect({
                  x: rectX,
                  y: rectY,
                  width: rectW,
                  height: rectH,
                  stroke: 'black',
                  strokeWidth: 2
                });


	addFbImg(layers,0, 200,50, 'fb_top.png', fb_images, rectTop);
	addFbImg(layers,1, 200,50, 'fb_back.png', fb_images, rectBack);


//	addFbImg(layers,2, 200,50, 'fb_top_r.png', fb_images, null);

	for(var i=0; i < layers.length;i++){
    	stage.add(layers[i]);
	}
	switchLayer(0);
		
	$( "#fb_slider_0" ).click(function() {
		switchLayer(0);
	});
	
	$( "#fb_slider_1" ).click(function() {
		switchLayer(1);
	});
	
	$( "#add-text" ).click(function() {
		var text = $("#text").val();
		if(text != ""){
			addText(layers[activ_layer_index], text);
		}
	});

	window.addEventListener( "keydown", function(event) {
		if ( event.keyCode == 46 && activ) {
			activ.destroy();
			layers[activ_layer_index].draw();
		}
	}, false );



	$.ajax({
        url: 'http://constructor.ru/getImages.php',
        success: function(data) {
         	var images = data.split(',');
         	var dimages = new Array();
         	for(var i =0; i < images.length - 1; i++){
         		$('#imglist').append('<img src="images/loading.gif" id="img_list_'+i+'">');
				dimages.push(new Image());
				dimages[dimages.length - 1].onload = function(){
				    $('#img_list_'+this.title)[0].src = this.src; 
				    $('#img_list_'+this.title).click(function() {
							addImage(layers[activ_layer_index],this.src);
					});
				};
				dimages[dimages.length - 1].src = images[i];
				dimages[dimages.length - 1].title = i;
         	}
        }
    });



	var text_color_list = ['black','red','green','blue'];
	for(var i =0; i < text_color_list.length; i++){	
		$('#text_color_selector').append('<div id="text_color_'+i+'" class="text_color_box" style="background-color: '+text_color_list[i]+'"><input id="text_color_val_'+i+'" type="hidden" value="'+text_color_list[i]+'"></div>');
		
		$( "#text_color_"+i ).click(function(e) {
			if(e.target.childNodes[0]){
				$('#text').css('color', e.target.childNodes[0].value);
				if(activ_text){
					activ_text.setFill(e.target.childNodes[0].value);
					layers[activ_layer_index].draw();
				}
			}
		});

	}


	var fb_color_list = ['#ffffff','#000000','#0000ff','#008000'];
	for(var i =0; i < fb_color_list.length; i++){	
		$('#fb_color_selector').append('<div id="fb_color_'+i+'" class="fb_color_box" style="background-color: '+fb_color_list[i]+'"><input id="fb_color_val_'+i+'" type="hidden" value="'+fb_color_list[i]+'"></div>');
		
		$( "#fb_color_"+i ).click(function(e) {
			if(e.target.childNodes[0]){
				var rgb = e.target.childNodes[0].value;
				var r = parseInt(rgb.substring(1,3),16);
				var g = parseInt(rgb.substring(3,5),16);
				var b = parseInt(rgb.substring(5,7),16);

				for(var i = 0; i < fb_images.length; i++){
					fb_images[i]['red'](r);
					fb_images[i]['green'](g);
					fb_images[i]['blue'](b);
					fb_images[i]['alpha'](0.85);
				}
				for(var i = 0; i < layers.length; i++){
					layers[i].batchDraw();    
				}
			}
		});

	}

	$( "#fb_color_0" ).click();


});



