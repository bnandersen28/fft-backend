import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import benfrank from './benfrank.jpg'; // adjust path as needed
import { db } from './firebase'; // adjust path as needed
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useEffect } from 'react';


const Home = () => {

    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);

    const [showNotes, setShowNotes] = useState(false);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");


    const [entrees, setEntrees] = useState([]);
    const [appetizers, setAppetizers] = useState([]);
    const [sides, setSides] = useState([]);
    const [dressings, setDressings] = useState([]);
    const [soupsSalads, setSoupsSalads] = useState([]);
    const [desserts, setDesserts] = useState([]);

    const [selectedEntree, setSelectedEntree] = useState("");
    const [selectedAppetizers, setSelectedAppetizers] = useState([]); // multiple
    const [selectedSoupsSalads, setSelectedSoupsSalads] = useState([]); // multiple
    const [selectedSides, setSelectedSides] = useState([]); // multiple
    const [selectedDressings, setSelectedDressings] = useState([]); // multiple
    const [selectedDesserts, setSelectedDesserts] = useState([]); // multiple

    const [allergens, setAllergens] = useState("");
    const [results, setResults] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    //Load notes
    useEffect(() => {
        async function loadNotes() {
            const snapshot = await getDocs(collection(db, "notes"));
            const notesList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNotes(notesList);
        }
        loadNotes();
    }, []);

    //Add note
    const addNote = async () => {
        if (!newNote.trim()) return;
        const docRef = await addDoc(collection(db, "notes"), { text: newNote.trim() });
        setNotes([...notes, { id: docRef.id, text: newNote.trim() }]);
        setNewNote("");
    };

    //Delete note
    const deleteNote = async (id) => {
        await deleteDoc(doc(db, "notes", id));
        setNotes(notes.filter((note) => note.id !== id));
    };

    // 🔹 Load categories from Firestore
    useEffect(() => {
        async function loadRecipes() {
            const snapshot = await getDocs(collection(db, "recipes"));
            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setEntrees([
                ...list.filter((r) => r.category === "entrees"),
                ...list.filter((r) => r.category === "sandwiches"),
            ]);
            setSides(list.filter((r) => r.category === "sides"));
            setDressings(list.filter((r) => r.category === "dressings"));
            setSoupsSalads([
                ...list.filter((r) => r.category === "soups"),
                ...list.filter((r) => r.category === "salads")
            ]);
            setAppetizers(list.filter((r) => r.category === "appetizers"));
            setDesserts(list.filter((r) => r.category === "desserts"));
        }
        loadRecipes();
    }, []);

    const handleCheck = async () => {
        const response = await fetch("http://localhost:5002/api/check-allergens", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mainId: selectedEntree,
                sides: selectedSides,
                dressings: selectedDressings,
                additionals: [...selectedSoupsSalads, ...selectedAppetizers, ...selectedDesserts],
                allergens: allergens.split(",").map((a) => a.trim())
            }),
        });
        const data = await response.json();
        setResults(data.results || []);
        setIngredients(data.ingredients || []);
    };

    // Utility for multi-select changes
    const handleMultiSelect = (e, setter) => {
        const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
        setter(values);
    };

    const handleCategoryClick = (category) => {
        navigate(`/category/${category}`);
    };

    return (
        <div className="home">
            <div className='logo-div'>
                <img src={benfrank} alt="Ben Franklin" />
            </div>
            <h1>Food For Thought</h1>
            <h1>Recipe Manager</h1>
            <div className='top'>
                {/* Notes Section */}
                <button onClick={() => setShowNotes(!showNotes)}>
                    {showNotes ? "Close Notes" : "Notes"}
                </button>
                <button onClick={() => setShowForm(!showForm)}>

                    {showForm ? "Close Allergen Checker" : "Check Allergens"}
                </button>
            </div>
            {showNotes && (
                <div className='show-note'>
                    <h2>Notes</h2>
                    <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a note..."
                        style={{ marginRight: "10px", padding: "5px" }} />
                    <button onClick={addNote}>Add</button>
                    <ul>
                        {notes.map(note => (
                            <li key={note.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                {note.text}
                                <button onClick={() => deleteNote(note.id)} style={{ marginLeft: "10px" }}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            {showForm && (
                <div className='show-allergen'>
                    <h2>Allergen Checker</h2>

                    {/* Entree (single select) */}
                    <label>Entree:</label>
                    <select
                        value={selectedEntree}
                        onChange={(e) => setSelectedEntree(e.target.value)}
                    >
                        <option value="">-- Select Entree --</option>
                        {entrees.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </select>

                    <br />
                    <br />
                    <div className="checkbox-row">
                        <div className="show-allergen-column">
                            <h1>Appetizers:</h1>
                            <div>
                                {appetizers.map((r) => (
                                    <label key={r.id} style={{ display: "block" }}>
                                        <input
                                            type="checkbox"
                                            value={r.id}
                                            checked={selectedAppetizers.includes(r.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedAppetizers([...selectedAppetizers, r.id]);
                                                } else {
                                                    setSelectedAppetizers(selectedAppetizers.filter(id => id !== r.id));
                                                }
                                            }} />
                                        {r.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Soups + Salads (multi select) */}
                        <div className="show-allergen-column">
                            <h1>Soups/Salads:</h1>
                            <div>

                                {soupsSalads.map((r) => (
                                    <label key={r.id} style={{ display: "block" }}>
                                        <input
                                            type="checkbox"
                                            value={r.id}
                                            checked={selectedSoupsSalads.includes(r.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedSoupsSalads([...selectedSoupsSalads, r.id]);
                                                } else {
                                                    setSelectedSoupsSalads(selectedSoupsSalads.filter(id => id !== r.id));
                                                }
                                            }} />
                                        {r.name}
                                    </label>
                                ))}

                            </div>
                        </div>

                        {/* Sides (multi select) */}
                        <div className="show-allergen-column">
                            <h1>Sides:</h1>
                            <div>
                                {sides.map((r) => (
                                    <label key={r.id} style={{ display: "block" }}>
                                        <input
                                            type="checkbox"
                                            value={r.id}
                                            checked={selectedSides.includes(r.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedSides([...selectedSides, r.id]);
                                                } else {
                                                    setSelectedSides(selectedSides.filter(id => id !== r.id));
                                                }
                                            }} />
                                        {r.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Dressings (multi select) */}
                        <div className="show-allergen-column">
                            <h1>Dressings:</h1>
                            <div>
                                {dressings.map((r) => (
                                    <label key={r.id} style={{ display: "block" }}>
                                        <input
                                            type="checkbox"
                                            value={r.id}
                                            checked={selectedDressings.includes(r.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDressings([...selectedDressings, r.id]);
                                                } else {
                                                    setSelectedDressings(selectedDressings.filter(id => id !== r.id));
                                                }
                                            }} />
                                        {r.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Desserts (multi select) */}
                        <div className="show-allergen-column">
                            <h1>Desserts:</h1>
                            <div>
                                {desserts.map((r) => (
                                    <label key={r.id} style={{ display: "block" }}>
                                        <input
                                            type="checkbox"
                                            value={r.id}
                                            checked={selectedDesserts.includes(r.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDesserts([...selectedDesserts, r.id]);
                                                } else {
                                                    setSelectedDesserts(selectedDesserts.filter(id => id !== r.id));
                                                }
                                            }} />
                                        {r.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Allergens input */}
                        <div className="show-allergen-column">
                            <h1>Allergens (comma separated):</h1>
                            <input
                                type="text"
                                value={allergens}
                                onChange={(e) => setAllergens(e.target.value)}
                                placeholder="e.g. peanuts, dairy, gluten" />

                            <br />
                            <br />

                            <button onClick={handleCheck}>Run Check</button>
                            </div>
                         </div>

                            {results.length > 0 && (
                                <div className="allergen-results">
                                    <h3>Results:</h3>
                                    <ul>
                                        {results.map((msg, idx) => (
                                            <li key={idx}>{msg}</li>
                                        ))}
                                    </ul>
                                    <h3>Ingredients:</h3>
                                    <ul>
                                        {ingredients.map((ing, idx) => (
                                            <li key={idx}>{ing}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                       
                    
                </div>

            )}
            <div className="categories">
                <button
                    onClick={() => handleCategoryClick('appetizers')}
                    style={{ margin: '10px', padding: '10px 20px' }}>
                    Appetizers
                </button>
                <button
                    onClick={() => handleCategoryClick('soups')}
                    style={{ margin: '10px', padding: '10px 20px' }}>
                    Soups
                </button>
                <button
                    onClick={() => handleCategoryClick('salads')}
                    style={{ margin: '10px', padding: '10px 20px' }}>
                    Salads
                </button>
                <button
                    onClick={() => handleCategoryClick('sandwiches')}
                    style={{ margin: '10px', padding: '10px 20px' }}>
                    Sandwiches
                </button>
                <button
                    onClick={() => handleCategoryClick('entrees')}
                    style={{ margin: '10px', padding: '10px 20px' }}>
                    Entrees
                </button>
                <button
                    onClick={() => handleCategoryClick('sides')}
                    style={{ margin: '10px', padding: '10px 20px' }}>
                    Sides
                </button>
                <button
                    onClick={() => handleCategoryClick('sauces')}
                    style={{ margin: '10px', padding: '10px 20px' }}>
                    Sauces, Gravies, Glazes
                </button>
                <button
                    onClick={() => handleCategoryClick('dressings')}
                    style={{ margin: '10px', padding: '10px 20px' }}>
                    Dressings
                </button>
                <button
                    onClick={() => handleCategoryClick('desserts')}
                    style={{ margin: '10px', padding: '10px 20px' }}>
                    Desserts
                </button>
                <button
                    onClick={() => handleCategoryClick('subrecipes')}
                    style={{ margin: '10px', padding: '10px 20px' }}>
                    Sub Recipes
                </button>
                <button
                    onClick={() => handleCategoryClick('specials')}
                    style={{ margin: '10px', padding: '10px 20px' }}>
                    Specials
                </button>
                <button
                    onClick={() => handleCategoryClick('ingredients')}
                    style={{ margin: '10px', padding: '10px 20px' }}>
                    Ingredients
                </button>
            </div>
        </div>
    );
};

export default Home;
