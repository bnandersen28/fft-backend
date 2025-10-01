import React, { useState } from "react";

const IngredientList = ({ ingredients }) => {
  return (
    <ul>
      {ingredients.map((ing, idx) => {
        if (typeof ing === "string") {
          // ✅ Normal ingredient
          return <li key={idx}>{ing}</li>;
        } else if (typeof ing === "object" && ing.type === "sub") {
          // ✅ Subingredient (with expand/collapse)
          return <SubIngredient key={idx} sub={ing} />;
        } else {
          return null;
        }
      })}
    </ul>
  );
};

const SubIngredient = ({ sub }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <li>
      <span
        style={{ fontWeight: "bold", color: "#0077cc", cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "▼ " : "▶ "} {sub.name}
      </span>

      {expanded && sub.ingredients && (
        <div style={{ marginLeft: "20px" }}>
          <IngredientList ingredients={sub.ingredients} />
        </div>
      )}
    </li>
  );
};

export default IngredientList;

