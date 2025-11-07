import { motion } from "framer-motion";

export default function Companies() {
  const companies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
  ];

  return (
    <motion.div
      className="pt-28 px-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-bold text-center mb-10">Trusted by Leading Companies</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center">
        {companies.map((c, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1 }}
            className="bg-gray-800/60 p-6 rounded-2xl shadow-lg border border-gray-700/40 w-48 h-48 flex flex-col items-center justify-center"
          >
            <img src={c.logo} alt={c.name} className="h-12 mb-3" />
            <p className="text-lg font-semibold">{c.name}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
