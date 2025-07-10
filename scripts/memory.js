/*#########################################################
Choose one of the methods below to load all your selected
image names into the images array
#########################################################*/

/*
var images=new Array("images/jeep1.jpg", "images/jeep1.jpg",
		     "images/jeep2.jpg", "images/jeep2.jpg",
		     "images/jeep3.jpg", "images/jeep3.jpg",
		     "images/jeep4.jpg", "images/jeep4.jpg",
		     "images/jeep5.jpg", "images/jeep5.jpg",
		     "images/jeep6.jpg", "images/jeep6.jpg",
		     "images/jeep7.jpg", "images/jeep7.jpg",
		     "images/jeep8.jpg", "images/jeep8.jpg",
		     "images/jeep9.jpg", "images/jeep9.jpg",
		     "images/jeep10.jpg", "images/jeep10.jpg",
		     "images/jeep11.jpg", "images/jeep11.jpg",
		     "images/jeep12.jpg", "images/jeep12.jpg");
*/

/*
var images=["images/character1.jpg", "images/character1.jpg",
	    "images/character2.jpg", "images/character2.jpg",
	    "images/character3.jpg", "images/character3.jpg",
	    "images/character4.jpg", "images/character4.jpg",
	    "images/character5.jpg", "images/character5.jpg",
	    "images/character6.jpg", "images/character6.jpg",
	    "images/character7.jpg", "images/character7.jpg",
	    "images/character8.jpg", "images/character8.jpg",
	    "images/character9.jpg", "images/character9.jpg",
	    "images/character10.jpg", "images/character10.jpg",
	    "images/character11.jpg", "images/character11.jpg",
	    "images/character12.jpg", "images/character12.jpg"];
*/

var images=new Array();

/*
for(let i=0;i<24;i=i+2)
    images[i]=images[i+1]="images/jeep" + ((i/2)+1) + ".jpg";
*/

/*
for(let i=0;i<12;i++){
    images.push("images/jeep" + (i+1) + ".jpg");
    images.push("images/jeep" + (i+1) + ".jpg");
}
*/

for(let i=0;i<12;i++)
    for(let j=0;j<2;j++)
	images.push("/assets/images/character" + (i+1) + ".jpg");

/*#########################################################
Change the line below to load your tile back image
#########################################################*/
var back="/assets/images/backimage.jpg";

var numTiles=images.length;

/*#########################################################
You need a variable for counting clicks and one to store
a reference to the previous tile selected. declare those
variables below. You should initialize the counter to zero.
#########################################################*/
var counter= 0; 
var prevTile;
var moves = 0;
var matchTry = 0; 

var num = (moves/matchTry);
var n = num.toFixed(2);

var openedCards = [];

/***************************************************************************************
Function to 'turn over' a tile
***************************************************************************************/
function uncover(currentTile){

    /*#########################################################
      Disable the onclick handler for the current tile image
      #########################################################*/
   currentTile.onclick=null;
    
    currentTile.src=images[currentTile.id];//load the correct image for this card
    
   
   
    
    /*#########################################################
      increase the click counter by one
      #########################################################*/
    counter++;
    
    /*#########################################################
      Check the value of the click counter

      if it is 2, reset the click counter and get a reference to 
      an array of all the images on the page... use getElementsByTagName
      and disable the click handlers on all the image elements
      and use setTimeout to wait one second before invoking the 
      cover function.

      if it is not 2, make the last tile variable be equal to 
      the current tile
      #########################################################*/
    
    if(counter==2){
        matchTry++;
        counter = 0;
        if(currentTile.src === prevTile.src){
           moves++; 
        currentTile.className = 'dimmed';
        prevTile.className = 'dimmed';
            if(moves == numTiles/2){ 
                
            document.getElementById("score").value = matchTry + ' tries ' + ': ' + ((moves/matchTry).toFixed(2) * 100) + '% hit rate'; 
            
            document.getElementById("score").style.color = "black";
                
                
                    
                setTimeout(alert,10,'CONGRATS! YOU MATCHED THEM ALL!') }
            
            
        }else{
        
        var board=document.getElementById('gameboard');
    
        var card = board.getElementsByTagName('img');
        
             
        for(let i=0; i < card.length; i++)
            {   card[i].onclick = null;
            }
        
    setTimeout(cover,1000,currentTile,prevTile);
            
            }
    }
         
    
   prevTile = currentTile; 
}

function reset(){
    
    var randomNum;
    var temp;
    var input=0;
    var i;
    var board;
    
 
    
    /*randomly shuffle the cards*/
    for(i=0;i<numTiles;i++){
	randomNum=Math.floor((Math.random() * numTiles));//generate a pseudo-random number
	temp=images[randomNum];
	images[randomNum]=images[i]; //swap the image at [randNum] with image at [i]
	images[i]=temp; 
    }
    

  
    
    var board=document.getElementById('gameboard');
    
        var card = board.getElementsByTagName('img');
        
             
        for(let i=0; i < card.length; i++)
            {   
                
                card[i].classList.remove('dimmed');
                card[i].src = back;
                card[i].onclick = function(){return uncover(this);};
                
                
            }
    
     moves = 0;
    counter = 0;
    matchTry = 0;
    /*document.getElementById("score").value = "No score yet this session";
    
    document.getElementById("score").style.color = "lightgrey";*/
}


function cover(currentTile,prevTile){
    
    currentTile.src=back;//cover the cards back up
    prevTile.src=back; 
    /*#########################################################
      do the same as above for the last tile
      #########################################################*/
    
    currentTile.onclick=null;
    prevTile.onclick=null;
    
    /*#########################################################
      This line below was in phase 1 but should not be in phase 2
      #########################################################*/
   /* currentTile.onclick=function(){return uncover(this)};
    */
    /*#########################################################
      Get a reference to an array of all the images on the page... 
      use getElementsByTagName and set all the click handlers on 
      all the image elements to invoke the uncover function
      #########################################################*/
   var board=document.getElementById('gameboard');
    
   var card = board.getElementsByTagName('img');
    
    
    for(let i=0; i < card.length; i++){
        
        if(card[i].className != 'dimmed'){
        card[i].onclick = function(){return uncover(this);};}
        
    }
    
}



/***************************************************************************************
You do not need to make any changes to prepareGameboard
***************************************************************************************/
function prepareGameboard(){
    var randomNum;
    var temp;
    var input=0;
    var i;
    var board;
    
    if(!document.getElementsByTagName)
	return;

    if(!document.getElementById)
	return;
    
    if(!document.getElementById("gameboard"))
	return;
    
    /*randomly shuffle the cards*/
    for(i=0;i<numTiles;i++){
	randomNum=Math.floor((Math.random() * numTiles));//generate a pseudo-random number
	temp=images[randomNum];
	images[randomNum]=images[i]; //swap the image at [randNum] with image at [i]
	images[i]=temp; 
    }
    
    //find the section on the page where the gameboard will go
    board=document.getElementById('gameboard');
    
    for(i=0;i<numTiles;i++){   
	newElement=document.createElement('img');//create a new image element and ...
	newElement.src=back;//... set some attributes
	newElement.id=i;//id will be used to index into the array when the card is uncovered
	newElement.alt="card" + i; //set the alt tag so this page will validate
	//set the onclick event handler to call the uncover() function
	newElement.onclick=function(){return uncover(this);};
	board.appendChild(newElement);//add the new element to the board
    }
     board=document.getElementById('reset');
    board.onclick = reset;
}

window.onload=prepareGameboard;



