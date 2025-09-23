const { checkAllergens } = require("./checkAllergens");


async function runTests(){
    const testCases = [
        {
            name: "Thai with peanut allergy",
            mainId: "thai",
            sides: [],
            dressings: [], 
            additionals: [],
            allergens: ["peanut", "onion"]
        },{
            name: "Cobb Salad with Onion and egg allergy",
            mainId: "cobb",
            sides: [],
            dressings: [],
            additionals: [],
            allergens: ["onion", "egg"]
        },{
            name: "Pot roast with cr spin and mash potatoes with onion allergy",
            mainId: "pot-roast",
            sides: ["cream-spinach","mashed-potatoes"],
            dressings: [],
            additionals:[],
            allergens: ["onion"]
        },{
            name: "Fried chicken with dairy and gluten allergy",
            mainId: "fried-chicken",
            sides: [],
            dressings: [],
            additionals: [],
            allergens: ["dairy", "gluten"]
        },{
            name: "Hummus with pepper allergy", 
            mainId: "hummus",
            sides: [],
            dressings: [],
            additionals: [],
            allergens: ["pepper"]
        },{
            name: "Shrimp boat with pepper allergy",
            mainId: "shrimp-boat",
            sides: [],
            dressings: [],
            additionals: [],
            allergens: ["pepper"]
        }
    ];
    for (const test of testCases){
        try{
            const result = await checkAllergens(
                test.mainId,
                test.sides,
                test.dressings,
                test.additionals,
                test.allergens
            );
            console.log("\n=============");
            console.log(`Test: ${test.name}`);
            console.log("Recipes Checked:", result.recipesChecked);
            console.log("results");
            if(result.results.length == 0){
                console.log("No allergens found.");
            }else{
                result.results.forEach(msg => console.log(msg));
            }
        }catch(error){
            console.error(`Error running test ${test.name}:`, error);
        }
    }
}
runTests();