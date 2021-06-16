//Create variables here

var dog , dogImg , happyDogImg , database , foodS,foodStock;
var fedTime , lastFed , feed , addFood;
var foodObj,foodImg;
var foodStockRef;
var frameCountNow = 0;
var currentTime;
var milk,input,Name;
var gameState = "hungry";
var gameStateRef;
var bedroom,garden,washroom,sleep,run;
var button,input;

function preload()
{
	//load images here
  dogImg = loadImage("Dog.png");
  happyDogImg = loadImage("Happy.png");
  bedroom = loadImage("Bed Room.png");
  garden = loadImage("Garden.png");
  washroom = loadImage("Wash Room.png");
  sleep = loadImage("Lazy.png");
  run = loadImage("running.png")
}

function setup() {
	createCanvas(1200, 500);

  database = firebase.database();

  foodObj = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value" ,readStock );
  
  dog = createSprite(width/2+250,height/2,10,10);
  dog.addImage("hungry" , dogImg);
  dog.addImage("happy" , happyDogImg);
  dog.addImage("sleeping" , sleep);
  dog.addImage("run" , run);
  
  
  feed = createButton("Feed the Dog");
  feed.position(750,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(650,95);
  addFood.mousePressed(addFoods);

  input = createInput("Pet Name");
  input.position(950,120);

  button = createButton("Confirm");
  button.position(1000,145);
  button.mousePressed(createName); 

}


function draw() 
{
  
  currentTime = hour();

  if (gameState ==! "hungry")
  {
    feed.hide();
    addFood.hide();
    dog.remove();
  }

  else
  {
    feed.show();
    addFood.show();
    dog.addImage("hungry",dogImg);
  }

 

  if (currentTime === (lastFed + 1))
  {
    gameState = "playing";
    updateGameState(gameState);
    foodObj.garden();
  }

  else if(currentTime === (lastFed + 2))
  {
    gameState = "sleeping";
    updateGameState(gameState);
    foodObj.bedroom();
  }

  else if(currentTime > lastFed + 2 && currentTime <= lastFed + 4)
  {
    gameState = "bathing";
    updateGameState(gameState);
    foodObj.washroom();
  }

  else 
  {
    gameState = "hungry";
    updateGameState(gameState);
    foodObj.display();
  }

  
  
  foodObj.getFoodStock();
  getGameState();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data)
  {
    lastFed = data.val();
  })

  


 // fill(255,255,255);
  //textSize(15);
  //if (lastFed >= 12)
  //{
  //  text("Last Fed: " + lastFed % 12 + "PM",350,30);
 // }

  //else if (lastFed == 0)
 // {
  //  text("Last Feed: 12AM ",350,30);
 // }

 // else 
 // {
  //  text("Last Feed: " + lastFed + "AM",350,30);
 // }

  drawSprites();

  textSize(20);
  text("Last Fed :" + lastFed + "00" , 300 , 95);

  text("Time Since Last Fed :" + (currentTime - lastFed) , 300 , 125);
}
//add styles here

function readStock(data)
  {
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
  }

function feedDog()
{
  foodObj.deductFood();
  foodObj.updateFoodStock();
  dog.changeImage("happy" , happyDogImg);
  gameState = "happy";
  updateGameState(gameState);
}

function addFoods()
  {
    foodObj.getFoodStock();
    foodObj.updateFoodStock();
  }

  async function hour()
  {
    var site = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
    var siteJSON = await site.json();
    var datetime = siteJSON.datetime;
    var hourTime = datetime.slice(11,13);
    return hourTime;
  }

  function createName()
  {
    input.hide();
    button.hide();

    Name = input.value();

    var greeting = createElement("h3");
    greeting.html("Pet's name : " + Name);
    greeting.position(width/2 + 50 , height/2 + 20);
  }

  function getGameState()
  {
    gameStateRef = database.ref('gameState');
    gameStateRef.on("value" , function(data){gameState = data.val()})
  }

  function updateGameState(gameState)
  {
    database.ref("/").update({'gameState' : gameState});
    
  
  }



  

  

  

  

  