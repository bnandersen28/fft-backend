const { db, doc, getDoc } = require("./firebase");


async function getRecipe(recipeId) {
    const ref = doc(db, "recipes", recipeId);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

//Split into words, all lowercase no punctuation
function normalizeWords(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")//strip punctuation
        .split(/\s+/)
        .filter(Boolean);
}

//convert sub recipe name to id
function nameToId(name) {
    return name.trim().toLowerCase().replace(/\s+/g, '-');
}



//Map of certain allergens to ingredients
const allergenMap = {
    gluten: ["wheat", "flour", "barley", "rye"],
    dairy: ["milk", "cheese", "butter", "cream", "yogurt"],
    peanut: ["peanuts"],
    tree_nuts: ["almonds", "walnuts", "hazelnuts", "cashews", "pistachios"],
    seafood: ["crab", "anchovies", "shrimp", "tuna", "salmon", "haddock", "clam", "cod"],
    vegan: ["meat", "milk", "cream", "butter", "cheese", "eggs", "honey"],
    onion: ["onions", "shallots", "scallions" ]
};

async function checkAllergens(mainId, sides = [], dressings = [], additionals = [], allergenList = []) {
    const allRecipeIds = [mainId, ...sides, ...dressings, ...additionals];
    console.log("Checking recipes:", allRecipeIds);
    const recipes = await Promise.all(allRecipeIds.map(getRecipe));

    let messages = []
    let ingredients = []

    for (const recipe of recipes) {
        if (!recipe) continue;
        const recipeName = recipe.name || recipe.id;

        //Check declared allergens array
        if (recipe.allergens && recipe.allergens.length > 0) {
            console.log("Checking allergen array");
            recipe.allergens.forEach(allergen => {
                if (allergenList.some(a => a.toLowerCase() === (allergen.toLowerCase()))) {
                    messages.push(`Found allergen ${allergen} in ${recipeName} `);
                }
            });
        }

        //Scan ingredients 
        if (recipe.ingredientIds?.length) {
            console.log("Checking ingredients");
            for (const ingredient of recipe.ingredientIds) {
                console.log(`Checking ingredient "${ingredient}"`);
                ingredients.push(ingredient);
                const words = normalizeWords(ingredient);
                for (const allergen of allergenList.map(a => a.toLowerCase())) {
                    if (words.includes(allergen)) {
                        messages.push(`Found allergen ${allergen} in ingredient "${ingredient}" of ${recipeName}`);
                    }

                    // mapped keywords
                    const mappedKeywords = allergenMap[allergen] || [];
                    mappedKeywords.forEach(keyword => {
                        if (words.includes(keyword.toLowerCase())) {
                            messages.push(
                                `Found "${keyword}" (mapped to allergen "${allergen}") in ingredient "${ingredient}" of recipe "${recipeName}"`
                            );
                        }
                    });
                }
            }
        }

        //Recursively lookup subingredients, calling check allergens
        if (recipe.subingredients?.length) {
            console.log("Checking subingredients");
            for (const subName of recipe.subingredients) {
                ingredients.push(subName);
                const subId = nameToId(subName);
                console.log(`subid: ${subId}`);
                const subcheck = checkAllergens(subId, [], [], [], allergenList);
                const subResults = await subcheck;
                messages = messages.concat(subResults.results);
                ingredients = ingredients.concat(`Ingredients of ${subName}: ${subResults.ingredients.join(", ")}`);
            }
        }


        //Alert of cross contamination
        if (recipe.crosscontamination?.length) {
            console.log("Checking cross contamination");
            recipe.crosscontamination.forEach(risk => {
                messages.push(
                    `Found cross contamination risk with ${risk} in ${recipeName}`
                );
            });
        }
        console.log("Final messages:", messages);
        if (messages.length === 0) {
            messages.push(`✅ No allergens were found for in ${recipeName}`);
        }
    }



    return {
        recipesCheck: allRecipeIds,
        results: messages,
        ingredients: ingredients
    };


}
module.exports = { checkAllergens };