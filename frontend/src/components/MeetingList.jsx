import MeetingCard from "./MeetingCard";

function MeetingList({ meetings, loading, navigate }) {
  const getStatusBadge = (status) => {
    const badges = {
      uploaded: "bg-gray-700 text-gray-200",
      processing: "bg-yellow-700 text-yellow-200",
      completed: "bg-green-700 text-green-200",
      failed: "bg-red-700 text-red-200",
    };
    return badges[status] || badges.uploaded;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        <p className="mt-2 text-gray-400">Loading meetings...</p>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="bg-gray-900/80 border border-gray-700/40 rounded-xl shadow p-8 text-center text-gray-300">
        <p>No meetings yet. Upload your first recording!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        🗂️ Your Meetings
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {meetings.map((meeting) => (
          <MeetingCard
            key={meeting._id}
            meeting={meeting}
            navigate={navigate}
            getStatusBadge={getStatusBadge}
          />
        ))}
      </div>
    </div>
  );
}

export default MeetingList;
