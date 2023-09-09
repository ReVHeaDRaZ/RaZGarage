export function setupColorButton(element, leftobject, rightobject, leftlight, rightlight) {
  const setColor = () => {
    element.innerHTML = `Change Color`;
    
    var r = Math.random() * 255;
    var g = Math.random() * 255;
    var b = Math.random() * 255;
    
    leftobject.material.color.setRGB(r,g,b);
    leftobject.material.emissive.setRGB(r*.0015,g*.0015,b*.0015);
    rightobject.material.color.setRGB(r,g,b);
    rightobject.material.emissive.setRGB(r*.0015,g*.0015,b*.0015);
    
    leftlight.color.setRGB(r*.01,g*.01,b*.01);
    rightlight.color.setRGB(r*.01,g*.01,b*.01);

    element.style = `background-color: rgb(${r},${g},${b});`;
    document.getElementById('heading').style= `color: rgb(${r},${g},${b});`;
  }
  
  element.addEventListener('click', setColor);
  setColor();
}


export function randomSceneLightColor(object, light){
  var r = Math.random() * 255;
  var g = Math.random() * 255;
  var b = Math.random() * 255;
    
  object.material.color.setRGB(r,g,b);
  object.material.emissive.setRGB(r*.0015,g*.0015,b*.0015);
    
  light.color.setRGB(r*.01,g*.01,b*.01);  
}


export function randomMaterialColor(material){
  var r = Math.random();
  var g = Math.random();
  var b = Math.random();
  material.color.setRGB(r,g,b);
}

