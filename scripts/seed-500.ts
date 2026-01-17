import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parapharmacie';

// Catégories réelles de parapharmacie
const categories = [
  {
    name: 'Soins Visage',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
    slug: 'soins-visage',
  },
  {
    name: 'Soins Corps',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80',
    slug: 'soins-corps',
  },
  {
    name: 'Hygiène Bucco-Dentaire',
    image: 'https://images.unsplash.com/photo-1559591937-4d8a1cd96tried?w=800&q=80',
    slug: 'hygiene-bucco-dentaire',
  },
  {
    name: 'Solaires',
    image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&q=80',
    slug: 'solaires',
  },
  {
    name: 'Cheveux',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    slug: 'cheveux',
  },
  {
    name: 'Compléments Alimentaires',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    slug: 'complements-alimentaires',
  },
  {
    name: 'Bébé & Maman',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    slug: 'bebe-maman',
  },
  {
    name: 'Minceur & Diététique',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    slug: 'minceur-dietetique',
  },
  {
    name: 'Aromathérapie',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
    slug: 'aromatherapie',
  },
  {
    name: 'Premiers Soins',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&q=80',
    slug: 'premiers-soins',
  },
  {
    name: 'Homme',
    image: 'https://images.unsplash.com/photo-1581750493248-a5c0f7d47eb2?w=800&q=80',
    slug: 'homme',
  },
  {
    name: 'Bio & Naturel',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    slug: 'bio-naturel',
  },
];

// Images réelles pour chaque catégorie
const productImages = {
  'soins-visage': [
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&q=80',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80',
    'https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=600&q=80',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
    'https://images.unsplash.com/photo-1556228994-a2b7a1f99b93?w=600&q=80',
    'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&q=80',
    'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&q=80',
    'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80',
  ],
  'soins-corps': [
    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80',
    'https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=600&q=80',
    'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
    'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    'https://images.unsplash.com/photo-1598662972299-5408ddb8a3dc?w=600&q=80',
  ],
  'hygiene-bucco-dentaire': [
    'https://images.unsplash.com/photo-1559591937-0c5a5f6f0e52?w=600&q=80',
    'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80',
    'https://images.unsplash.com/photo-1571942676516-bcab84649e44?w=600&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
  ],
  'solaires': [
    'https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=600&q=80',
    'https://images.unsplash.com/photo-1594125311687-3b1b3eefa9f2?w=600&q=80',
    'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=600&q=80',
    'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&q=80',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&q=80',
  ],
  'cheveux': [
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&q=80',
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&q=80',
    'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=600&q=80',
    'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&q=80',
  ],
  'complements-alimentaires': [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
    'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&q=80',
    'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&q=80',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&q=80',
    'https://images.unsplash.com/photo-1607619056574-7b8d3bc536b2?w=600&q=80',
  ],
  'bebe-maman': [
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80',
    'https://images.unsplash.com/photo-1584839404042-8bc21d240de6?w=600&q=80',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
    'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&q=80',
  ],
  'minceur-dietetique': [
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80',
    'https://images.unsplash.com/photo-1511909525232-61113c912358?w=600&q=80',
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
  ],
  'aromatherapie': [
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
    'https://images.unsplash.com/photo-1600493572622-18e5c4ecb7e1?w=600&q=80',
    'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&q=80',
    'https://images.unsplash.com/photo-1547793548-7a0e7dfdb24f?w=600&q=80',
    'https://images.unsplash.com/photo-1600493505591-6aba7d41f6db?w=600&q=80',
  ],
  'premiers-soins': [
    'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&q=80',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&q=80',
    'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=600&q=80',
  ],
  'homme': [
    'https://images.unsplash.com/photo-1581750493248-a5c0f7d47eb2?w=600&q=80',
    'https://images.unsplash.com/photo-1621607510248-4a5b1c7c5583?w=600&q=80',
    'https://images.unsplash.com/photo-1585652757141-8837d676054c?w=600&q=80',
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
    'https://images.unsplash.com/photo-1622618760546-8e443f8e0c2e?w=600&q=80',
  ],
  'bio-naturel': [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
    'https://images.unsplash.com/photo-1598662972299-5408ddb8a3dc?w=600&q=80',
    'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&q=80',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
  ],
};

// Produits réels de parapharmacie par catégorie
const productTemplates: Record<string, Array<{name: string; description: string; composition: string; priceRange: [number, number]}>> = {
  'soins-visage': [
    { name: 'Crème Hydratante Jour SPF 15', description: 'Crème hydratante légère avec protection solaire pour une peau protégée et hydratée toute la journée.', composition: 'Aqua, Glycerin, Niacinamide, Hyaluronic Acid, SPF 15', priceRange: [18, 35] },
    { name: 'Sérum Vitamine C 15%', description: 'Sérum anti-oxydant à la vitamine C pure pour un teint éclatant et uniforme.', composition: 'Vitamin C 15%, Vitamin E, Ferulic Acid, Hyaluronic Acid', priceRange: [25, 45] },
    { name: 'Crème Anti-Rides Nuit', description: 'Soin de nuit intensif au rétinol pour réduire les rides et ridules.', composition: 'Retinol 0.3%, Peptides, Squalane, Vitamin E', priceRange: [30, 55] },
    { name: 'Eau Micellaire Démaquillante', description: 'Eau micellaire douce pour démaquiller et nettoyer le visage sans rinçage.', composition: 'Aqua, Micelles, Glycerin, Panthenol, Chamomile Extract', priceRange: [8, 18] },
    { name: 'Masque Hydratant Intense', description: 'Masque en tissu ultra-hydratant à l\'acide hyaluronique pour une peau repulpée.', composition: 'Hyaluronic Acid, Aloe Vera, Vitamin B5, Ceramides', priceRange: [4, 12] },
    { name: 'Contour des Yeux Anti-Cernes', description: 'Soin spécifique pour atténuer les cernes et les poches sous les yeux.', composition: 'Caffeine, Vitamin K, Peptides, Cucumber Extract', priceRange: [20, 40] },
    { name: 'Gel Nettoyant Purifiant', description: 'Gel nettoyant moussant pour peaux mixtes à grasses, purifie sans dessécher.', composition: 'Salicylic Acid 2%, Zinc PCA, Tea Tree Oil, Aloe Vera', priceRange: [12, 22] },
    { name: 'Crème Apaisante Peau Sensible', description: 'Crème riche pour peaux sensibles et réactives, apaise les irritations.', composition: 'Centella Asiatica, Allantoin, Bisabolol, Shea Butter', priceRange: [18, 32] },
    { name: 'Sérum Acide Hyaluronique', description: 'Sérum hydratant intensif à l\'acide hyaluronique multi-poids moléculaires.', composition: 'Hyaluronic Acid (3 types), Vitamin B5, Glycerin', priceRange: [15, 35] },
    { name: 'Exfoliant Enzymatique Doux', description: 'Gommage enzymatique pour une exfoliation douce, idéal peaux sensibles.', composition: 'Papain, Bromelain, Lactic Acid, Jojoba Beads', priceRange: [16, 28] },
    { name: 'Huile Visage Nourrissante', description: 'Huile sèche multi-fonctions pour nourrir et protéger la peau.', composition: 'Rosehip Oil, Argan Oil, Jojoba Oil, Vitamin E', priceRange: [22, 38] },
    { name: 'BB Crème Perfectrice', description: 'Crème teintée hydratante pour un teint unifié et naturel.', composition: 'Titanium Dioxide, Zinc Oxide, Hyaluronic Acid, Niacinamide', priceRange: [14, 26] },
    { name: 'Lotion Tonique Equilibrante', description: 'Lotion tonique sans alcool pour équilibrer et préparer la peau.', composition: 'Witch Hazel, Rose Water, Glycerin, Aloe Vera', priceRange: [10, 20] },
    { name: 'Masque Argile Verte Purifiant', description: 'Masque à l\'argile verte pour purifier et détoxifier les peaux grasses.', composition: 'Kaolin, Bentonite, Green Clay, Tea Tree Oil', priceRange: [12, 22] },
    { name: 'Crème Réparatrice Cicatrisante', description: 'Baume réparateur pour les peaux abîmées et irritées.', composition: 'Panthenol, Madecassoside, Copper Peptides, Zinc', priceRange: [15, 28] },
    { name: 'Sérum Anti-Taches Éclat', description: 'Sérum ciblé pour atténuer les taches pigmentaires et unifier le teint.', composition: 'Alpha Arbutin, Kojic Acid, Niacinamide, Vitamin C', priceRange: [25, 42] },
    { name: 'Mousse Nettoyante Douce', description: 'Mousse légère pour un nettoyage en douceur matin et soir.', composition: 'Coconut Surfactants, Chamomile, Aloe Vera, Glycerin', priceRange: [10, 18] },
    { name: 'Crème Lift Fermeté', description: 'Soin raffermissant pour redonner élasticité et tonicité à la peau.', composition: 'DMAE, Peptides, Collagen, Elastin', priceRange: [35, 55] },
    { name: 'Fluide Matifiant Peaux Grasses', description: 'Fluide léger matifiant pour contrôler le sébum toute la journée.', composition: 'Niacinamide, Zinc PCA, Silica, Salicylic Acid', priceRange: [16, 28] },
    { name: 'Baume Lèvres Réparateur', description: 'Baume nourrissant pour des lèvres douces et protégées.', composition: 'Shea Butter, Beeswax, Vitamin E, Honey', priceRange: [5, 12] },
  ],
  'soins-corps': [
    { name: 'Lait Corps Hydratant 24h', description: 'Lait corporel longue durée pour une hydratation intense et durable.', composition: 'Shea Butter, Glycerin, Aloe Vera, Vitamin E', priceRange: [12, 24] },
    { name: 'Huile Sèche Multi-Usages', description: 'Huile sèche satinée pour le corps, le visage et les cheveux.', composition: 'Argan Oil, Macadamia Oil, Jojoba Oil, Vitamin E', priceRange: [18, 32] },
    { name: 'Gommage Corps au Sucre', description: 'Gommage exfoliant au sucre pour une peau douce et lisse.', composition: 'Sugar Crystals, Coconut Oil, Honey, Essential Oils', priceRange: [14, 24] },
    { name: 'Crème Mains Réparatrice', description: 'Crème riche pour des mains douces et protégées.', composition: 'Shea Butter, Glycerin, Allantoin, Vitamin E', priceRange: [6, 14] },
    { name: 'Beurre Corporel Karité', description: 'Beurre riche au karité pour nourrir les peaux très sèches.', composition: 'Shea Butter 20%, Cocoa Butter, Coconut Oil', priceRange: [16, 28] },
    { name: 'Gel Douche Surgras', description: 'Gel douche enrichi pour nettoyer sans dessécher la peau.', composition: 'Coconut Surfactants, Glycerin, Olive Oil, Vitamin E', priceRange: [8, 16] },
    { name: 'Huile Amincissante Fermeté', description: 'Huile minceur pour raffermir et tonifier la silhouette.', composition: 'Caffeine, Ginger Extract, Pink Pepper, Grapefruit Oil', priceRange: [22, 38] },
    { name: 'Crème Anti-Vergetures', description: 'Soin préventif et correcteur contre les vergetures.', composition: 'Centella Asiatica, Vitamin E, Sweet Almond Oil, Elastin', priceRange: [18, 32] },
    { name: 'Savon Surgras Sans Parfum', description: 'Pain dermatologique ultra-doux pour peaux sensibles.', composition: 'Coconut Oil, Olive Oil, Shea Butter, Glycerin', priceRange: [4, 10] },
    { name: 'Lait Après-Soleil Apaisant', description: 'Soin après-soleil hydratant et réparateur.', composition: 'Aloe Vera, Panthenol, Chamomile, Vitamin E', priceRange: [12, 22] },
    { name: 'Déodorant Naturel Pierre d\'Alun', description: 'Déodorant 24h sans aluminium ni parabènes.', composition: 'Potassium Alum, Aloe Vera', priceRange: [6, 12] },
    { name: 'Crème Pieds Ultra-Réparatrice', description: 'Soin intensif pour les pieds secs et abîmés.', composition: 'Urea 10%, Shea Butter, Salicylic Acid, Peppermint', priceRange: [8, 16] },
    { name: 'Huile de Massage Relaxante', description: 'Huile de massage aux huiles essentielles apaisantes.', composition: 'Sweet Almond Oil, Lavender, Chamomile, Ylang-Ylang', priceRange: [14, 26] },
    { name: 'Gommage Sel de la Mer Morte', description: 'Exfoliant aux sels minéraux pour une peau purifiée.', composition: 'Dead Sea Salt, Olive Oil, Almond Oil, Vitamin E', priceRange: [16, 28] },
    { name: 'Lait Corps Raffermissant', description: 'Soin tonifiant pour une peau plus ferme et élastique.', composition: 'Caffeine, Collagen, Elastin, Centella Asiatica', priceRange: [18, 32] },
  ],
  'hygiene-bucco-dentaire': [
    { name: 'Dentifrice Blancheur', description: 'Dentifrice blanchissant pour des dents plus blanches en 14 jours.', composition: 'Fluoride, Silica, Calcium Carbonate, Peppermint', priceRange: [4, 10] },
    { name: 'Bain de Bouche Antibactérien', description: 'Solution buccale pour une haleine fraîche et une hygiène optimale.', composition: 'Chlorhexidine 0.12%, Fluoride, Menthol', priceRange: [6, 14] },
    { name: 'Fil Dentaire Mentholé', description: 'Fil dentaire ciré à la menthe pour un nettoyage interdentaire efficace.', composition: 'Nylon, Mint Flavor, Wax Coating', priceRange: [3, 8] },
    { name: 'Dentifrice Sensibilité', description: 'Dentifrice pour dents sensibles avec protection longue durée.', composition: 'Potassium Nitrate, Fluoride, Calcium', priceRange: [5, 12] },
    { name: 'Brosse à Dents Souple', description: 'Brosse à dents à poils souples pour un brossage délicat.', composition: 'Soft Nylon Bristles, Ergonomic Handle', priceRange: [3, 8] },
    { name: 'Gel Gencives Sensibles', description: 'Gel apaisant pour gencives irritées et sensibles.', composition: 'Chlorhexidine, Chamomile, Aloe Vera, Vitamin E', priceRange: [8, 16] },
    { name: 'Dentifrice Enfant Fraise', description: 'Dentifrice doux pour enfants au goût fraise.', composition: 'Fluoride 500ppm, Xylitol, Natural Strawberry Flavor', priceRange: [3, 7] },
    { name: 'Spray Haleine Fraîche', description: 'Spray buccal pour une haleine fraîche instantanée.', composition: 'Menthol, Chlorophyll, Zinc Citrate', priceRange: [4, 10] },
    { name: 'Brossettes Interdentaires', description: 'Set de brossettes pour un nettoyage interdentaire optimal.', composition: 'Stainless Steel Core, Soft Nylon Bristles', priceRange: [5, 12] },
    { name: 'Dentifrice Charbon Actif', description: 'Dentifrice détoxifiant au charbon pour des dents purifiées.', composition: 'Activated Charcoal, Coconut Oil, Peppermint', priceRange: [6, 14] },
  ],
  'solaires': [
    { name: 'Crème Solaire SPF 50+', description: 'Protection solaire très haute pour le visage et le corps.', composition: 'Titanium Dioxide, Zinc Oxide, Vitamin E, Aloe Vera', priceRange: [16, 28] },
    { name: 'Spray Solaire SPF 30', description: 'Spray solaire facile à appliquer pour une protection quotidienne.', composition: 'Octinoxate, Avobenzone, Vitamin E, Coconut Oil', priceRange: [14, 24] },
    { name: 'Huile Solaire Bronzante SPF 15', description: 'Huile sèche pour un bronzage progressif et sublime.', composition: 'Carrot Oil, Monoi, Vitamin E, SPF 15', priceRange: [12, 22] },
    { name: 'Stick Solaire Lèvres SPF 50', description: 'Protection solaire spécifique pour les lèvres sensibles.', composition: 'Zinc Oxide, Beeswax, Shea Butter, Vitamin E', priceRange: [6, 12] },
    { name: 'Après-Soleil Lait Apaisant', description: 'Soin après-soleil hydratant pour prolonger le bronzage.', composition: 'Aloe Vera, Bisabolol, Panthenol, Vitamin E', priceRange: [12, 22] },
    { name: 'Brume Solaire Enfants SPF 50+', description: 'Protection solaire haute pour les peaux délicates des enfants.', composition: 'Titanium Dioxide, Zinc Oxide, Calendula, Chamomile', priceRange: [14, 26] },
    { name: 'Autobronzant Naturel', description: 'Lotion autobronzante pour un hâle naturel sans soleil.', composition: 'DHA, Erythrulose, Aloe Vera, Vitamin E', priceRange: [14, 26] },
    { name: 'Gel Solaire Visage Mat SPF 30', description: 'Protection solaire matifiante pour le visage.', composition: 'Silica, Niacinamide, Zinc Oxide, Vitamin C', priceRange: [16, 28] },
    { name: 'Crème Solaire Teintée SPF 50', description: 'Protection solaire avec effet bonne mine.', composition: 'Iron Oxides, Titanium Dioxide, Niacinamide', priceRange: [18, 32] },
    { name: 'Activateur de Bronzage', description: 'Soin préparateur pour un bronzage plus rapide et uniforme.', composition: 'Tyrosine, Beta-Carotene, Carrot Oil, Vitamin E', priceRange: [14, 24] },
  ],
  'cheveux': [
    { name: 'Shampoing Réparateur Kératine', description: 'Shampoing fortifiant à la kératine pour cheveux abîmés.', composition: 'Keratin, Wheat Protein, Argan Oil, Vitamin B5', priceRange: [10, 20] },
    { name: 'Après-Shampoing Démêlant', description: 'Soin démêlant pour des cheveux souples et brillants.', composition: 'Silicone, Argan Oil, Keratin, Vitamin E', priceRange: [8, 18] },
    { name: 'Masque Capillaire Intense', description: 'Masque nourrissant profond pour cheveux très secs.', composition: 'Shea Butter, Avocado Oil, Keratin, Silk Proteins', priceRange: [12, 24] },
    { name: 'Huile Capillaire Multi-Usages', description: 'Huile légère pour nourrir, discipliner et faire briller.', composition: 'Argan Oil, Jojoba Oil, Vitamin E, Linseed Oil', priceRange: [14, 26] },
    { name: 'Shampoing Anti-Pelliculaire', description: 'Shampoing traitant pour éliminer les pellicules.', composition: 'Zinc Pyrithione, Tea Tree Oil, Salicylic Acid', priceRange: [10, 20] },
    { name: 'Sérum Pointes Sèches', description: 'Soin sans rinçage pour réparer les pointes fourchues.', composition: 'Silicone, Argan Oil, Keratin, Vitamin E', priceRange: [10, 22] },
    { name: 'Shampoing Volume', description: 'Shampoing volumateur pour des cheveux plus épais.', composition: 'Biotin, Collagen, Wheat Protein, Panthenol', priceRange: [10, 18] },
    { name: 'Lotion Anti-Chute', description: 'Traitement fortifiant contre la chute des cheveux.', composition: 'Minoxidil 2%, Biotin, Caffeine, Saw Palmetto', priceRange: [22, 40] },
    { name: 'Spray Thermo-Protecteur', description: 'Protection thermique pour le brushing et le lissage.', composition: 'Silicone, Keratin, Vitamin E, Heat Protectants', priceRange: [10, 20] },
    { name: 'Shampoing Cheveux Colorés', description: 'Shampoing protecteur pour préserver l\'éclat de la couleur.', composition: 'UV Filters, Keratin, Vitamin E, Quinoa Protein', priceRange: [12, 22] },
    { name: 'Bain d\'Huile Pré-Shampoing', description: 'Soin nutritif à appliquer avant le shampoing.', composition: 'Coconut Oil, Castor Oil, Argan Oil, Vitamin E', priceRange: [12, 24] },
    { name: 'Mousse Coiffante Fixation', description: 'Mousse légère pour structurer et fixer les coiffures.', composition: 'Polymers, Keratin, Panthenol, UV Filters', priceRange: [8, 16] },
  ],
  'complements-alimentaires': [
    { name: 'Multivitamines Complet', description: 'Complexe de vitamines et minéraux pour la vitalité quotidienne.', composition: 'Vitamins A, B, C, D, E, Zinc, Iron, Magnesium', priceRange: [14, 28] },
    { name: 'Oméga 3 Huile de Poisson', description: 'Acides gras essentiels pour le cœur et le cerveau.', composition: 'Fish Oil, EPA 180mg, DHA 120mg, Vitamin E', priceRange: [12, 26] },
    { name: 'Vitamine D3 1000 UI', description: 'Vitamine D pour les os et l\'immunité.', composition: 'Vitamin D3 1000 IU, MCT Oil', priceRange: [8, 16] },
    { name: 'Magnésium Marin', description: 'Magnésium naturel pour réduire la fatigue et le stress.', composition: 'Marine Magnesium 300mg, Vitamin B6', priceRange: [10, 22] },
    { name: 'Probiotiques Flore Intestinale', description: 'Ferments lactiques pour l\'équilibre digestif.', composition: 'Lactobacillus, Bifidobacterium, 10 Billion CFU', priceRange: [14, 28] },
    { name: 'Fer + Vitamine C', description: 'Fer hautement absorbable avec vitamine C.', composition: 'Iron Bisglycinate 14mg, Vitamin C 80mg', priceRange: [10, 20] },
    { name: 'Collagène Marin', description: 'Peptides de collagène pour la peau et les articulations.', composition: 'Marine Collagen Peptides, Vitamin C, Hyaluronic Acid', priceRange: [22, 40] },
    { name: 'Zinc + Sélénium', description: 'Oligo-éléments pour l\'immunité et les cheveux.', composition: 'Zinc 15mg, Selenium 55mcg, Vitamin E', priceRange: [8, 18] },
    { name: 'Spiruline Bio', description: 'Super-aliment riche en protéines et nutriments.', composition: 'Organic Spirulina 500mg, Iron, Protein', priceRange: [12, 24] },
    { name: 'Curcuma + Pipérine', description: 'Anti-inflammatoire naturel avec meilleure absorption.', composition: 'Curcumin 95%, Black Pepper Extract 5%', priceRange: [14, 26] },
    { name: 'Mélatonine 1mg', description: 'Aide naturelle pour améliorer le sommeil.', composition: 'Melatonin 1mg, Vitamin B6', priceRange: [8, 16] },
    { name: 'Ginseng Énergie', description: 'Plante adaptogène pour la vitalité et la concentration.', composition: 'Korean Ginseng 250mg, Vitamin B Complex', priceRange: [14, 26] },
    { name: 'Acide Hyaluronique 200mg', description: 'Pour l\'hydratation de la peau et les articulations.', composition: 'Hyaluronic Acid 200mg, Vitamin C', priceRange: [18, 32] },
    { name: 'Biotine Cheveux', description: 'Vitamine B8 pour des cheveux et ongles renforcés.', composition: 'Biotin 10000mcg, Zinc, Selenium', priceRange: [10, 22] },
    { name: 'Ashwagandha Bio', description: 'Adaptogène pour le stress et le sommeil.', composition: 'Organic Ashwagandha 600mg, 5% Withanolides', priceRange: [14, 26] },
  ],
  'bebe-maman': [
    { name: 'Lait Corps Bébé Hydratant', description: 'Lait doux pour hydrater la peau délicate de bébé.', composition: 'Shea Butter, Sweet Almond Oil, Chamomile, Vitamin E', priceRange: [8, 16] },
    { name: 'Liniment Oléo-Calcaire', description: 'Soin nettoyant et protecteur pour le change de bébé.', composition: 'Olive Oil, Lime Water, Beeswax', priceRange: [8, 16] },
    { name: 'Gel Lavant Doux Bébé', description: 'Gel lavant corps et cheveux pour bébé.', composition: 'Coconut Surfactants, Chamomile, Calendula, Glycerin', priceRange: [8, 14] },
    { name: 'Crème Change Protective', description: 'Crème de change pour protéger les fesses de bébé.', composition: 'Zinc Oxide 15%, Lanolin, Shea Butter, Vitamin E', priceRange: [8, 16] },
    { name: 'Eau Nettoyante Bébé', description: 'Eau micellaire douce pour nettoyer bébé sans rinçage.', composition: 'Aqua, Glycerin, Chamomile, Aloe Vera', priceRange: [6, 14] },
    { name: 'Huile de Massage Bébé', description: 'Huile douce pour masser et relaxer bébé.', composition: 'Sweet Almond Oil, Jojoba Oil, Chamomile, Lavender', priceRange: [10, 18] },
    { name: 'Baume Allaitement', description: 'Soin protecteur et apaisant pour les mamelons.', composition: 'Lanolin, Shea Butter, Calendula, Vitamin E', priceRange: [10, 18] },
    { name: 'Crème Anti-Vergetures Grossesse', description: 'Soin préventif pour les vergetures de grossesse.', composition: 'Centella Asiatica, Vitamin E, Rosehip Oil, Elastin', priceRange: [18, 32] },
    { name: 'Complément Grossesse', description: 'Vitamines et minéraux essentiels pour la grossesse.', composition: 'Folic Acid 400mcg, Iron 14mg, Iodine, Vitamin D', priceRange: [16, 28] },
    { name: 'Sérum Physiologique', description: 'Doses de sérum physiologique pour le nez et les yeux de bébé.', composition: 'Sodium Chloride 0.9%, Sterile Water', priceRange: [4, 10] },
    { name: 'Crème Solaire Bébé SPF 50+', description: 'Protection solaire maximale pour la peau sensible de bébé.', composition: 'Titanium Dioxide, Zinc Oxide, Calendula, Vitamin E', priceRange: [14, 24] },
    { name: 'Dentifrice Premier Âge', description: 'Dentifrice sans fluor pour les premières dents de bébé.', composition: 'Xylitol, Calendula, Calcium, Natural Strawberry', priceRange: [4, 10] },
  ],
  'minceur-dietetique': [
    { name: 'Draineur Détox', description: 'Boisson drainante pour éliminer les toxines et l\'eau.', composition: 'Thé Vert, Pissenlit, Reine des Prés, Citron', priceRange: [14, 26] },
    { name: 'Brûleur de Graisses', description: 'Complément minceur pour activer le métabolisme.', composition: 'Caféine, Thé Vert, Guarana, Chrome', priceRange: [18, 32] },
    { name: 'Coupe-Faim Naturel', description: 'Gélules à base de konjac pour réduire l\'appétit.', composition: 'Konjac Glucomannane, Nopal, Chrome', priceRange: [14, 26] },
    { name: 'Substitut de Repas', description: 'Shake protéiné pour remplacer un repas.', composition: 'Whey Protein, Vitamins, Minerals, Fiber', priceRange: [22, 38] },
    { name: 'Gel Minceur Ventre Plat', description: 'Gel amincissant ciblé pour la zone abdominale.', composition: 'Caffeine, L-Carnitine, Algae Extract, Ginger', priceRange: [18, 32] },
    { name: 'Tisane Minceur', description: 'Infusion détox et drainage pour accompagner le régime.', composition: 'Thé Vert, Hibiscus, Fenouil, Menthe', priceRange: [6, 14] },
    { name: 'CLA Acide Linoléique', description: 'Acide gras pour favoriser la perte de masse grasse.', composition: 'Conjugated Linoleic Acid 1000mg', priceRange: [16, 28] },
    { name: 'Crème Anti-Cellulite', description: 'Soin ciblé pour réduire l\'aspect peau d\'orange.', composition: 'Caffeine, L-Carnitine, Ivy Extract, Retinol', priceRange: [18, 34] },
    { name: 'Protéines Végétales', description: 'Poudre de protéines végétales pour le sport et la minceur.', composition: 'Pea Protein, Rice Protein, Hemp Protein', priceRange: [22, 38] },
    { name: 'Capteur de Graisses', description: 'Complément pour limiter l\'absorption des graisses.', composition: 'Chitosan, Nopal, Vitamin C', priceRange: [16, 28] },
  ],
  'aromatherapie': [
    { name: 'Huile Essentielle Lavande', description: 'Huile essentielle relaxante pour le sommeil et le stress.', composition: 'Lavandula Angustifolia Oil 100%', priceRange: [8, 16] },
    { name: 'Huile Essentielle Tea Tree', description: 'Huile purifiante aux propriétés antibactériennes.', composition: 'Melaleuca Alternifolia Oil 100%', priceRange: [8, 16] },
    { name: 'Huile Essentielle Menthe Poivrée', description: 'Huile rafraîchissante pour les maux de tête et la digestion.', composition: 'Mentha Piperita Oil 100%', priceRange: [8, 14] },
    { name: 'Huile Essentielle Eucalyptus', description: 'Huile purifiante pour les voies respiratoires.', composition: 'Eucalyptus Globulus Oil 100%', priceRange: [6, 14] },
    { name: 'Diffuseur Huiles Essentielles', description: 'Diffuseur ultrasonique pour aromathérapie.', composition: 'Ultrasonic Technology, LED Lights', priceRange: [25, 50] },
    { name: 'Huile Essentielle Citron', description: 'Huile tonifiante et purifiante aux propriétés assainissantes.', composition: 'Citrus Limon Oil 100%', priceRange: [6, 12] },
    { name: 'Huile Essentielle Ravintsara', description: 'Huile immunostimulante et antivirale.', composition: 'Cinnamomum Camphora Oil 100%', priceRange: [10, 18] },
    { name: 'Roll-On Stress et Anxiété', description: 'Roll-on aux huiles essentielles relaxantes.', composition: 'Lavender, Ylang-Ylang, Chamomile, Jojoba Oil', priceRange: [10, 18] },
    { name: 'Huile Végétale Amande Douce', description: 'Huile de base pour diluer les huiles essentielles.', composition: 'Prunus Amygdalus Dulcis Oil 100%', priceRange: [8, 16] },
    { name: 'Coffret Huiles Essentielles', description: 'Coffret découverte de 6 huiles essentielles bio.', composition: 'Lavender, Tea Tree, Eucalyptus, Lemon, Peppermint, Orange', priceRange: [28, 48] },
    { name: 'Huile Essentielle Ylang-Ylang', description: 'Huile relaxante et aphrodisiaque.', composition: 'Cananga Odorata Oil 100%', priceRange: [12, 22] },
    { name: 'Spray Assainissant', description: 'Spray purifiant pour assainir l\'air ambiant.', composition: 'Tea Tree, Ravintsara, Eucalyptus, Alcohol', priceRange: [10, 18] },
  ],
  'premiers-soins': [
    { name: 'Pansements Assortis', description: 'Boîte de pansements de différentes tailles.', composition: 'Hypoallergenic Adhesive, Sterile Pad', priceRange: [4, 10] },
    { name: 'Désinfectant Chlorhexidine', description: 'Solution antiseptique pour nettoyer les plaies.', composition: 'Chlorhexidine 0.5%, Alcohol 70%', priceRange: [4, 10] },
    { name: 'Bande Élastique', description: 'Bande de maintien élastique pour les entorses.', composition: 'Cotton, Elastane, Latex-Free', priceRange: [3, 8] },
    { name: 'Compresses Stériles', description: 'Compresses de gaze stériles pour soins des plaies.', composition: 'Sterile Cotton Gauze', priceRange: [3, 8] },
    { name: 'Gel Arnica', description: 'Gel apaisant pour les coups et les bleus.', composition: 'Arnica Montana 7%, Menthol, Camphor', priceRange: [8, 16] },
    { name: 'Spray Antiseptique', description: 'Spray désinfectant pour petites plaies et coupures.', composition: 'Chlorhexidine, Benzalkonium Chloride', priceRange: [6, 12] },
    { name: 'Thermomètre Digital', description: 'Thermomètre médical à lecture rapide.', composition: 'Digital Sensor, Beep Alert, Memory Function', priceRange: [8, 18] },
    { name: 'Crème Brûlures', description: 'Soin apaisant pour les brûlures légères.', composition: 'Trolamine, Hyaluronic Acid, Aloe Vera', priceRange: [8, 16] },
    { name: 'Baume du Tigre', description: 'Baume chauffant pour les douleurs musculaires.', composition: 'Camphor, Menthol, Clove Oil, Cassia Oil', priceRange: [8, 16] },
    { name: 'Trousse de Secours', description: 'Kit premiers soins complet pour la maison ou le voyage.', composition: 'Bandages, Gauze, Antiseptic, Scissors, Gloves', priceRange: [18, 35] },
    { name: 'Sérum Physiologique Doses', description: 'Doses de sérum pour le lavage nasal et oculaire.', composition: 'Sodium Chloride 0.9%, Sterile Water', priceRange: [4, 10] },
    { name: 'Spray Nasal Décongestionnant', description: 'Spray pour décongestionner le nez bouché.', composition: 'Sodium Chloride, Eucalyptus, Seawater', priceRange: [6, 12] },
  ],
  'homme': [
    { name: 'Mousse à Raser Peaux Sensibles', description: 'Mousse onctueuse pour un rasage confortable.', composition: 'Aloe Vera, Glycerin, Chamomile, Vitamin E', priceRange: [6, 14] },
    { name: 'Baume Après-Rasage', description: 'Soin apaisant et hydratant après le rasage.', composition: 'Aloe Vera, Allantoin, Bisabolol, Vitamin E', priceRange: [10, 20] },
    { name: 'Gel Douche Homme 3 en 1', description: 'Gel corps, cheveux et visage au parfum boisé.', composition: 'Menthol, Cedarwood, Glycerin, Panthenol', priceRange: [8, 16] },
    { name: 'Crème Visage Homme Hydratante', description: 'Soin hydratant matifiant pour homme.', composition: 'Hyaluronic Acid, Niacinamide, Caffeine, Vitamin E', priceRange: [14, 26] },
    { name: 'Déodorant Homme 48h', description: 'Anti-transpirant longue durée au parfum frais.', composition: 'Aluminum Chlorohydrate, Zinc, Menthol', priceRange: [6, 14] },
    { name: 'Huile Barbe Nourrissante', description: 'Huile pour adoucir et discipliner la barbe.', composition: 'Argan Oil, Jojoba Oil, Vitamin E, Cedarwood', priceRange: [12, 24] },
    { name: 'Shampoing Anti-Chute Homme', description: 'Shampoing fortifiant contre la chute des cheveux.', composition: 'Caffeine, Biotin, Saw Palmetto, Zinc', priceRange: [12, 24] },
    { name: 'Gel Coiffant Fixation Forte', description: 'Gel coiffant longue tenue sans effet cartonné.', composition: 'Polymers, Keratin, Panthenol, UV Filters', priceRange: [8, 16] },
    { name: 'Gommage Visage Homme', description: 'Exfoliant purifiant pour un teint frais.', composition: 'Volcanic Sand, Charcoal, Tea Tree, Salicylic Acid', priceRange: [10, 20] },
    { name: 'Contour des Yeux Homme', description: 'Soin anti-fatigue et anti-cernes pour homme.', composition: 'Caffeine, Peptides, Vitamin C, Hyaluronic Acid', priceRange: [16, 28] },
    { name: 'Baume à Barbe', description: 'Baume coiffant et nourrissant pour la barbe.', composition: 'Shea Butter, Beeswax, Argan Oil, Vitamin E', priceRange: [12, 22] },
    { name: 'Lotion Tonique Homme', description: 'Lotion fraîche pour tonifier et purifier le visage.', composition: 'Witch Hazel, Menthol, Aloe Vera, Zinc', priceRange: [10, 18] },
  ],
  'bio-naturel': [
    { name: 'Crème Visage Bio Aloe Vera', description: 'Crème hydratante certifiée bio à l\'aloe vera.', composition: 'Organic Aloe Vera, Shea Butter, Jojoba Oil', priceRange: [16, 28] },
    { name: 'Savon d\'Alep 20%', description: 'Savon traditionnel à l\'huile de baies de laurier.', composition: 'Olive Oil, Laurel Oil 20%, Sodium Hydroxide', priceRange: [6, 14] },
    { name: 'Huile d\'Argan Bio', description: 'Huile pure bio pour le visage, le corps et les cheveux.', composition: 'Organic Argania Spinosa Kernel Oil 100%', priceRange: [16, 30] },
    { name: 'Shampooing Solide Bio', description: 'Shampooing zéro déchet aux ingrédients naturels.', composition: 'SCI, Coconut Oil, Essential Oils, Aloe Vera Powder', priceRange: [8, 16] },
    { name: 'Déodorant Bio Pierre d\'Alun', description: 'Déodorant naturel certifié bio sans aluminium.', composition: 'Potassium Alum, Aloe Vera, Essential Oils', priceRange: [6, 14] },
    { name: 'Beurre de Karité Pur Bio', description: 'Beurre de karité brut et non raffiné.', composition: 'Organic Butyrospermum Parkii Butter 100%', priceRange: [10, 20] },
    { name: 'Eau Florale Rose Bio', description: 'Hydrolat de rose damascena certifié bio.', composition: 'Rosa Damascena Flower Water 100%', priceRange: [10, 18] },
    { name: 'Gel Douche Bio Lavande', description: 'Gel lavant doux certifié bio à la lavande.', composition: 'Organic Coconut Surfactants, Lavender Oil, Aloe Vera', priceRange: [8, 16] },
    { name: 'Crème Mains Bio Calendula', description: 'Soin réparateur bio au calendula.', composition: 'Organic Calendula, Shea Butter, Coconut Oil', priceRange: [8, 16] },
    { name: 'Huile de Coco Vierge Bio', description: 'Huile de coco multi-usages certifiée bio.', composition: 'Organic Cocos Nucifera Oil 100%', priceRange: [10, 20] },
    { name: 'Dentifrice Bio Menthe', description: 'Dentifrice naturel certifié bio à la menthe.', composition: 'Calcium Carbonate, Aloe Vera, Peppermint Oil', priceRange: [5, 12] },
    { name: 'Sérum Visage Bio Vitamine C', description: 'Sérum anti-oxydant bio à la vitamine C naturelle.', composition: 'Organic Rosehip Oil, Vitamin C, Vitamin E', priceRange: [22, 38] },
  ],
};

// Fonction pour générer un prix aléatoire dans une plage
function getRandomPrice(range: [number, number]): number {
  const [min, max] = range;
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// Fonction pour générer un stock aléatoire
function getRandomStock(): number {
  return Math.floor(Math.random() * 150) + 10;
}

// Fonction pour obtenir une image aléatoire pour une catégorie
function getRandomImage(categorySlug: string, index: number): string {
  const images = productImages[categorySlug as keyof typeof productImages];
  if (!images || images.length === 0) {
    return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80';
  }
  return images[index % images.length];
}

// Générer tous les produits
function generateProducts() {
  const products: Array<{
    name: string;
    description: string;
    composition: string;
    price: number;
    image: string;
    categorySlug: string;
    isPromotion: boolean;
    promotionPercentage: number;
    isPack: boolean;
    stock: number;
  }> = [];

  const categoryKeys = Object.keys(productTemplates);
  let productIndex = 0;

  // Générer des produits pour atteindre 500
  while (products.length < 500) {
    for (const categorySlug of categoryKeys) {
      const templates = productTemplates[categorySlug];
      
      for (let i = 0; i < templates.length && products.length < 500; i++) {
        const template = templates[i];
        const variant = Math.floor(productIndex / (categoryKeys.length * templates.length));
        
        // Ajouter des variantes pour avoir plus de produits
        let productName = template.name;
        if (variant > 0) {
          const sizes = ['50ml', '100ml', '200ml', '250ml', '500ml'];
          const variants = ['Original', 'Intense', 'Sensitive', 'Fresh', 'Premium', 'Expert', 'Pro'];
          if (variant % 2 === 0) {
            productName = `${template.name} ${sizes[variant % sizes.length]}`;
          } else {
            productName = `${template.name} ${variants[variant % variants.length]}`;
          }
        }

        const isPromotion = Math.random() < 0.25; // 25% de produits en promo
        const isPack = Math.random() < 0.1; // 10% de packs

        products.push({
          name: productName,
          description: template.description,
          composition: template.composition,
          price: getRandomPrice(template.priceRange),
          image: getRandomImage(categorySlug, i + variant),
          categorySlug: categorySlug,
          isPromotion,
          promotionPercentage: isPromotion ? [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)] : 0,
          isPack,
          stock: getRandomStock(),
        });

        productIndex++;
      }
    }
  }

  return products.slice(0, 500);
}

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the database
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Clear existing data
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert categories
    const insertedCategories = await db.collection('categories').insertMany(categories);
    console.log(`✅ Inserted ${categories.length} categories`);

    // Create a map of slug to ObjectId
    const categoryMap: Record<string, any> = {};
    categories.forEach((cat, index) => {
      categoryMap[cat.slug] = Object.values(insertedCategories.insertedIds)[index];
    });

    // Generate products
    const productsData = generateProducts();
    
    // Map products with correct category IDs
    const products = productsData.map((product) => ({
      name: product.name,
      description: product.description,
      composition: product.composition,
      price: product.price,
      image: product.image,
      categoryId: categoryMap[product.categorySlug],
      isPromotion: product.isPromotion,
      promotionPercentage: product.promotionPercentage,
      isPack: product.isPack,
      stock: product.stock,
    }));

    // Insert products in batches
    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await db.collection('products').insertMany(batch);
      console.log(`✅ Inserted products ${i + 1} to ${Math.min(i + batchSize, products.length)}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSummary:');
    console.log(`- ${categories.length} categories`);
    console.log(`- ${products.length} products`);
    console.log(`- ${products.filter(p => p.isPromotion).length} products on promotion`);
    console.log(`- ${products.filter(p => p.isPack).length} packs`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
