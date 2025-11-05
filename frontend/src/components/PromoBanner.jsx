// src/components/PromoBanner.jsx
function PromoBanner({
  message = "🔥 Exclusive Deal: Get lifetime access to AI Meeting Summaries at 60% OFF — Limited Time Only!",
  gradient = "from-indigo-600 via-purple-600 to-pink-600",
}) {
  return (
    <div
      className={`fixed top-0 left-0 w-full bg-gradient-to-r ${gradient} text-white z-[9999] shadow-md`}
    >
      <div className="overflow-hidden whitespace-nowrap py-2">
        <div className="animate-marquee text-sm sm:text-base font-semibold">
          {message}
        </div>
      </div>
    </div>
  );
}

export default PromoBanner;
