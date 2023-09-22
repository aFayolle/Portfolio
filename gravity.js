const greenCircle = document.getElementById('green-circle');
const projectile = document.getElementById('projectile');
let isMouseDown = false; // Variable pour suivre l'état du bouton de la souris
let mouseX=0;
let mouseY=0;
projectile.style.left ='350px';
projectile.style.top ='250px';
//projectile.style.display = 'block';
class vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    copyFrom(otherVector) {
        this.x = otherVector.x;
        this.y = otherVector.y;
    }
}
const acceleration=new vector(0, 0);
const position_current=new vector(350, 250);
const position_old=new vector(350, 250);
let instantt=0;
const k=40000;

async function updatePosition(dt)
{
    dt=dt/500;
    acceleration.x=0;
    acceleration.y=0;
    let a=0;
    const scrollTop = window.scrollY || window.pageYOffset;
    let r=Math.sqrt((mouseX - position_current.x- greenCircle.clientWidth / 2) ** 2 + (scrollTop+mouseY - position_current.y-greenCircle.clientHeight / 2) ** 2);
    const velocity=new vector(position_current.x-position_old.x, position_current.y-position_old.y);
    position_old.copyFrom(position_current);
    if (isMouseDown )
    {
        r=r/4;
        a=k/(r**2);
        acceleration.x=a*(mouseX - position_current.x- greenCircle.clientHeight / 2)/r;
        acceleration.y=a*(scrollTop+mouseY - position_current.y- greenCircle.clientHeight / 2)/r;
        if (r<10){
            r=2*r;
            acceleration.x=-a*(mouseX - position_current.x- greenCircle.clientHeight / 2)/r;
            acceleration.y=-a*(scrollTop+mouseY - position_current.y- greenCircle.clientHeight / 2)/r;
        }
        
        //console.log(mouseX+"-"+mouseY);
    }
    acceleration.x-=10*velocity.x;
    acceleration.y-=10*velocity.y;
    test=100;
    if(position_current.x>window.innerWidth-40)
    {
        acceleration.x=-test;
    }
    if(position_current.x<40)
    {
        acceleration.x=test;
    }
    if(position_current.y>window.innerHeight+scrollTop-40)
    {
        acceleration.y=-test;
    }
    if(position_current.y<40)
    {
        acceleration.y=test;
    }
    
    
    position_current.x+=velocity.x + acceleration.x*dt*dt;
    position_current.y+=velocity.y + acceleration.y*dt*dt;
    if(r>2000)
    {
        position_current.x=10;
        position_current.y=10;
        position_old.x=10;
        position_old.y=10;
    }
    projectile.style.left =position_current.x+'px';
    projectile.style.top =position_current.y+'px';
    console.log(velocity.x, velocity.y);
    //console.log("r: "+ r+" \nacceleration"+ a+ " "+ acceleration.y+"\nposition: "+position_current.x+" "+position_current.y);
}
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    //console.log(mouseX+" "+mouseY);
    const scrollTop = window.scrollY || window.pageYOffset;
    greenCircle.style.left = mouseX - greenCircle.clientWidth / 2 + 'px';
    greenCircle.style.top = scrollTop+mouseY - greenCircle.clientHeight / 2 + 'px';
});
const grille = document.getElementById("plateau");
    
    // Obtenez les coordonnées de la grille
const grilleRect = grille.getBoundingClientRect();
const bt = document.getElementById("restartButton");

    // Obtenez les coordonnées de la grille
const btRect = bt.getBoundingClientRect();
console.log("bt"+btRect);
document.addEventListener('mousedown', (event) => {
    if (event.button === 0 ) { // Vérifie si le clic gauche de la souris est activé (0 pour le clic gauche)
        
        if (
            (mouseX < grilleRect.left ||
            mouseX > grilleRect.right ||
            mouseY < grilleRect.top ||
            mouseY > grilleRect.bottom)
            &&
            (mouseX < btRect.left ||
                mouseX > btRect.right ||
                mouseY < btRect.top ||
                mouseY > btRect.bottom)
        ) 
        {
        isMouseDown = true; // Met à jour l'état du bouton de la souris
        }
        // Appel de la fonction en boucle lorsque le bouton est enfoncé
    }
});

document.addEventListener('mouseup', () => {
    // Met à jour l'état du bouton de la souris lorsque le clic de la souris est relâché
    isMouseDown = false;
    greenCircle.style.display = 'none';
});
document.addEventListener("keydown", function(event) {
    if (event.key === " ") { // Vérifie si la touche pressée est l'espace
        // Appeler votre fonction ici
        projectile.style.left ='350px';
        projectile.style.top ='250px';
        position_current.x=350;
        position_current.y=250;
        position_old.x=350;
        position_old.y=250;
    }
});
function loop()
{
    window.requestAnimationFrame(loop);
    if(isMouseDown)
    {
        greenCircle.style.display = 'block';
    }
    else
    {
        greenCircle.style.display = 'none';
    }
    updatePosition(performance.now()-instantt);
    instantt=performance.now();

}

loop();