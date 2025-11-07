import { useState } from "react";
import emailjs from "emailjs-com";
import { motion } from "framer-motion";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => setStatus("✅ Message sent successfully!"),
        (error) => {
          console.error("EmailJS Error:", error);
          setStatus("❌ Failed to send message. Try again.");
        }
      );
  };

  return (
    <motion.div
      className="pt-28 px-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-8 max-w-lg w-full shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
        <form onSubmit={sendEmail} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-900/70 rounded-lg border border-gray-700 text-gray-200 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-900/70 rounded-lg border border-gray-700 text-gray-200 focus:outline-none focus:border-indigo-500"
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-900/70 rounded-lg border border-gray-700 text-gray-200 focus:outline-none focus:border-indigo-500"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Send Message
          </button>
        </form>
        {status && <p className="text-center mt-4 text-sm">{status}</p>}
      </div>
    </motion.div>
  );
}
