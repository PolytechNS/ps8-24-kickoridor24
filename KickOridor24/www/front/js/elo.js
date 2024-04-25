

let eloJoueur1 = 1000;
let eloJoueur2 = 2600;

nbGameJoueur1 = 20;
nbGameJoueur2 = 87;

let resJoueur1 = 1
let resJoueur2 = 0

let k1 = 0
let k2 = 0

if(eloJoueur1 > 2400){
    k1 = 10;
}else if(eloJoueur1 < 2400 && nbGameJoueur1 > 30){
    k1 = 20;
}else{
    k1 = 30;
}

if(eloJoueur2 > 2400){
    k2 = 10;
}else if(eloJoueur2 < 2400 && nbGameJoueur2 > 30){
    k2 = 20;
}else{
    k2 = 30;
}


console.log("k1 : " + k1);
console.log("k2 : " + k2);

let newEloJoueur1 = eloJoueur1 + k1 * (resJoueur1 - (1 / (1 + Math.pow(10, (eloJoueur2 - eloJoueur1) / 400))))

console.log("diff joueur 1 " + (1 / (1 + Math.pow(10, (eloJoueur2 - eloJoueur1) / 400))));
console.log("diff joueur 2 " + (1 / (1 + Math.pow(10, (eloJoueur1 - eloJoueur2) / 400))));

let newEloJoueur2 = eloJoueur2 + k2 * (resJoueur2 - (1 / (1 + Math.pow(10, (eloJoueur1 - eloJoueur2) / 400))));

let diffEloJoueur1 = newEloJoueur1 - eloJoueur1;
let diffEloJoueur2 = newEloJoueur2 - eloJoueur2;

if(diffEloJoueur1 > 0){
    diffEloJoueur1 = "+" + Math.ceil(diffEloJoueur1);
}else{
    diffEloJoueur1 = Math.ceil(diffEloJoueur1);
}
if(diffEloJoueur2 > 0){
    diffEloJoueur2 = "+" + Math.ceil(diffEloJoueur2);
}else{
    diffEloJoueur2 = Math.ceil(diffEloJoueur2);
}

if(newEloJoueur1 < 0){
    newEloJoueur1 = 0;
}
if(newEloJoueur2 < 0){
    newEloJoueur2 = 0;
}


console.log("Nouvel elo joueur 1 : " + Math.ceil(newEloJoueur1) + " (" + diffEloJoueur1 + ")");
console.log("Nouvel elo joueur 2 : " + Math.ceil(newEloJoueur2) + " (" + diffEloJoueur2 + ")");

function calculElo(resJoueur1,resJoueur2){

}