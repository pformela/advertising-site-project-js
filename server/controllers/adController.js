const asyncHandler = require("express-async-handler");
const neo4j = require("neo4j-driver");
const { v4: uuidv4 } = require("uuid");

const MONTHS = {
  January: "Stycznia",
  February: "Lutego",
  March: "Marca",
  April: "Kwietnia",
  May: "Maja",
  June: "Czerwca",
  July: "Lipca",
  August: "Sierpnia",
  September: "Września",
  October: "Października",
  November: "Listopada",
  December: "Grudnia",
};

const DUMMY_CATEGORIES = {
  Elektronika: {
    id: 1,
    name: "Elektronika",
    cat: "Elektronika",
  },
  Motoryzacja: {
    id: 2,
    name: "Motoryzacja",
    cat: "Motoryzacja",
  },
  DomIOgrod: { id: 3, name: "Dom i ogród", cat: "DomIOgrod" },
  Moda: { id: 4, name: "Moda", cat: "Moda" },
  SportITurystyka: {
    id: 5,
    name: "Sport i turystyka",
    cat: "SportITurystyka",
  },
  ZdrowieIUroda: {
    id: 6,
    name: "Zdrowie i uroda",
    cat: "ZdrowieIUroda",
  },
  DlaDzieci: { id: 7, name: "Dla dzieci", cat: "DlaDzieci" },
  MuzykaIRozrywka: {
    id: 8,
    name: "Muzyka i rozrywka",
    cat: "MuzykaIRozrywka",
  },
  KsiazkiICzasopisma: {
    id: 9,
    name: "Książki i czasopisma",
    cat: "KsiazkiICzasopisma",
  },
  Zwierzeta: { id: 10, name: "Zwierzęta", cat: "Zwierzeta" },
  Praca: { id: 11, name: "Praca", cat: "Praca" },
  Uslugi: { id: 12, name: "Usługi", cat: "Uslugi" },
  Inne: { id: 13, name: "Inne", cat: "Inne" },
};

const changeDate = (date) => {
  const createdDate = new Date(date.toString())
    .toLocaleDateString(
      {},
      {
        timeZone: "UTC",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    )
    .replace(",", "")
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return MONTHS[word];
      }
      return word;
    });

  return createdDate[1] + " " + createdDate[0] + " " + createdDate[2];
};

const prepareData = (result) => {
  const ads = result.records.reduce((acc, record) => {
    const userId = record.get("u").properties.userId;
    const ad = record.get("a").properties;
    const labels = record.get("a").labels.filter((label) => label !== "Ad")[0];
    const photo = record.get("p").properties;
    const username = record.get("u").properties.email.split("@")[0];

    photo.position = photo.position.low;

    ad.category = DUMMY_CATEGORIES[labels].name;
    ad.price = ad.price.low;
    ad.originalCreatedAt = new Date(
      ad.createdAt.toString()
    ).toLocaleDateString();
    ad.createdAt = changeDate(ad.createdAt);
    ad.updatedAt = changeDate(ad.updatedAt);

    if (acc[ad.id]) {
      acc[ad.id].photos.push(photo);
    } else {
      acc[ad.id] = { ...ad, username, userId, photos: [photo] };
    }

    return acc;
  }, {});

  const adResult = Object.values(ads).map((ad) => {
    ad.photos.sort((a, b) => a.position - b.position);
    return ad;
  });

  return adResult;
};

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_LOGIN, process.env.NEO4J_PASSWORD)
);

const getAds = asyncHandler(async (req, res) => {
  const { category, city, priceFrom, priceTo, searchValue, limit, sort, asc } =
    req.body;

  const session = driver.session();
  session
    .run(
      `
      MATCH (a:Ad${
        category !== "" && category !== undefined ? ":" + category : ""
      })
      WHERE a.city CONTAINS "${city || ""}"
      AND a.active = true
      ${priceFrom ? "AND a.price >= " + priceFrom : ""}
      ${priceTo ? "AND a.price <= " + priceTo : ""}
      ${
        searchValue
          ? `AND a.title =~ "${
              searchValue ? "(?i).*" + searchValue + ".*" : ""
            }"`
          : ""
      }
      WITH a
      ORDER BY rand()
      ${limit ? "LIMIT " + limit : ""}
      MATCH (u:User)-[:POSTED]->(a)-[:HAS_PHOTO]->(p:Photo)
      RETURN u, a, p
      ${sort ? "ORDER BY a." + sort + " " + (asc ? "ASC" : "DESC") : ""}
    `
    )
    .then((result) => {
      session.close();
      const ads = prepareData(result);

      res.status(200).json(ads);
    })
    .catch((err) => {
      session.close();
      console.log(err);
      res.status(500);
    });
});

const getUserAds = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const session = driver.session();
  session
    .run(
      `
      MATCH (u:User {userId: "${userId}"})-[:POSTED]->(a:Ad)-[:HAS_PHOTO]->(p:Photo)
      OPTIONAL MATCH (a)<-[f:FAVOURITE]-(l:User)
      RETURN u, a, p, count(f) as fav
    `
    )
    .then((result) => {
      session.close();

      const ads = result.records.reduce((acc, record) => {
        const userId = record.get("u").properties.userId;
        const ad = record.get("a").properties;
        const labels = record
          .get("a")
          .labels.filter((label) => label !== "Ad")[0];
        const photo = record.get("p").properties;
        const fav = record.get("fav").low;

        photo.position = photo.position.low;

        ad.likes = fav;
        ad.category = DUMMY_CATEGORIES[labels].name;
        ad.price = ad.price.low;
        ad.originalCreatedAt = ad.createdAt.toString();
        ad.createdAt = changeDate(ad.createdAt);
        ad.updatedAt = changeDate(ad.updatedAt);

        if (acc[ad.id]) {
          acc[ad.id].photos.push(photo);
        } else {
          acc[ad.id] = { ...ad, userId, photos: [photo] };
        }

        return acc;
      }, {});

      const adResult = Object.values(ads).map((ad) => {
        ad.photos.sort((a, b) => a.position - b.position);
        return ad;
      });

      res.status(200).json(adResult);
    })
    .catch((err) => {
      session.close();
      console.log(err);
      res.status(500).send("Błąd przy wyszukiwaniu ogłoszeń");
    });
});

const getSingleAd = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const session = driver.session();
  session
    .run(
      `
      MATCH (u:User)-[:POSTED]->(a:Ad {id: "${id}"})-[:HAS_PHOTO]->(p:Photo)
      RETURN u, a, p
    `
    )
    .then((result) => {
      session.close();
      const ads = prepareData(result);

      res.status(200).json(ads);
    })
    .catch((err) => {
      session.close();
      console.log(err);
      res.status(500).send("Nie znaleziono ogłoszenia");
    });
});

const addToFavourites = asyncHandler(async (req, res) => {
  const { userId, adId } = req.body;

  if (!userId || !adId) {
    res.status(400).send("Nie podano id użytkownika lub ogłoszenia");
  }

  const session = driver.session();
  session
    .run(
      `
      MATCH (u:User {userId: "${userId}"}), (a:Ad {id: "${adId}"})
      CREATE (u)-[:FAVOURITE]->(a)
    `
    )
    .then((result) => {
      session.close();

      res.status(200).json({ message: "Dodano ogłoszenie do ulubionych!" });
    })
    .catch((err) => {
      session.close();
      console.log(err);
      res.status(500).json({ message: "Błąd przy dodawaniu do ulubionych" });
    });
});

const removeFromFavourites = asyncHandler(async (req, res) => {
  const { userId, adId } = req.body;

  const session = driver.session();
  session
    .run(
      `
      MATCH (u:User {userId: "${userId}"})-[r:FAVOURITE]->(a:Ad {id: "${adId}"})
      DELETE r
    `
    )
    .then((result) => {
      session.close();
      res.status(200).json({ message: "Usunięto ogłoszenie z ulubionych." });
    })
    .catch((err) => {
      session.close();
      console.log(err);
      res.status(500).json({ message: "Błąd przy usuwaniu z ulubionych" });
    });
});

const getFavourites = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const session = driver.session();
  session
    .run(
      `
      MATCH (u:User {userId: "${userId}"})-[:FAVOURITE]->(a:Ad)-[:HAS_PHOTO]->(p:Photo)
      RETURN u, a, p
    `
    )
    .then((result) => {
      session.close();

      const ads = prepareData(result);

      res.status(200).json(ads);
    })
    .catch((err) => {
      session.close();
      console.log(err);
      res.status(500).send("Błąd przy pobieraniu ulubionych");
    });
});

const createAd = asyncHandler(async (req, res) => {
  const { email, adId, ad, photos } = req.body;
  const { title, description, price, category, city, phone, formEmail } = ad;

  const formattedDesc = description.replace(/"/g, "\\'");

  const session = driver.session();
  session
    .run(
      `
      MATCH (u:User {email: "${email}"})
      CREATE (a:Ad:${category} {id: "${adId}", active: true, title: "${title}", description: "${formattedDesc}", price: ${+price}, city: "${city}", phone: "${phone}", email: "${formEmail}", createdAt: datetime(), updatedAt: datetime()})
      ${photos.reduce((acc, photoUrl, index) => {
        return (
          acc +
          `CREATE (p${index}:Photo {url: "${photoUrl}", position: ${
            index + 1
          }}) 
        CREATE (a)-[:HAS_PHOTO]->(p${index})\n`
        );
      }, "")}
      CREATE (u)-[:POSTED]->(a)
      RETURN a
    `
    )
    .then((result) => {
      session.close();
      try {
        res.status(201).json(result.records[0].get("a").properties);
      } catch (err) {
        console.log(err);
        res.status(500).send("Nie udało się utworzyć ogłoszenia");
      }
    })
    .catch((err) => {
      session.close();
      console.log(err);
      res.status(500);
    });
});

const deleteAd = asyncHandler(async (req, res) => {
  const { userId, adId } = req.body;

  const session = driver.session();
  session
    .run(
      `
      MATCH (u:User {userId: "${userId}"})-[r:POSTED]->(a:Ad {id: "${adId}"})-[r2:HAS_PHOTO]->(p:Photo)
      DETACH DELETE a, p
    `
    )
    .then((result) => {
      session.close();

      res.status(200).json({ message: "Usunięto ogłoszenie" });
    })
    .catch((err) => {
      session.close();
      console.log(err);
      res.status(500).json({ message: "Nie udało się usunąć ogłoszenia" });
    });
});

const updateAd = asyncHandler(async (req, res) => {
  const { userId, adId, ad, photos } = req.body;
  const { title, description, price, category, city, phone, formEmail } = ad;

  const formattedDesc = description.replace(/"/g, "\\'");

  const session = driver.session();
  session
    .run(
      `
      MATCH (u:User {userId: "${userId}"})-[r:POSTED]->(a:Ad {id: "${adId}"})-[:HAS_PHOTO]->(photos:Photo)
      SET a.title = "${title}"
      SET a.description = "${formattedDesc}"
      SET a.price = ${+price}
      SET a.city = "${city}"
      SET a.phone = "${phone}"
      SET a.email = "${formEmail}"
      SET a.updatedAt = datetime()
      DETACH DELETE photos
      ${photos.reduce((acc, photo, index) => {
        return (
          acc +
          `MERGE (p${index}:Photo {url: "${photo.url}", position: ${index + 1}})
        MERGE (a)-[:HAS_PHOTO]->(p${index})\n`
        );
      }, "")}
      RETURN u, a
    `
    )
    .then((result) => {
      session.close();

      res.status(200).json({ message: "Zaktualizowano ogłoszenie" });
    })
    .catch((err) => {
      session.close();
      console.log(err);
      res
        .status(500)
        .json({ message: "Nie udało się zaktualizować ogłoszenia" });
    });
});

const activateAd = asyncHandler(async (req, res) => {
  const { adId } = req.body;

  const session = driver.session();
  session
    .run(
      `
      MATCH (u:User)-[:POSTED]->(a:Ad {id: "${adId}"})-[:HAS_PHOTO]->(p:Photo)
      OPTIONAL MATCH (a)<-[f:FAVOURITE]-(l:User)
      SET a.active = true
      SET a.updatedAt = datetime()
      RETURN u, a, p, count(f) as fav
    `
    )
    .then((result) => {
      session.close();

      const ads = result.records.reduce((acc, record) => {
        const userId = record.get("u").properties.userId;
        const ad = record.get("a").properties;
        const labels = record
          .get("a")
          .labels.filter((label) => label !== "Ad")[0];
        const photo = record.get("p").properties;
        const fav = record.get("fav").low;

        photo.position = photo.position.low;

        ad.likes = fav;
        ad.category = DUMMY_CATEGORIES[labels].name;
        ad.price = ad.price.low;
        ad.originalCreatedAt = ad.createdAt;
        ad.createdAt = changeDate(ad.createdAt);
        ad.updatedAt = changeDate(ad.updatedAt);

        if (acc[ad.id]) {
          acc[ad.id].photos.push(photo);
        } else {
          acc[ad.id] = { ...ad, userId, photos: [photo] };
        }

        return acc;
      }, {});

      const adResult = Object.values(ads).map((ad) => {
        ad.photos.sort((a, b) => a.position - b.position);
        return ad;
      });

      res.status(200).json(adResult);
    })
    .catch((err) => {
      session.close();
      console.log(err);
      res.status(500).json({ message: "Nie udało się aktywować ogłoszenia" });
    });
});

const deactivateAd = asyncHandler(async (req, res) => {
  const { adId } = req.body;

  const session = driver.session();
  session
    .run(
      `
      MATCH (u:User)-[:POSTED]->(a:Ad {id: "${adId}"})-[:HAS_PHOTO]->(p:Photo)
      SET a.active = false
      SET a.updatedAt = datetime()
      RETURN u, p, a
    `
    )
    .then((result) => {
      session.close();

      const ads = prepareData(result);

      res.status(200).json(ads);
    })
    .catch((err) => {
      session.close();
      console.log(err);
      res.status(500).json({ message: "Nie udało się usunąć ogłoszenia" });
    });
});

module.exports = {
  getAds,
  getSingleAd,
  getUserAds,
  createAd,
  deleteAd,
  updateAd,
  addToFavourites,
  removeFromFavourites,
  activateAd,
  deactivateAd,
  getFavourites,
};
