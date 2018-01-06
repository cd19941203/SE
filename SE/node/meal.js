import { lchmod } from 'fs';

var database = require('./database.js');
var fs = require('fs');
var dbConnectionError = database.dbConnectionError;
var dbManipulationError = database.dbManipulationError;

async function getMenu(){
	try{
		var db = await database.connect();
		return new Promise((res,rej)=>{
			db.collection('menu').find({},{projection:{_id: 0}}).toArray((err,result)=>{
				if(err)
					rej(dbManipulationError);
				else
					res(result);
			});
		});
	}catch(err){
		throw(dbConnectionError);
	}
}

async function updateMenu(menu){
	try{
		var db = await database.connect();
		return new Promise((res,rej)=>{
			db.collection('menu').deleteMany({},(err,result)=>{
				if(err)
					rej(dbManipulationError);
				else{
					db.collection('menu').insertMany(menu,async(err,result)=>{
						if(err)
							rej(dbManipulationError);
						else{
							var currentImage = fs.readdirSync('../mealImage');
							var selectedImage = [];
							// update image path
							for(meal of menu){
								if(currentImage.indexOf(meal.name + '.jpg') > -1){
									selectedImage.push(meal.name + '.jpg');
									await updateImagePath(meal.name);
								}
							}
							// delete the image no longer use
							for(meal of currentImage){
								if(selectedImage.indexOf(meal) == -1){
									fs.unlinkSync('../mealImage/' + meal);
								}
							}
							res();
						}
					});
				}
			});
		});
	}catch(err){
		throw(dbConnectionError);
	}
}

async function updateImagePath(mealName){
	try{
		var db = await database.connect();
		return new Promise((res,rej)=>{
			db.collection('menu').updateOne({name:mealName},{$set:{image:'/mealImage/' + mealName + '.jpg'}},(err,result)=>{
				if(err)
					rej(err);
				else
					res();
			});
		});
	}catch(err){
		throw(dbConnectionError);
	}
}

async function setMealImage(mealName,image){
	try{
		var db = await database.connect();
		return new Promise((res,rej)=>{
			db.collection.updateOne({name:mealName},{$set:{image:'/mealImage' + mealName + '.jpg'}},(err,result)=>{
				if(err)
					rej(dbManipulationError);
				else{
					fs.renameSync(image.path,'../mealImage/' + mealName + '.jpg');
					res();
				}
			});
		});
	}catch(err){
		throw(dbConnectionError);
	}
}

module.exports.getMenu = getMenu;
module.exports.updateMenu = updateMenu;
module.exports.setMealImage = setMealImage;