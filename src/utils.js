import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCirvA7Ue1jDu87wcIR1z-TyI6N9yP2MGE",
    authDomain: "fft-allergen-check.firebaseapp.com",
    projectId: "fft-allergen-check",
};

const app = initializeApp(firebaseConfig);
const db= getFirestore(app);


export function nameToSlug(name) {
    return name.trim().toLowerCase().replace(/\s+/g, "-");
}

//One time utility to add slug field to recipes that dont have one 
export async function ensureSlugs() {
    const recipesSnapshot = await getDocs(collection(db, "recipes"));

    for (const docSnap of recipesSnapshot.docs) {
        const data = docSnap.data();

        if (!data.slug && data.name) {
            const slug = nameToSlug(data.name);
            await updateDoc(doc(db, "recipes", docSnap.id), { slug });
            console.log(`Updated recipe ${docSnap.id} with slug ${slug}`);
        }
    }
    console.log("Done ensuring slugs!");
}

ensureSlugs().catch(err => {
    console.error("Error ensuring slugs:", err);
});