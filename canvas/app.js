const canvas=document.querySelector("canvas"),
toolBtns=document.querySelectorAll('.tool'),
fillColor=document.querySelector('#fill-color'),
sizeSlider=document.querySelector('#size-slider'),
colorsBtn=document.querySelectorAll('.colors .option'),
colorsPicker=document.querySelector('#color-picker'),
clearCanvas=document.querySelector('.clear-canvas'),
saveImg=document.querySelector('.save-image'),
ctx=canvas.getContext("2d");//displays the drawn lines and images

//setting default global values 
let prevMouseX,prevMouseY,snapshot,
isDrawing=false;
selectedTool="brush",
brushWidth=1;
selectedColor="#000";

const setCanvasBackground=()=>{
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedColor;
}

window.addEventListener('load',()=>{
    // by giving the below two lines, returns viewable width/height of an element
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setCanvasBackground();
});

sizeSlider.addEventListener('change',()=>{
    brushWidth=sizeSlider.value;
    ctx.lineWidth=brushWidth;
})

const drawRect=(e)=>{
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
    //we should draw a rectangle only if fill color is not selected else draw rectangle with background
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX,prevMouseY-e.offsetY)
    }
    ctx.fillRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX,prevMouseY-e.offsetY)
    
}
const drawSquare = (e) => {
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
    const sideLength = Math.abs(prevMouseX - e.offsetX); // Distance from start point to current mouse position
    ctx.beginPath(); // Start a new path for the square

    if (!fillColor.checked) {
        ctx.strokeRect(prevMouseX, prevMouseY, sideLength, sideLength); // Draw an unfilled square
    } else {
        ctx.fillRect(prevMouseX, prevMouseY, sideLength, sideLength); // Draw a filled square
    }
};
const drawTriangle = (e) => {
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
    ctx.beginPath(); // Start a new path for the triangle
    // Calculate the base and height of the triangle
    const base = e.offsetX - prevMouseX;
    const height = e.offsetY - prevMouseY;
    // Move to the starting point (top vertex of the triangle)
    ctx.moveTo(prevMouseX, prevMouseY);
    // Draw line to the bottom-left vertex of the triangle
    ctx.lineTo(prevMouseX - base / 2, prevMouseY + height);
    // Draw line to the bottom-right vertex of the triangle
    ctx.lineTo(prevMouseX + base / 2, prevMouseY + height);
// or you can also replace the previous two line with
    // ctx.lineTo(e.offsetX,e.offsetY)//creates first line according to mouse pointer
    // ctx.lineTo(prevMouseX*2-e.offsetX,e.offsetY)//creates bottom line of the triangle
    // Close the triangle path by going back to the starting point
    ctx.closePath();//completes the third line automatically;
    // Fill or stroke the triangle based on fillColor setting
    fillColor.checked?ctx.fill():ctx.stroke();
};

const drawCircle=(e)=>{
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
    ctx.beginPath();//creating new path to draw circle
    //getting radius of the circle accroding to the mouse pointer
    let radius=Math.sqrt(Math.pow((prevMouseX-e.offsetX),2)+Math.pow((prevMouseY-e.offsetY ),2))
    ctx.arc(prevMouseX,prevMouseY,radius,0,2*Math.PI);
    fillColor.checked? ctx.fill():ctx.stroke();
}

const startDraw=(e)=>{
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
    isDrawing=true;
    prevMouseX=e.offsetX;//storing previous mouse position as prevmousex 
    prevMouseY=e.offsetY//storing previous mouse position as prevmousey
    ctx.beginPath()//  creates a path to draw,you can start drawing next drawing from where ever you want,if not given, the drawing starts form where is ended,and not where the pointer is starting from ......if you forgot why is it used, comment that line and check how it works without giving that path.
    ctx.lineWidth=brushWidth;// as we want the line to have the width range given on the range input, we are equating it with brush size.
    snapshot=ctx.getImageData(0,0,canvas.width,canvas.height)
}
const drawing=(e)=>{
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0,0)//adding copied canvas data to this canvas.
    // lineTo is used to create a line according to the movement of the mouse pointer
    // stroke() give a filling of the line with a color
    if (selectedTool==='brush' || selectedTool==='eraser'){
        ctx.strokeStyle=selectedTool ==="eraser"?"#fff":selectedColor;
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke(); 
    }else if(selectedTool==='rectangle'){
        drawRect(e);
    }
    else if(selectedTool==='square'){
        drawSquare(e);
    }
    else if(selectedTool==='triangle'){
        drawTriangle(e);
    }
    else if(selectedTool==='circle'){
        drawCircle(e);
    }
}

toolBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{//used to iterate through all the btns and add event according to their use by adding click event.
        //removing active class from previously selected option and adding it to currently clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool=btn.id
        console.log(selectedTool);
    })
})

colorsBtn.forEach(btn=>{
    btn.addEventListener('click',()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor=window.getComputedStyle(btn).getPropertyValue("background-color");
        console.log(selectedColor)
    })
})
colorsPicker.addEventListener("change",()=>{
    selectedColor=colorsPicker.value;
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
})
clearCanvas.addEventListener('click',()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height)//clears the whole canvas.
    
})
saveImg.addEventListener('click',()=>{
    const link=document.createElement("a");
    link.download=`${Date.now()}.jpg`
    link.href=canvas.toDataURL();
    link.click(); 
    setCanvasBackground();
})

canvas.addEventListener('mousedown',startDraw);//whenever mousedown is 
canvas.addEventListener('mousemove',drawing);//we need to display the line when the brush is moved but along with other conditions.
canvas.addEventListener('mouseup',()=>isDrawing=false);