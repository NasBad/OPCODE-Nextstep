// helper to build a favicon URL from a domain
const fav = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

export const companiesMock = [
  { name: "Google", logo: fav("google.com") },
  { name: "Microsoft", logo: fav("microsoft.com") },
  { name: "Amazon", logo: fav("amazon.com") },
  { name: "Meta", logo: fav("meta.com") },
  { name: "Apple", logo: fav("apple.com") },
  { name: "Netflix", logo: fav("netflix.com") },
  { name: "Nvidia", logo: fav("nvidia.com") },
  { name: "IBM", logo: fav("ibm.com") },
  { name: "Intel", logo: fav("intel.com") },
  { name: "Check Point", logo: fav("checkpoint.com") },
  { name: "Wix", logo: fav("wix.com") },
  { name: "Monday.com", logo: fav("monday.com") },
  { name: "Fiverr", logo: fav("fiverr.com") },
  { name: "Amdocs", logo: fav("amdocs.com") },
  { name: "Elbit Systems", logo: fav("elbitsystems.com") },
  { name: "Mobileye", logo: fav("mobileye.com") },
  { name: "CyberArk", logo: fav("cyberark.com") },
  { name: "Radware", logo: fav("radware.com") },
  { name: "Varonis", logo: fav("varonis.com") },
  { name: "JFrog", logo: fav("jfrog.com") },
  { name: "SAP", logo: fav("sap.com") },
  { name: "Oracle", logo: fav("oracle.com") },
  { name: "Salesforce", logo: fav("salesforce.com") },
  { name: "Spotify", logo: fav("spotify.com") },
  { name: "Airbnb", logo: fav("airbnb.com") },
  { name: "Uber", logo: fav("uber.com") },
  { name: "IDF", logo: null },
  { name: "Rafael", logo: null },
  { name: "TechNova", logo: null },
  { name: "CyberFox", logo: null },
  { name: "BrightAI", logo: null },
];

// helper — find a company by name (case-insensitive)
export function getCompanyByName(name) {
  if (!name) return null;
  const lower = name.trim().toLowerCase();
  return companiesMock.find((c) => c.name.toLowerCase() === lower) ?? null;
}

// list of just the names (for Autocomplete options)
export const companyNames = companiesMock.map((c) => c.name);
