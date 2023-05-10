const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/pokemonFr", (req, res) => {
  // Récupérer les noms et les types des pokemons en français
  // const frenchPokemon = Pokedex.map((pokemon) => ({
  //   id : pokemon.id,
  //   name: pokemon.name.french,
  //   type: pokemon.type.join(", ")
  // }));
  fs.readFile("./data/pokedex.json", (err, data) => {
    const json = JSON.parse(data);
    const frenchPokemon = json.pokemon.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name.french,
      type: pokemon.type.join(", "),
    }));
    res.status(200).json(frenchPokemon);
  });
});

app.get("/pokemonEn", (req, res) => {
  // Récupérer les noms et les types des pokemons en anglais

  fs.readFile("./data/pokedex.json", (err, data) => {
    const json = JSON.parse(data);
    const englishPokemon = json.pokemon.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name.english,
      type: pokemon.type.join(", "),
    }));
    res.status(200).json(englishPokemon);
  });
});

app.delete("/pokemon/:id", (req, res) => {
  // const pokemonName = req.body.name;

  // //const pokemons = JSON.parse(data);
  // //const index = pokemons.findIndex((pokemon) => pokemon.id === id);
  // const index = Pokedex.findIndex(
  //   (pokemon) =>
  //     pokemon.name.english === pokemonName ||
  //     pokemon.name.french === pokemonName
  // );
  // console.log(index);
  // if (index === -1) {
  //   res.status(404).json({ message: "Pokemon not found" });
  // } else {
  //   Pokedex.splice(index, 1);
  //   //fs.writeFileSync("./data/pokedex.json", JSON.stringify(Pokedex));
  //   res.status(200).json({ message: `Pokemon ${pokemonId} deleted` });
  // }

  fs.readFile("./data/pokedex.json", (err, data) => {
    if (err) throw err;

    let id = parseInt(req.params.id);
    const pokemons = JSON.parse(data);
    //const idSup = id;

    //const indexToDelete = data.findIndex(el => el.id === idSup);
    const index = pokemons.pokemon.findIndex((pokemon) => pokemon.id === id);
    if (index === -1) {
      res.send("Pokemon non trouvé.");
      return;
    }

    pokemons.pokemon.splice(index, 1);

    fs.writeFile(
      "./data/pokedex.json",
      JSON.stringify(pokemons, null, 2),
      (err) => {
        if (err) throw err;
        res.send("Pokemon supprimer !");
      }
    );
  });
});

// Route pour modifier un Pokemon existant
app.put("/modify/:id", (req, res) => {
  const pokemonId = req.params.id;
  const newPokemon = req.body;

  fs.readFile("./data/pokemon.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal server error");
      return;
    }

    const pokemons = JSON.parse(data);

    // Recherche du Pokemon à modifier dans le tableau
    const pokemonIndex = pokemons.pokemon.findIndex(
      (pokemon) => pokemon.id === parseInt(pokemonId)
    );

    if (pokemonIndex === -1) {
      res.status(404).send("Pokemon not found");
      return;
    }

    // Modification du Pokemon dans le tableau
    pokemons[pokemonIndex] = { ...pokemons[pokemonIndex], ...newPokemon };

    // Mise à jour du fichier JSON avec les modifications
    fs.writeFile(
      "./data/pokemon.json",
      JSON.stringify(pokemons),
      "utf-8",
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal server error");
          return;
        }
        res.send(pokemons[pokemonIndex]);
      }
    );
  });
});




const port = 4000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
