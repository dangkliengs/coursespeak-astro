import { promises } from 'fs';
import path from 'path';

const deals = [
  {
    id: "1",
    title: "JavaScript Fundamentals (Udemy)",
    provider: "Udemy",
    price: 0,
    originalPrice: 84.99,
    rating: 4.6,
    students: 12500,
    coupon: "FREESEPT",
    url: "https://www.udemy.com/course/js-fundamentals/?couponCode=FREESEPT",
    category: "Development",
    subcategory: "JavaScript",
    expiresAt: new Date(Date.now() + 3 * 24 * 3600 * 1e3).toISOString(),
    image: "https://picsum.photos/seed/deal1/800/450",
    description: "Pelajari dasar-dasar JavaScript dari variabel hingga DOM manipulation.",
    content: `# Ringkasan Kursus
Kuasai dasar JavaScript untuk membangun website interaktif. Cocok untuk pemula yang ingin masuk ke dunia web development.

## Kenapa Belajar JavaScript?
- Bahasa utama untuk interaksi di browser
- Ekosistem luas: React, Next.js, Node.js
- Karier dan kesempatan proyek yang besar

## Apa yang Akan Kamu Pelajari
- Tipe data, variabel, operator
- Control flow (if/else, loop)
- Fungsi, scope, dan closures
- Array/Object dan method populer
- DOM selection, event handling
- Best practices & debugging

## Contoh Kode Singkat
Gunakan addEventListener untuk menangani click:
document.getElementById('btn').addEventListener('click', () => { console.log('Clicked!'); });

## Proyek Mini
- Membuat to-do list sederhana
- Membuat galeri gambar interaktif
- Form validation dasar

## Sumber Tambahan
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Udemy Course Link](https://www.udemy.com/course/js-fundamentals/?couponCode=FREESEPT)

Terus berlatih dan eksplorasi!`,
    learn: [
      "Memahami tipe data, variabel, dan operator",
      "Kontrol alur: if/else, loop, dan switch",
      "Fungsi, scope, dan closures",
      "Array dan Object manipulation",
      "DOM selection & event handling",
      "Best practices dan debugging"
    ],
    requirements: [
      "Komputer dengan browser modern",
      "Semangat belajar dan rasa ingin tahu"
    ],
    curriculum: [
      {
        section: "Pengenalan & Setup",
        lectures: [
          { title: "Apa itu JavaScript?", duration: "6m" },
          { title: "Menyiapkan Editor & Tools", duration: "8m" }
        ]
      },
      {
        section: "Fundamental JavaScript",
        lectures: [
          { title: "Tipe Data & Variabel", duration: "12m" },
          { title: "Operator & Ekspresi", duration: "10m" },
          { title: "Conditionals & Looping", duration: "14m" }
        ]
      },
      {
        section: "Fungsi & Struktur Data",
        lectures: [
          { title: "Fungsi, Scope, dan Closure", duration: "16m" },
          { title: "Array Methods (map/filter/reduce)", duration: "18m" },
          { title: "Object & Destructuring", duration: "15m" }
        ]
      },
      {
        section: "DOM & Event Handling",
        lectures: [
          { title: "DOM Selection & Manipulation", duration: "20m" },
          { title: "Events & Form Handling", duration: "17m" }
        ]
      }
    ],
    faqs: [
      { q: "Apakah kursus ini cocok untuk pemula?", a: "Ya, materi dirancang untuk pemula tanpa pengalaman coding sebelumnya." },
      { q: "Berapa lama waktu belajar yang dibutuhkan?", a: "Jika belajar rutin 1-2 jam per hari, rata-rata 1-2 minggu untuk menyelesaikan dasar-dasar." },
      { q: "Apakah saya mendapatkan sertifikat?", a: "Sertifikat penyelesaian disediakan oleh Udemy setelah menyelesaikan kursus." }
    ]
  },
  {
    id: "2",
    title: "Python for Data Science (Coursera)",
    provider: "Coursera",
    price: 0,
    originalPrice: 49,
    rating: 4.7,
    students: 52340,
    coupon: void 0,
    url: "https://www.coursera.org/learn/python-data-science",
    category: "Data Science",
    expiresAt: new Date(Date.now() + 5 * 24 * 3600 * 1e3).toISOString(),
    image: "https://picsum.photos/seed/deal2/800/450",
    description: "Dasar Python untuk analisis data dan visualisasi.",
    content: "Mulai dari sintaks dasar Python, manipulasi data dengan Pandas, hingga visualisasi dengan Matplotlib. Cocok untuk pemula yang ingin masuk ke dunia data science.",
    faqs: [
      { q: "Apakah butuh pengalaman sebelumnya?", a: "Tidak wajib, namun akan membantu jika pernah memrogram sebelumnya." }
    ]
  },
  {
    id: "3",
    title: "UI/UX Design Bootcamp",
    provider: "Udemy",
    price: 0,
    originalPrice: 59.99,
    rating: 4.5,
    students: 9800,
    coupon: "UXFREE",
    url: "https://www.udemy.com/course/ui-ux-design-bootcamp/",
    category: "Design",
    expiresAt: new Date(Date.now() + 2 * 24 * 3600 * 1e3).toISOString(),
    image: "https://picsum.photos/seed/deal3/800/450",
    description: "Bootcamp intensif UI/UX dari riset hingga prototyping.",
    content: "Belajar proses desain produk: riset pengguna, arsitektur informasi, wireframing, prototyping, dan usability testing menggunakan tool populer."
  },
  {
    id: "4",
    title: "Digital Marketing Essentials",
    provider: "Udemy",
    price: 0,
    originalPrice: 89.99,
    rating: 4.4,
    students: 30210,
    coupon: "MKT-FREE",
    url: "https://www.udemy.com/course/digital-marketing-essentials/",
    category: "Marketing",
    expiresAt: new Date(Date.now() + 1 * 24 * 3600 * 1e3).toISOString(),
    image: "https://picsum.photos/seed/deal4/800/450",
    description: "Fundamental digital marketing termasuk SEO, SEM, dan social media."
  },
  {
    id: "5",
    title: "Kubernetes for Beginners",
    provider: "Coursera",
    price: 0,
    originalPrice: 39.99,
    rating: 4.6,
    students: 40500,
    coupon: void 0,
    url: "https://www.coursera.org/learn/kubernetes-basics",
    category: "IT & Software",
    subcategory: "DevOps",
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1e3).toISOString(),
    image: "https://picsum.photos/seed/deal5/800/450",
    description: "Pengenalan Kubernetes untuk orkestrasi container."
  },
  {
    id: "6",
    title: "Advanced React Patterns",
    provider: "Udemy",
    price: 0,
    originalPrice: 94.99,
    rating: 4.8,
    students: 18800,
    coupon: "REACTPRO",
    url: "https://www.udemy.com/course/advanced-react-patterns/",
    category: "Development",
    expiresAt: new Date(Date.now() + 4 * 24 * 3600 * 1e3).toISOString(),
    image: "https://picsum.photos/seed/deal6/800/450",
    description: "Pattern lanjutan React untuk aplikasi besar."
  },
  {
    id: "7",
    title: "SQL for Data Analysis",
    provider: "Coursera",
    price: 0,
    originalPrice: 29.99,
    rating: 4.7,
    students: 65e3,
    coupon: void 0,
    url: "https://www.coursera.org/learn/sql-data-analysis",
    category: "Data Science",
    expiresAt: new Date(Date.now() + 6 * 24 * 3600 * 1e3).toISOString(),
    image: "https://picsum.photos/seed/deal7/800/450",
    description: "Kuasai SQL untuk analisis data praktis."
  },
  {
    id: "8",
    title: "Figma from Zero to Hero",
    provider: "Udemy",
    price: 0,
    originalPrice: 49.99,
    rating: 4.6,
    students: 15800,
    coupon: "FIGMAFREE",
    url: "https://www.udemy.com/course/figma-zero-to-hero/",
    category: "Design",
    expiresAt: new Date(Date.now() + 2 * 24 * 3600 * 1e3).toISOString(),
    image: "https://picsum.photos/seed/deal8/800/450",
    description: "Belajar Figma dari dasar hingga mahir."
  },
  {
    id: "9",
    title: "AWS Practitioner Crash Course",
    provider: "Udemy",
    price: 0,
    originalPrice: 99.99,
    rating: 4.6,
    students: 74e3,
    coupon: "AWSPRACT",
    url: "https://www.udemy.com/course/aws-certified-cloud-practitioner/",
    category: "IT & Software",
    subcategory: "Cloud Computing",
    expiresAt: new Date(Date.now() + 3 * 24 * 3600 * 1e3).toISOString(),
    image: "https://picsum.photos/seed/deal9/800/450",
    description: "Persiapan cepat AWS Cloud Practitioner."
  },
  {
    id: "10",
    title: "Next.js 14 Mastery",
    provider: "Udemy",
    price: 0,
    originalPrice: 109.99,
    rating: 4.8,
    students: 9200,
    coupon: "NEXT14FREE",
    url: "https://www.udemy.com/course/nextjs-14-mastery/",
    category: "Development",
    expiresAt: new Date(Date.now() + 2 * 24 * 3600 * 1e3).toISOString(),
    image: "https://picsum.photos/seed/deal10/800/450",
    description: "Menguasai fitur terbaru Next.js 14."
  },
  {
    id: "11",
    title: "Prompt Engineering Basics",
    provider: "Coursera",
    price: 0,
    originalPrice: 19.99,
    rating: 4.5,
    students: 21e3,
    coupon: void 0,
    url: "https://www.coursera.org/learn/prompt-engineering",
    category: "Data Science",
    subcategory: "Artificial Intelligence (AI)",
    expiresAt: new Date(Date.now() + 8 * 24 * 3600 * 1e3).toISOString(),
    image: "https://picsum.photos/seed/deal11/800/450",
    description: "Dasar merancang prompt yang efektif untuk AI."
  },
  {
    id: "12",
    title: "SEO Fundamentals 2025",
    provider: "Udemy",
    price: 0,
    originalPrice: 79.99,
    rating: 4.4,
    students: 33e3,
    coupon: "SEOFREE",
    url: "https://www.udemy.com/course/seo-fundamentals-2025/",
    category: "Marketing",
    expiresAt: new Date(Date.now() + 5 * 24 * 3600 * 1e3).toISOString(),
    image: "https://picsum.photos/seed/deal12/800/450",
    description: "Fundamental SEO terkini untuk 2025."
  },
  {
    id: "13",
    title: "Generative AI (GenAI) Masterclass",
    provider: "Udemy",
    price: 0,
    originalPrice: 89.99,
    rating: 4.7,
    students: 15e3,
    coupon: "GENAIFREE",
    url: "https://www.udemy.com/course/generative-ai-genai-masterclass/",
    category: "IT & Software",
    subcategory: "Generative AI (GenAI)",
    expiresAt: new Date(Date.now() + 4 * 24 * 3600 * 1e3).toISOString(),
    image: "https://picsum.photos/seed/deal13/800/450",
    description: "Master Generative AI and GenAI tools for modern applications."
  }
];

const DEFAULT_DATA_DIR = path.join(process.cwd(), "src", "data");
function resolveDealsFilePath() {
  const raw = process.env.DEALS_PATH?.trim();
  if (!raw) {
    return path.join(DEFAULT_DATA_DIR, "deals.json");
  }
  let resolved = path.resolve(raw);
  if (!path.extname(resolved)) {
    resolved = path.join(resolved, "deals.json");
  }
  return resolved;
}
const DEALS_FILE = resolveDealsFilePath();
const DEALS_DIR = path.dirname(DEALS_FILE);
async function readDealsFromFile() {
  try {
    const buf = await promises.readFile(DEALS_FILE, "utf-8");
    const data = JSON.parse(buf);
    if (Array.isArray(data)) {
      return data;
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeDealsToFile(deals);
    }
    return deals;
  }
  return deals;
}
async function writeDealsToFile(all) {
  await promises.mkdir(DEALS_DIR, { recursive: true });
  await promises.writeFile(DEALS_FILE, JSON.stringify(all, null, 2), "utf-8");
}
function sortByRecency(deals) {
  return [...deals].sort((a, b) => {
    const timeA = new Date(a.updatedAt ?? a.createdAt ?? a.expiresAt ?? 0).getTime();
    const timeB = new Date(b.updatedAt ?? b.createdAt ?? b.expiresAt ?? 0).getTime();
    return timeB - timeA;
  });
}
async function readDeals() {
  const deals = await readDealsFromFile();
  return sortByRecency(deals);
}

export { readDeals as r };
