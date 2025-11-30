print("Running mongo init script...");

try {
    db = db.getSiblingDB("schoen-klinik");

   // check for the user reliably
  if (!db.getUser("schoen-klinik-user")) {
    db.createUser({
      user: "schoen-klinik-user",
      pwd: "admin",
      roles: [{ role: "readWrite", db: "schoen-klinik" }]
    });
    print("Created user schoen-klinik-user on schoen-klinik");
  } else {
    print("User schoen-klinik-user already exists, skipping createUser");
  }

    // seed example collection
    // db.anamnesisDocuments.insertMany([
    //     { id: "e54bc06b-a8a4-498e-8cf9-8683eecd4b11", description: "Husten", email: "alex@example.com", createdAt: new Date() },
    //     { id: "81b4b92f-9543-44e5-823a-c748d003aa40", description: "Bauchschmerzen", email: "marvin@example.com", createdAt: new Date() },
    //     { id: "9f50dc0a-8462-41a5-b0f6-e977732cd52a", description: "Schulterschmerzen", email: "steward@example.com", createdAt: new Date() }
    // ]);
    print("Seeded anamnesisDocuments");
} catch (err) {
    print("Init script error:", err);
    // abort init with non-zero exit code
    quit(1);
}