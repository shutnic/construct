 function update(activeAnchor) {
        var group = activeAnchor.getParent();

        var topLeft = group.get('.topLeft')[0];
        var topRight = group.get('.topRight')[0];
        var bottomRight = group.get('.bottomRight')[0];
        var bottomLeft = group.get('.bottomLeft')[0];
        var top = group.get('.top')[0];
        var image = group.get('Image')[0];

        var anchorX = activeAnchor.getX();
        var anchorY = activeAnchor.getY();

        // update anchor positions
        switch (activeAnchor.getName()) {
            case 'topLeft':
                topRight.setY(anchorY);
                bottomLeft.setX(anchorX);
                break;
            case 'topRight':
                topLeft.setY(anchorY);
                bottomRight.setX(anchorX);
                break;
            case 'bottomRight':
                bottomLeft.setY(anchorY);
                topRight.setX(anchorX);
                break;
            case 'bottomLeft':
                bottomRight.setY(anchorY);
                topLeft.setX(anchorX);
                break;
            case 'top':
                var x0 = topLeft.getX() + (topRight.getX() - topLeft.getX())/2;
                var y0 = topLeft.getY() + (bottomLeft.getY() - topLeft.getY())/2;
                var r = (bottomLeft.getY() - topLeft.getY())/2 + 20;
                var R = Math.sqrt((x0-anchorX)*(x0-anchorX) + (y0-anchorY)*(y0-anchorY));
                top.setX(x0 + r * (anchorX-x0)/R);
                top.setY( y0 + r * (anchorY-y0)/R);
                var diffA = 90-Math.acos((anchorX-x0)/R)*180/Math.PI;                
                group.rotate(diffA);
                return;

        }

        image.position(topLeft.position());

        var width = topRight.getX() - topLeft.getX();
        var height = bottomLeft.getY() - topLeft.getY();
        top.setX(topLeft.getX() + width/2);
        top.setY(topRight.getY() - 20);
        group.offsetX(width/2);
        group.offsetY(height/2);

        if(width && height) {
            image.width(width);
            image.height(height);
        }
    }
	
 function addAnchor(group, x, y, name) {
        var stage = group.getStage();
        var layer = group.getLayer();
		var image = group.get('Image')[0];
        
        var draggable = true;//name != 'top';

		var anchor = new Konva.Circle({
            x: x,
            y: y,
            stroke: '#666',
            fill: '#ddd',
            strokeWidth: 2,
            radius: 8,
            name: name,
            draggable: draggable,
            dragOnTop: false
        });

        anchor.on('dragmove', function() {
            update(this);
            layer.draw();
        });
        anchor.on('mousedown touchstart', function() {
            group.setDraggable(false);
            this.moveToTop();
        });
        anchor.on('dragend', function() {
            group.setDraggable(true);
            layer.draw();
        });
        // add hover styling
        anchor.on('mouseover', function() {
            var layer = this.getLayer();
            document.body.style.cursor = 'pointer';
            this.setStrokeWidth(4);
			this.opacity(1);
            layer.draw();
        });
		
		anchor.on('mouseout', function() {
            var layer = this.getLayer();
            document.body.style.cursor = 'default';
            this.setStrokeWidth(2);
            layer.draw();
        });
		
		image.on('mouseover', function(e) {
			var group = this.getParent();
			if(group){
				var topLeft = group.get('.topLeft')[0];
				var topRight = group.get('.topRight')[0];
				var bottomRight = group.get('.bottomRight')[0];
				var bottomLeft = group.get('.bottomLeft')[0];
                var top = group.get('.top')[0];
				topRight.opacity(1);
				bottomRight.opacity(1);
				topLeft.opacity(1);
				bottomLeft.opacity(1);
                top.opacity(1);
				var shape = e.target;
				shape.strokeEnabled(true);
				layer.draw();
			}
		});
		
		image.on('mouseout', function(e) {
			var group = this.getParent();
			if(group){
				var topLeft = group.get('.topLeft')[0];
				var topRight = group.get('.topRight')[0];
				var bottomRight = group.get('.bottomRight')[0];
				var bottomLeft = group.get('.bottomLeft')[0];
                var top = group.get('.top')[0];
				topRight.opacity(0);
				bottomRight.opacity(0);
				topLeft.opacity(0);
				bottomLeft.opacity(0);
                top.opacity(0);
				var shape = e.target;
				shape.strokeEnabled(false);
				layer.draw();
			}
		});
		
        anchor.opacity(0);
        group.add(anchor);
    }
	
function addFbImg(layers, index, x,y,source, fb_images, rect){
		var imageObj = new Image(); 
		var bgImg = new Konva.Image({
			x: x,
			y: y,
			image: imageObj
		  });
		fb_images.push(bgImg);
		imageObj.onload = function() {
			bgImg.cache();	
			bgImg.filters([Konva.Filters.RGBA]);
			layers[index].add(bgImg);
            rect.opacity(0);
            layers[index].add(rect);
		};

       bgImg.on('mouseover', function() {
            rect.opacity(0);
            layers[index].draw();
        });

        bgImg.on('mouseout', function() {
            rect.opacity(1);
            layers[index].draw();
        });

		imageObj.src = source;
		imageObj.setAttribute('crossOrigin', '');


		/*var sliders = ['red', 'green', 'blue', 'alpha'];
		sliders.forEach(function(attr) {
          var slider = document.getElementById(attr); 
          function updateBg() {
			for(var i = 0; i < fb_images.length; i++){
				fb_images[i][attr](parseFloat(slider.value));
			}
			for(var i = 0; i < layers.length; i++){
				layers[i].batchDraw();    
			}
          }
          slider.oninput = updateBg;
          updateBg();
      });*/
}
	