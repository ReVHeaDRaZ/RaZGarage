export function setupColorButton(element, lightMaterials = [], lights = []) {
  const setColor = () => {
    element.innerHTML = `CHANGE ALL LIGHTS`;

    var r = Math.random() * 255;
    var g = Math.random() * 255;
    var b = Math.random() * 255;
    
    element.style = `background-color: rgb(${r},${g},${b});`;
    document.getElementById('heading').style= `color: rgb(${r},${g},${b});`;

    for(let i=0; i < lightMaterials.length; i++){
      randomSceneLightColor(lightMaterials[i], lights[i]);
    }
  }
  
  element.addEventListener('click', setColor);
  setColor();
}

export function setupHelpButton(element) {
  const toggleHelp = () => {
    let helpContainer = document.getElementById('helpContainer');
    if(helpContainer.style.opacity==0){
      element.style.opacity = 0.8;
      helpContainer.style.opacity = 1;
    }else{
      element.style.opacity = 0.5;
      helpContainer.style.opacity = 0;
    }
  }
  
  element.addEventListener('click', toggleHelp);
}

export function setupLightSphereToggleButton(element, leftsphere, rightsphere) {
  const toggleLightSphere = () => {
    if(leftsphere.visible == true){
      leftsphere.visible = false;
      rightsphere.visible = false;
      element.style.opacity = 0.5;
    }else{
      leftsphere.visible = true;
      rightsphere.visible = true;
      element.style.opacity = 0.8;
    }
  }
  element.style.opacity = .8;
  element.addEventListener('click', toggleLightSphere);
}

export function setupResetCarColorsButton(element, cortinaMat, cortinaColor, f100Mat, f100Color) {
  const resetCarColors = () => {
    cortinaMat.color = cortinaColor.clone();
    f100Mat.color = f100Color.clone();
  }
  element.addEventListener('click', resetCarColors);
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

