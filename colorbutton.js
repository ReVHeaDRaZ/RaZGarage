export function setupColorButton(element, lightMaterials = [], lights = []) {
  const setColor = () => {
    element.innerHTML = `Change All Lights`;

    var r = Math.random() * 255;
    var g = Math.random() * 255;
    var b = Math.random() * 255;
    
    element.style = `background-color: rgb(${r},${g},${b});`;
    document.getElementById('heading').style= `color: rgb(${r},${g},${b});`;

    for(let i=0; i < lightMaterials.length; i++){
      randomSceneLightColor(lightMaterials[i], lights[i]);
    }
    // leftobject.material.color.setRGB(r,g,b);
    // leftobject.material.emissive.setRGB(r*.0015,g*.0015,b*.0015);
    // rightobject.material.color.setRGB(r,g,b);
    // rightobject.material.emissive.setRGB(r*.0015,g*.0015,b*.0015);
    
    // leftlight.color.setRGB(r*.01,g*.01,b*.01);
    // rightlight.color.setRGB(r*.01,g*.01,b*.01);   
  }
  
  element.addEventListener('click', setColor);
  setColor();
}


export function randomSceneLightColor(material, light){
  var r = Math.random() * 255;
  var g = Math.random() * 255;
  var b = Math.random() * 255;
    
  material.color.setRGB(r,g,b);
  material.emissive.setRGB(r*.0015,g*.0015,b*.0015);
    
  light.color.setRGB(r*.01,g*.01,b*.01);  
}


export function randomMaterialColor(material){
  var r = Math.random();
  var g = Math.random();
  var b = Math.random();
  material.color.setRGB(r,g,b);
}

