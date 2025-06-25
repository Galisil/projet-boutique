const testUser1 = {
  email: "test@test.com",
  password: "password123",
  name: "Test User",
};

const testUser2 = {
  email: "bob@bob.com",
  password: "password123",
  name: "Bob",
};

const testTenant1 = {
  name: "testShop1",
  password: "passShop1",
};

const testTenant2 = {
  name: "testShop2",
  password: "passShop2",
};

// Emails invalides pour les tests de validation dans register.test.ts
const invalidEmails = [
  "test@", // Pas de domaine
  "@test.com", // Pas de partie locale
  "test@test", // Pas de TLD
  "test..test@test.com", // Points consécutifs
  "test@test..com", // Points consécutifs dans le domaine
  "test@.com", // Domaine vide
  "test@test.", // TLD vide
  "test test@test.com", // Espace dans l'email
  "test@test@test.com", // Double @
  "test@test_com", // Underscore dans le domaine
  "test@test-.com", // Tirets en fin de domaine
  "test@-test.com", // Tirets en début de domaine
  "test@test.c", // TLD trop court
  "", // Email vide
  "justtext", // Pas d'@
  "test@test@.com", // Double @ avec domaine vide
];

export { testUser1, testUser2, testTenant1, testTenant2, invalidEmails };
