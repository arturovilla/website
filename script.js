const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particalary = [];
let testadjustX = 5;//these two adjust the xv pos of test itself
let testadjustY = -15;

//handle mouse movement
const mouse = {
    x: null,
    y: null,
    radius: 350
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y -450;
    //console.log(mouse.x,mouse.y);
});

ctx.fillStyle = 'white';
ctx.font =  '10px Verdana';
ctx.fillText('Hi there !, this is a demo',0,40);
ctx.fillText('of my particle/physics JS script',0,50);
ctx.fillText('whats up?',0,60);
ctx.fillText('Particles respond to mouse',0,70);
ctx.fillText('movement',0,80);
ctx.fillText('What do you think?',0,90);
const textpos = ctx.getImageData(0,0,canvas.width/2,100);//scans cavas for image data 

class Partical{
    constructor(x,y,dist){
        this.x = x;
        this.y = y;
        this.size = 3;//radius of circular partical
        this.basex = this.x;//these 2 bases hold initital position of partical
        this.basey = this.y;
        this.density = (Math.random()*10)+1;//random number 1-30
        this.distfromm = dist;

    }
    draw(){
        ctx.fillStyle = 'white';
        if(this.distfromm< ((mouse.radius/4)*3)  ){
            ctx.fillStyle = 'rgb(216,0,1)';
        }
        if(this.distfromm<mouse.radius/2){
            ctx.strokeStyle = 'rgb(254,176,16)';
        }
        if(this.distfromm<mouse.radius/4){
            ctx.strokeStyle = 'rgb(61,151,201)';
        }
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        this.distfromm = distance;
        let forcevecx = dx/distance;
        let forcevecy = dy/distance;
        let maxdist = mouse.radius;
        let force = (maxdist - distance)/maxdist;//scaler that slows particals down
        let directionx = forcevecx*force*this.density;
        let directiony = forcevecy*force*this.density;

        if(distance < maxdist)
        {
            this.x -=  directionx;
            this.y -=  directiony;
        }
        else
        {
            if(this.x!== this.basex)
            {
                let dx = this.x - this.basex;
                this.x -=dx/10;
            }
            if(this.y != this.basey)
            {
                let dy = this.y - this.basey;
                this.y -=dy/10;
            }
        }
    }//end of update
}//end of class

function init(){//creates dots
    particalary = [];
    // for(let i  = 0; i< 1000; i++)
    // {
    //     let x = Math.random()*canvas.width; // random value between 0 and 500
    //     let y = Math.random()*canvas.height;
    //     particalary.push(new Partical(x,y));
    // } this code is for random distribution
    let y2 = textpos.height;
    let x2 = textpos.width;
    for(let y = 0; y< y2; y++)
    {
        for(let x = 0; x< x2; x++)
        {
            if(textpos.data[(y * 4 * textpos.width) + (x * 4) + 3] > 128)
            {
                let posx = x + testadjustX;
                let posy = y + testadjustY;
                particalary.push(new Partical(posx*15,posy*15));
            }
        }
    }
    
}//end of init

init();
//console.log(particalary);

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i = 0; i<particalary.length;i++)
    {
        particalary[i].draw();
        particalary[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}//end of animate function
animate();

function connect(){
    let opacityval = 1;
    for(let i =0; i < particalary.length; i++)
    {
        for(let j = i; j< particalary.length; j++)
        {
            let dx = particalary[i].x - particalary[j].x;
            let dy = particalary[i].y - particalary[j].y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if(distance < 30)//tunning line parameter
            {
                opacityval = 1-(distance/100);
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityval+')';
                if(particalary[i].distfromm <((mouse.radius/4)*3) || particalary[j].distfromm <((mouse.radius/4)*3)){
                    ctx.strokeStyle = 'rgba(216,0,1,' + opacityval+')';
                }
                if(particalary[i].distfromm <mouse.radius/2 || particalary[j].distfromm <mouse.radius/2){
                    ctx.strokeStyle = 'rgba(254,176,16,' + opacityval+')';
                }
                if(particalary[i].distfromm <mouse.radius/4 || particalary[j].distfromm <mouse.radius/4){
                    ctx.strokeStyle = 'rgba(61,151,201,' + opacityval+')';
                }
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particalary[i].x,particalary[i].y);
                ctx.lineTo(particalary[j].x,particalary[j].y);
                ctx.stroke();
            }
        }
    }
}//end of connect function

