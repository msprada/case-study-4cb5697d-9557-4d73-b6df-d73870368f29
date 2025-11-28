conn = new Mongo();
db = conn.getDB("schoen-klinik");


db.createUser(
        {
            user: "schoen-klinik-user",
            pwd: "admin",
            roles: [
                {
                    role: "readWrite",
                    db: "schoen-klinik"
                }
            ]
        }
);