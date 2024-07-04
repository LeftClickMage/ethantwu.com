class FancyText extends Phaser.GameObjects.Text
{
  constructor(scene, x, y, recenter, text, size, textColor, strokeColor)
  {

    if(textColor == "white"){
        textColor = "#FFFFFF";
    } else if(textColor == "black"){
        textColor = "#000000";
    }
    super(scene, x, y, text, {font: size + " Minecraft", color: textColor});
    scene.add.existing(this);
    if(recenter){
        this.x = this.x - this.width/2;
        this.y = this.y - this.height/2;
    }
    var strokeSize = size.slice(0, -2);
    if(strokeColor == "lightBlue"){
        this.setStroke('#ABCDEF', );
    } else if(strokeColor == "red"){
        this.setStroke('#800000', parseInt(strokeSize)/15);
    } else if(strokeColor == "black"){
        this.setStroke('#000000', parseInt(strokeSize)/15);
    } else if(strokeColor == "white"){
        this.setStroke('#FFFFFF', parseInt(strokeSize)/15);
    } else if(strokeColor == "blue"){
        this.setStroke('#000080', parseInt(strokeSize)/15);
    } else if(strokeColor == "lightGreen"){
        this.setStroke('#6AF859', parseInt(strokeSize)/15);
    } else if(strokeColor == "lightGray"){
        this.setStroke('#DDDDDD', parseInt(strokeSize)/15);
    } else if(strokeColor == "lightOrange"){
        this.setStroke('#FB9E7A', parseInt(strokeSize)/15);
    } else if(strokeColor == "yellow"){
        this.setStroke('#FFC300', parseInt(strokeSize)/15);
    } else if(strokeColor == "green"){
        this.setStroke('#008000', parseInt(strokeSize)/5);
    } 



    
    

  }
}
